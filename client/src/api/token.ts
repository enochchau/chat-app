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

export function deleteToken(){
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
}

interface DecodedJwt extends JwtPayload {
  user?: DecodedJwtUser;
}
export interface DecodedJwtUser {
  id: number;
  name: string;
  email: string;
}
export function decodeToJwtUser(token: string): DecodedJwtUser | undefined{
  try {
    let decoded:DecodedJwt = jwt_decode<JwtPayload>(token);
    return decoded.user;
  } catch(error){
    return;
  }
}