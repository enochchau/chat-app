import * as t from "io-ts";
import * as tt from "io-ts-types";

const ChatTopics = t.union([
  t.literal('chat'),
  t.literal('auth'),
]);
export type ChatTopics = t.TypeOf<typeof ChatTopics>;
const ServerTopics = t.union([
  t.literal('okay'),
  t.literal('error')
]);
export type ServerTopics = t.TypeOf<typeof ServerTopics>;


export const RxChatMessage = t.type({
  topic: ChatTopics,
  payload: t.type({
    timestamp: tt.DateFromISOString,
    message: t.string,
    groupId: t.number,
    userId: t.number,
    id: t.number,
    created: tt.DateFromISOString,
    updated: tt.DateFromISOString,
  })
});

export type TxChatMessage = {
  topic: ChatTopics,
  payload: {
    timestamp: Date,
    message: string,
    groupId: number,
    userId: number
  }
}

export const ServerMessage = t.type({
  topic: ServerTopics,
  payload: t.type({
    timestamp: tt.DateFromISOString,
    message: t.string,
  })
})

export type RxChatMessage= t.TypeOf<typeof RxChatMessage>;
export type RxChatPayload = RxChatMessage["payload"];
export type ServerMessage = t.TypeOf<typeof ServerMessage>;