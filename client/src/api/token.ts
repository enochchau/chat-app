import jwt_decode, { JwtPayload } from 'jwt-decode';

export function saveToken(token: string, rememberMe: boolean){
  if(rememberMe){
    localStorage.setItem('token', token);
  } else {
    sessionStorage.setItem('token', token)
  }
}

export function getToken(): null | string{
  let token = localStorage.getItem("token");
  if(!token){
    token = sessionStorage.getItem("token");
  }
  return token;
}

interface DecodedJwt extends JwtPayload {
  user?: DecodedJwtUser;
}
export interface DecodedJwtUser {
  id: number;
  username: string;
  name: string;
}
export function decodeToJwtUser(token: string): DecodedJwtUser | undefined{
  try {
    let decoded:DecodedJwt = jwt_decode<JwtPayload>(token);
    return decoded.user;
  } catch(error){
    return;
  }
}