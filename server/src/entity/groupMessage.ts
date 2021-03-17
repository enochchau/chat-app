// import { ViewEntity } from "typeorm";

// // last message
// // last timestamp
// // avatar?
// // name
// // id
// // list of user ids
// @ViewEntity({
//   expresion: `
//   SELECT 
//     "g"."id" as "groupId",
//     "g"."name" as "group",
//     "ug"."userEntityId" as "userId",
//     "m"."id" as "messageId"
//   FROM 
//     "group_entity" "g"
//   INNER JOIN "user_entity_groups_group_entity" "ug"
//     ON "ug"."groupEntityId"="g"."id"
//   LEFT JOIN "message_entity" "m"
//     ON "g"."id" = "m"."groupId"
//   ORDER BY "m"."timestamp";
//   `
// })