import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Either';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';

// join is for authentication
// chat is for distributing messges
const UserTopic = t.union([
  t.literal("join group"),
  t.literal('chat group'),
  t.literal('join friend'),
  t.literal('chat friend')
]);

const GenericMessage = <C extends t.Mixed>(codec: C) => 
  t.type({
    topic: UserTopic,
    payload: codec,
  });

const GenericPayload = t.type({
  timestamp: tt.date,
  message: t.string,
  chatId: t.number
});

// we can use the topic to figure out if the chatId is a userId or a groupId

export const UserMessage = GenericMessage(GenericPayload);
export type UserMessage = t.TypeOf<typeof UserMessage>;