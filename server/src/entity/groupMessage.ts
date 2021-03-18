import { ViewColumn, ViewEntity, getManager, BaseEntity } from "typeorm";

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
    "ug"."userEntityId" as "userId",
    "g"."id" as "groupId",
    "g"."name" as "groupName",
    "m"."timestamp" as "lastTimestamp",
    "m"."message" as "lastMessage",
    "m"."userId" as "lastUserId"
  FROM "group_entity" "g"
  LEFT JOIN (
    SELECT "m"."message", "m"."timestamp", "m"."groupId", "m"."userId"
    FROM "message_entity" "m"
    WHERE "m"."timestamp" IN (
      SELECT MAX("timestamp") FROM "message_entity" "m"
      GROUP BY "m"."groupId" 
    )
  ) "m" ON "m"."groupId" = "g"."id"
  LEFT JOIN "user_entity_groups_group_entity" "ug"
  ON "ug"."groupEntityId" = "g"."id"
  ORDER BY "m"."timestamp" ASC;
`
})
export class GroupMessageView extends BaseEntity {
  @ViewColumn()
  userId: number;

  @ViewColumn()
  groupId: number;

  @ViewColumn()
  groupName: string;

  @ViewColumn()
  lastTimestamp: Date;

  @ViewColumn()
  lastMessage: string;

  @ViewColumn()
  lastUserId: string;

  public static findRecentByUserId(userId: number, count: number, timeSince: Date){
    return this.createQueryBuilder("g") 
      .where("g.lastTimestamp <= :date", {date: timeSince})
      .andWhere("g.userId = :id", {id: userId})
      .orderBy("g.lastTimestamp", "ASC")
      .take(count)
      .getMany();
  }
  // we don't care about userIds for this query
  public static findRecentByGroupIds(groupIds: Array<number>, count: number, timeSince: Date){
    return this.createQueryBuilder('g')
      .distinctOn(['groupId'])
      .where('g.lastTimestamp <= :date', {date: timeSince})
      .andWhere("g.groupId IN (...ids)", {ids: groupIds})
      .orderBy('g.lastTimestamp', 'ASC')
      .take(count)
      .getMany();
  }
}
