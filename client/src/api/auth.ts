import axios from 'axios';
import * as t from 'io-ts';
import { fold } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { AuthData, TokenData } from './validators/auth';

export class AuthRequest{

  private static API = '/api/auth';

  static async postLogin(
    data:{email: string, password: string},
    onNoTokenLeft: (errors: t.Errors) => void,
    onNoTokenRight: (data: AuthData) => void,
    onTokenLeft: (errors: t.Errors) => void,
    onTokenRight: (data: TokenData) => void,
    onError: (err: Error) => void,
  ){
    axios.post(`${this.API}/login`, data)
      .then(res => {
        const onLeft = (errors: t.Errors) => {
          onNoTokenLeft(errors);
          pipe(TokenData.decode(res.data), fold(onTokenLeft, onTokenRight));
        }
        pipe(AuthData.decode(res.data), fold(onLeft, onNoTokenRight));
      })
      .catch((err) => {
        onError(err);
      })
  }

  static async postRegister(
    data: {name: string, password: string, email: string},
    onLeft: (errors: t.Errors) => void,
    onRight: (data: AuthData) => void,
    onError: (err: Error) => void,
  ){
    axios.post(`${this.API}/register`, data)
      .then(res => {
        pipe(AuthData.decode(res.data), fold(onLeft, onRight));
      })
      .catch((err) => {
        onError(err);
      })
  }
}