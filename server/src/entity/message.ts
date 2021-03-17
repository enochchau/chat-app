import { 
  BaseEntity, 
  Column, 
  Entity, 
  ManyToOne, 
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { GroupEntity } from "./group";
import { UserEntity } from "./user";

@Entity()
export class MessageEntity extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column()
  timestamp: Date;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column()
  groupId: number;

  @Column()
  userId: number;

  @ManyToOne(() => GroupEntity, group => group.messages)
  group: GroupEntity;

  @ManyToOne(() => UserEntity, user => user.messages)
  user: UserEntity;

  public static findMessagesOfGroupId(groupId: number, count: number, fromDate: Date){
    return this.createQueryBuilder("message")
      .where("message.groupId = :id", {id: groupId})
      .andWhere("message.timestamp <= :date", {date: fromDate})
      .orderBy("message.timestamp", "DESC")
      .take(count)
      .getMany();
  }

// `
// SELECT * FROM "message_entity" "m"
// WHERE "m"."timestamp" IN
// (SELECT MAX(timestamp) FROM "message_entity" "m"
// GROUP BY "m"."groupId")
// AND "m"."groupId" IN (1,2,3);
// `
  public static findLastMessageOfGroupIds(groupIds: Array<number>){
    return this.createQueryBuilder("message")
      .where( qb => {
        const subQuery = qb.subQuery()
          .select("MAX(message.timestamp)")
          .from(MessageEntity, "message")
          .groupBy("message.groupId")
          .getQuery();
        return "message.timestamp IN " + subQuery;
      })
      .andWhere("message.groupId IN (:...ids)", {ids: groupIds})
      .getMany();
  }
}

