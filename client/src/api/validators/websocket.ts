import * as t from "io-ts";
import * as tt from "io-ts-types";

const ChatTopics = t.union([
  t.literal('chat group'),
  t.literal('chat friend'),
]);

const ServerTopics = t.union([
  t.literal('okay'),
  t.literal('error')
]);


export const ChatMessage = t.type({
  topic: ChatTopics,
  payload: t.type({
    timestamp: tt.date,
    message: t.string,
    chatId: t.number
  })
});

export const ServerMessage = t.type({
  topic: ServerTopics,
  payload: t.type({
    timestamp: tt.date,
    message: t.string,
  })
})

export type ChatMessage= t.TypeOf<typeof ChatMessage>;
export type ChatPayload = ChatMessage["payload"];
export type ServerMessage = t.TypeOf<typeof ServerMessage>;