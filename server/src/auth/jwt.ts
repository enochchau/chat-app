import jwt_decode from 'jwt-decode';

export interface JwtUserInterface {
  id: number;
  name: string;
  email: string;
}

export interface JwtContentInterface{
  user: JwtUserInterface;
  iat: number;
}

export function jwtToJwtUser(jwt: string): JwtUserInterface{
  const decode = jwt_decode(jwt) as JwtContentInterface;
  return decode.user as JwtUserInterface;
}