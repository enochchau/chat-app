import { UserData, UserDataArr } from './validators/entity';
import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Either';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { axiosAuth } from 'api';

export class UserRequest{
  private static API = "/api/user";

  static async getUser(
    params: {userId: number},
    onLeft: (errors: t.Errors) => void,
    onRight: (data: UserData) => void,
    onError: (err: Error) => void
  ){
    axiosAuth.get(this.API, {params: params})
      .then(res => {
        pipe(UserData.decode(res.data), fold(onLeft, onRight));
      })
      .catch(err => {onError(err);})
  }

  static async getUsers(
    params: {userIds: Array<number>, count: number},
    onLeft: (errors: t.Errors) => void,
    onRight: (data: UserDataArr) => void,
    onError: (err: Error) => void,
  ){
    axiosAuth.get(this.API + "/many", {params: params})
      .then(res => {
        pipe(UserDataArr.decode(res.data), fold(onLeft, onRight));
      })
      .catch(err => {onError(err)})
  }
}


// TODO account patching