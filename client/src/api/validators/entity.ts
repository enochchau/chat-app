import * as t from 'io-ts';
import * as tt from 'io-ts-types';

export const MessageDataValidator = t.type({
  id: t.number,
  message: t.string,
  timestamp: tt.DateFromISOString,
  created: tt.DateFromISOString,
  updated: tt.DateFromISOString,
  groupId: t.number,
  userId: t.number
})
export type MessageData = t.TypeOf<typeof MessageDataValidator>;
export const MessageDataArrValidator = t.array(MessageDataValidator);
export type MessageDataArr = t.TypeOf<typeof MessageDataArrValidator>;

const UserDataValidator = t.type({
  id: t.number,
  email: t.string,
  name: t.string,
  created: tt.DateFromISOString,
  updated: tt.DateFromISOString,
  avatar: t.union([t.string, t.null])
});

export type UserData = t.TypeOf<typeof UserDataValidator>;
export const UserDataArrValidator = t.array(UserDataValidator);
export type UserDataArr = t.TypeOf<typeof UserDataArrValidator>;

export const GroupDataValidator = t.type({
  id: t.number,
  name: t.string,
  created: tt.DateFromISOString,
  updated: tt.DateFromISOString,
  avatar: t.union([t.string, t.null]),
});
export type GroupData = t.TypeOf<typeof GroupDataValidator>;
// response validator
export const GroupDataArrValidator = t.array(GroupDataValidator);
export type GroupDataArr = t.TypeOf<typeof GroupDataArrValidator>;

// group data that includes the user relation
export const GroupDataWithUsersValidator = t.intersection([GroupDataValidator, 
  t.type({users: UserDataArrValidator})
]);
export type GroupDataWithUsers = t.TypeOf<typeof GroupDataWithUsersValidator>;

export const GroupMessageDataValidator = t.type({
  userId: t.number, // this value is essentially thown away...
  groupId: t.number,
  groupName: t.string, 
  groupAvatar: t.union([t.string, t.null]),
  lastTimestamp: t.union([tt.DateFromISOString, t.null]),
  lastMessage: t.union([t.string, t.null]),
  lastUserId: t.union([t.number, t.null]),
});

export type GroupMessageData = t.TypeOf<typeof GroupMessageDataValidator>;
export const GroupMessageDataArrValidator = t.array(GroupMessageDataValidator);
export type GroupMessageDataArr = t.TypeOf<typeof GroupMessageDataArrValidator>;
