import * as t from "io-ts";
import * as tt from "io-ts-types";
import { MessageDataValidator } from "./entity";

const ChatTopicsValidator = t.union([
  t.literal('chat'),
  t.literal('auth'),
]);
export type ChatTopics = t.TypeOf<typeof ChatTopicsValidator>;

const ServerTopicsValidator = t.union([
  t.literal('okay'),
  t.literal('error')
]);
export type ServerTopics = t.TypeOf<typeof ServerTopicsValidator>;

export const RxChatMessageValidator = t.type({
  topic: ChatTopicsValidator,
  payload: MessageDataValidator
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

export const ServerMessageValidator = t.type({
  topic: ServerTopicsValidator,
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
export type RxChatMessage= t.TypeOf<typeof RxChatMessageValidator>;
export type RxChatPayload = RxChatMessage["payload"];
export type ServerMessage = t.TypeOf<typeof ServerMessageValidator>;

export const ChatHistoryValidator= t.type({
  topic: t.literal('history'),
  payload: t.array(MessageDataValidator)
})
export type ChatHistory = t.TypeOf<typeof ChatHistoryValidator>;