import { BaseEntity, Connection, ViewColumn, ViewEntity } from "typeorm";

// expresion: (connection: Connection) => connection.createQueryBuilder()
//   .select("group.id", "id")
//   .addSelect("group.name", "name")
//   .addSelect("message.timestamp", "lastTimestamp")
//   .addSelect("message.message", "lastMessage")
//   .from(GroupEntity, "group")
//   .leftJoin( qb => {
//     const subQuery = qb.subQuery()
//       .select("message.message", "message")
//       .addSelect("message.timestamp", "timestamp")
//       .addSelect("message.groupId", "groupId")
//       .from(MessageEntity, "message")
//       .where( qb => {
//         const subQuery = qb.subQuery()
//           .select("MAX(message.timestamp)")
//           .from(MessageEntity, "message")
//           .groupBy("message.groupId")
//           .getQuery();
//         return "message.timestamp IN " + subQuery;
//       })
//       .getQuery();
//     return subQuery
//   }, "message")
//   .orderBy("message.timestamp", "ASC")
@ViewEntity({
 expression: `
  SELECT 
    "g"."id" as "id",
    "g"."name" as "name",
    "m"."timestamp" as "lastTimestamp",
    "m"."message" as "lastMessage"
  FROM "group_entity" "g"
  LEFT JOIN (
    SELECT "m"."message", "m"."timestamp", "m"."groupId" 
    FROM "message_entity" "m"
    WHERE "m"."timestamp" IN (
      SELECT MAX("timestamp") FROM "message_entity" "m"
      GROUP BY "m"."groupId" 
    )
  ) "m" ON "m"."groupId" = "g"."id"
  ORDER BY "m"."timestamp" ASC;
`
})
export class GroupMessageView extends BaseEntity{
  @ViewColumn()
  id: number;

  @ViewColumn()
  name: string;

  @ViewColumn()
  lastTimestamp: Date;

  @ViewColumn()
  lastMessage: string;

  public static getGroupMessageByIds(groupIds: Array<number>){
    this.createQueryBuilder("group")
      .where("group.id IN (:...ids", {ids: groupIds})
      .getMany();
  }
}
