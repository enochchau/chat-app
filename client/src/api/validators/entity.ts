import * as t from 'io-ts';
import * as tt from 'io-ts-types';

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

const UserData = t.type({
  id: t.number,
  email: t.string,
  name: t.string,
  created: tt.DateFromISOString,
  updated: tt.DateFromISOString,
  avatar: t.union([t.string, t.null])
});

export type UserData = t.TypeOf<typeof UserData>;
export const UserDataArr = t.array(UserData);
export type UserDataArr = t.TypeOf<typeof UserDataArr>;

export const GroupData = t.type({
  id: t.number,
  name: t.union([t.string, t.null]),
  created: tt.DateFromISOString,
  updated: tt.DateFromISOString,
  avatar: t.union([t.string, t.null]),
});
export type GroupData = t.TypeOf<typeof GroupData>;
// response validator
export const GroupDataArr = t.array(GroupData);
export type GroupDataArr = t.TypeOf<typeof GroupDataArr>;


// group data that includes the user relation
export const GroupDataWithUsers = t.intersection([GroupData, 
  t.type({users: UserDataArr})
]);
export type GroupDataWithUsers = t.TypeOf<typeof GroupDataWithUsers>;


export const GroupMessageData = t.type({
  userId: t.number, // this value is essentially thown away...
  groupId: t.number,
  groupName: t.union([t.string, t.null]),
  groupAvatar: t.union([t.string, t.null]),
  lastTimestamp: t.union([tt.DateFromISOString, t.null]),
  lastMessage: t.union([t.string, t.null]),
  lastUserId: t.union([t.number, t.null]),
});

export type GroupMessageData = t.TypeOf<typeof GroupMessageData>;
export const GroupMessageDataArr = t.array(GroupMessageData);
export type GroupMessageDataArr = t.TypeOf<typeof GroupMessageDataArr>;