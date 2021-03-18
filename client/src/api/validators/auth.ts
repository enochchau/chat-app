import * as t from 'io-ts';

export const AuthData = t.type({
  message: t.string
});
export type AuthData = t.TypeOf<typeof AuthData>;
export const TokenData = t.type({
  message: t.string,
  token: t.string,
});
export type TokenData = t.TypeOf<typeof TokenData>;