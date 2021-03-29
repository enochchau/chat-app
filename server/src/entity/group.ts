import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  ManyToMany, 
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
  getConnection,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad
} from 'typeorm';
import { UserEntity } from './user';
import { MessageEntity } from './message';

import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Either';
import * as t from 'io-ts';

@Entity()
export class GroupEntity extends BaseEntity{
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 128,
  })
  name: string;

  @Column({
    nullable: true,
  })
  avatar: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToMany(type => UserEntity, user => user.groups)
  users: UserEntity[];

  @OneToMany(() => MessageEntity , message => message.group)
  messages: MessageEntity[];

  public static createGroupWithUsers(users: Array<UserEntity>, name: string){
    const newGroup = new GroupEntity();
    if (name) newGroup.name = name;
    newGroup.users = users;
    return this.save(newGroup);
  }

  @BeforeInsert()
  private async createName(){
    if(!this.name){
      this.name = this.users.reduce((acc, user, i) => {
        acc += user.name;
        if(i !== this.users.length-1) acc += ', '
        return acc;
      }, "");
    }
  }

  @BeforeUpdate()
  private async updateName(){
    try{
      if(this.name.split(',')[0] === this.users[0].name){
        this.name = this.users.reduce((acc, user, i) => {
          acc += user.name;
          if(i !== this.users.length-1) acc += ', '
          return acc;
        }, "");
      }
    } catch(error) {
      console.error(error);
    }
  }

  // returns -1 if group not found
  // returns groupId if group is found
  // Main idea: https://stackoverflow.com/questions/23605970/check-if-a-list-of-items-already-exists-in-a-sql-database
  public static async doesGroupExist(userIds: Array<number>): Promise<number>{
    // Shape of the object returned by querComparison
    const QueryShape = t.array(t.type({groupId: t.number}));
    type QueryShape = t.TypeOf<typeof QueryShape>;

    const createQueryString = () => userIds.reduce((str, id, index) => {
      str += `(${id})`;
      if(index !== userIds.length-1) str += ",";
      return str;
    }, "");
    const generateTableName = () => `does_group_exist_${Math.floor(Math.random() * Math.floor(1000000))}`;
    const createComparisonTable = () => 
      connection.query(`
        BEGIN;
        CREATE TABLE "${tableName}" (id INTEGER);
        INSERT INTO "${tableName}" VALUES ${strArr};
        COMMIT;
      `);
    // SubQuery gives a table with groupEntityId, memberCount, memberCountInList
    //    where the list is a table that holds the ids of the users we are looking for.
    const queryComparison = async () => 
      connection.query(`
        SELECT "sq"."groupEntityId" as "groupId"
        FROM (
          SELECT "ug"."groupEntityId"
              , count(*) AS "memberCount"
              , SUM(CASE WHEN "${tableName}"."id" IS NULL THEN 0 ELSE 1 END) AS  "memberCountInList"
          FROM "user_entity_groups_group_entity" "ug"
            LEFT OUTER JOIN "${tableName}" ON "ug"."userEntityId"="${tableName}"."id"
        GROUP BY "ug"."groupEntityId"
        ) AS "sq" 
        WHERE "sq"."memberCountInList"=(SELECT COUNT(*) FROM "${tableName}");
      `);
    const dropComparisonTable = () => connection.query(`
      DROP TABLE \"${tableName}\";
    `);

    const onBadShape = (errors: t.Errors):number => {
      throw Error('A bad object shape was returned from a raw query at GroupEntity.doesGroupExist()');
    }
    const onGoodShape = (result: QueryShape):number => {
      if(result.length > 1) throw Error(`A duplicate group was found in the database with userIds: ${userIds}`);
      if(result.length === 1) return result[0]["groupId"];
      return -1;
    }
    // main function starts here
    const strArr = createQueryString();
    const tableName = generateTableName();
    const connection = getConnection();
    try{
      await createComparisonTable();
      const result = await queryComparison();
      await dropComparisonTable(); // we don't have to await this when running on an actual server

      return pipe(QueryShape.decode(result), fold(onBadShape, onGoodShape));
    } catch(error){
      console.error(error);
    }
    return -1;
  }

  public static findGroupsOfUserId(userId: number, count: number, fromDate: Date){
    return this.createQueryBuilder("group")
      .leftJoin("group.users", "users")
      .where("users.id = :id", {id: userId})
      .andWhere("group.updated <= :date", {date: fromDate})
      .orderBy("group.updated", "DESC")
      .take(count)
      .getMany();
  }
  
  // return the index of the user if they are in the group
  // else return -1 if the user is not in the group
  public static getUserIndexInGroup(userId: number, group: GroupEntity): number{
    for(let [i, user] of group.users.entries()){
      if(user.id === userId){
        return i;
      }
    }
    return -1;
  }
  public static isUserInGroup(userId: number, group: GroupEntity): boolean{
    return this.getUserIndexInGroup(userId, group) !== -1
  }

  public static searchGroupByName(search: string, count: number){
    return this.createQueryBuilder("group")
      .orderBy("group.updated", "DESC")
      .where("LOWER(group.name) LIKE LOWER(:name)", {name: `${search}%`})
      .limit(count)
      .getMany();
  }

}