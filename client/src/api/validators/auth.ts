import * as t from 'io-ts';

export const AuthDataValidator = t.type({
  message: t.string
});
export type AuthData = t.TypeOf<typeof AuthDataValidator>;
export const TokenDataValidator = t.type({
  message: t.string,
  token: t.string,
});
export type TokenData = t.TypeOf<typeof TokenDataValidator>;