import * as t from 'io-ts';
import * as tt from 'io-ts-types';

export const MessageValidator = t.type({
  id: t.number,
  message: t.string,
  timestamp: tt.DateFromISOString,
  created: tt.DateFromISOString,
  updated: tt.DateFromISOString,
  groupId: t.number,
  userId: t.number
})
export type MessageData = t.TypeOf<typeof MessageValidator>;
export const MessageArrValidator = t.array(MessageValidator);

const UserValidator = t.type({
  id: t.number,
  email: t.string,
  name: t.string,
  created: tt.DateFromISOString,
  updated: tt.DateFromISOString,
  avatar: t.union([t.string, t.null])
});

export type UserData = t.TypeOf<typeof UserValidator>;
export const UserArrValidator = t.array(UserValidator);

export const GroupValidator = t.type({
  id: t.number,
  name: t.string,
  created: tt.DateFromISOString,
  updated: tt.DateFromISOString,
  avatar: t.union([t.string, t.null]),
});
export type GroupData = t.TypeOf<typeof GroupValidator>;
// response validator
export const GroupArrValidator = t.array(GroupValidator);

// group data that includes the user relation
export const GroupWithUsersValidator = t.intersection([GroupValidator, 
  t.type({users: UserArrValidator})
]);
export type GroupDataWithUsers = t.TypeOf<typeof GroupWithUsersValidator>;

export const GroupMessageValidator = t.type({
  userId: t.number, // this value is essentially thown away...
  groupId: t.number,
  groupName: t.string, 
  groupAvatar: t.union([t.string, t.null]),
  lastTimestamp: t.union([tt.DateFromISOString, t.null]),
  lastMessage: t.union([t.string, t.null]),
  lastUserId: t.union([t.number, t.null]),
});

export type GroupMessageData = t.TypeOf<typeof GroupMessageValidator>;
export const GroupMessageArrValidator = t.array(GroupMessageValidator);
