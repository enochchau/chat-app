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
} from 'typeorm';
import { UserEntity } from './user';
import { MessageEntity } from './message';

import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Either';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';

@Entity()
export class GroupEntity extends BaseEntity{
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 128,
    nullable: true,
  })
  name: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToMany(type => UserEntity, user => user.groups)
  users: UserEntity[];

  @OneToMany(() => MessageEntity , message => message.group)
  messages: MessageEntity[];

  public static createGroupWithUsers(users: Array<UserEntity>, name: string | null = null){
    const newGroup = new GroupEntity();
    if (name) newGroup.name = name;
    newGroup.users = users;
    return this.save(newGroup);
  }

  public static findMessagesOfGroupId(groupId: number, count: number, fromDate: Date){
    return this
      .createQueryBuilder("group")
      .leftJoinAndSelect("group.messages", "messages")
      .where("group.id = :id", {id: groupId})
      .andWhere("messages.updated <= :date", {date: fromDate})
      .orderBy("messages.updated", "DESC")
      .limit(count)
      .getOne()
  }

  // returns -1 if group not found
  // returns groupId if group is found
  public static async doesGroupExist(userIds: Array<number>): Promise<number>{
    // Shape of the object returned by querComparison
    const QueryShape = t.array(t.type({groupId: t.number}));
    type QueryShape = t.TypeOf<typeof QueryShape>;

    const createQueryString = () => userIds.reduce((str, id, index) => {
      str += `(${id})`;
      if(index !== userIds.length-1) str += ",";
      return str;
    }, "");
    const createComparisonTableName = () => `does_group_exist_${Math.floor(Math.random() * Math.floor(1000000))}`;
    const createComparisonTable = () => 
      connection.query(
        `BEGIN;
        CREATE TABLE "${tableName}" (id INTEGER);
        INSERT INTO "${tableName}" VALUES ${strArr};
        COMMIT;`);
    // SubQuery: taking all groupIds and groupMemberCount that any of our users are a part of
    // MainQuery: finding the groupId that corresponds to the number of users we are looking for
    const queryComparison = async () => 
      connection.query(
        `SELECT "g"."groupEntityId" as "groupId" FROM (
          SELECT COUNT("ug"."groupEntityId") as "memberCount", "ug"."groupEntityId"
          FROM "${tableName}" LEFT OUTER JOIN "user_entity_groups_group_entity" "ug"
          ON "ug"."userEntityId" = "${tableName}"."id"
          GROUP BY "ug"."groupEntityId"
        ) AS "g" WHERE "memberCount"=${userIds.length};`
      );
    const dropComparisonTable = () => connection.query(`DROP TABLE \"${tableName}\";`);

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
    const tableName = createComparisonTableName();
    const connection = getConnection();
    try{
      await createComparisonTable();
      const result = await queryComparison();
      console.log(result);
      await dropComparisonTable(); // we don't have to await this when running on an actual server

      return pipe(QueryShape.decode(result), fold(onBadShape, onGoodShape));
    } catch(error){
      console.error(error);
    }
    return -1;
  }
}