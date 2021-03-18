import * as t from 'io-ts';
import * as tt from 'io-ts-types';

export const GroupData = t.type({
  id: t.number,
  name: t.string,
  created: tt.DateFromISOString,
  updated: tt.DateFromISOString,
});
export type GroupData = t.TypeOf<typeof GroupData>;
// response validator
export const GroupDataArr = t.array(GroupData);
export type GroupDataArr = t.TypeOf<typeof GroupDataArr>;

export const MessageData = t.type({
  id: t.number,
  message: t.string,
  timestamp: tt.DateFromISOString,
  created: tt.DateFromISOString,
  updated: tt.DateFromISOString,
  groupId: t.number,
  userId: t.number
})
export type MessageData = t.TypeOf<typeof MessageData>;
export const MessageDataArr = t.array(MessageData);
export type MessageDataArr = t.TypeOf<typeof MessageDataArr>;

export const UserData = t.type({
  id: t.number,
  email: t.string,
  name: t.string,
  created: tt.DateFromISOString,
  updated: tt.DateFromISOString
});
export type UserData = t.TypeOf<typeof UserData>;
export const UserDataArr = t.array(UserData);
export type UserDataArr = t.TypeOf<typeof UserDataArr>;

export const GroupMessageData = t.type({
  userId: t.number,
  groupId: t.number,
  groupName: t.string,
  lastTimestamp: tt.DateFromISOString,
  lastMessage: tt.DateFromISOString,
  lastUserId: t.number
});
export type GroupMessageData = t.TypeOf<typeof GroupMessageData>;
export const GroupMessageDataArr = t.array(GroupMessageData);
export type GroupMessageDataArr = t.TypeOf<typeof GroupMessageDataArr>;

export const UserGroupUnion = t.union([
  GroupData,
  UserData
]);
export type UserGroupUnion = t.TypeOf<typeof UserGroupUnion>;
export const UserGroupUnionArr = t.array(UserGroupUnion);
export type UserGroupUnionArr = t.TypeOf<typeof UserGroupUnionArr>;