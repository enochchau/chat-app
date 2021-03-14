import * as t from 'io-ts';
import * as tt from 'io-ts-types';

// join is for authentication
// chat is for distributing messges
const UserTopic = t.union([
  t.literal("chat"),
  t.literal('auth'),
]);

const GenericMessage = <C extends t.Mixed>(codec: C) => 
  t.type({
    topic: UserTopic,
    payload: codec,
  });

const ChatPayload = t.type({
  timestamp: tt.date,
  message: t.string,
  groupId: t.number,
  userId: t.number,
});

const AuthPayload = t.type({
  timestamp: tt.date,
  groupId: t.number,
  token: t.string,
});

// we can use the topic to figure out if the chatId is a userId or a groupId
export type AuthPayload = t.TypeOf<typeof AuthPayload>;
export const AuthMessage = GenericMessage(AuthPayload);
export type AuthMessage = t.TypeOf<typeof AuthMessage>;

export type ChatPayload = t.TypeOf<typeof ChatPayload>;
export const ChatMessage = GenericMessage(ChatPayload);
export type ChatMessage= t.TypeOf<typeof ChatMessage>;