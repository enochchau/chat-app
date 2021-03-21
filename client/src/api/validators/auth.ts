import * as t from 'io-ts';

export const AuthValidator = t.type({
  message: t.string
});
export type AuthData = t.TypeOf<typeof AuthValidator>;
export const TokenValidator = t.type({
  message: t.string,
  token: t.string,
});
export type TokenData = t.TypeOf<typeof TokenValidator>;