import * as t from "io-ts";
import * as tt from "io-ts-types";
import { MessageData } from "./entity";

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
  payload: MessageData
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

export type AuthMessage = {
  topic: "auth",
  payload: {
    timestamp: Date,
    groupId: number,
    token: string
  }
}
export type RxChatMessage= t.TypeOf<typeof RxChatMessage>;
export type RxChatPayload = RxChatMessage["payload"];
export type ServerMessage = t.TypeOf<typeof ServerMessage>;

export const ChatHistory = t.type({
  topic: t.literal('history'),
  payload: t.array(MessageData)
})
export type ChatHistory = t.TypeOf<typeof ChatHistory>;