import { axiosAuth } from './index';
import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Either';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { UserGroupUnionArr } from './validators/entity';

export class SearchRequest {
  private static API = '/api/user';

  static async getSearchGroupsUsers(
    parameters: {count: number, search: string},
    onLeft: (errors: t.Errors) => void,
    onRight: (data: UserGroupUnionArr) => void,
    onError: (err: Error) => void,
  ){
    axiosAuth.get(`${this.API}`, { params: parameters})
      .then(res => {
        pipe(UserGroupUnionArr.decode(res.data), fold(onLeft, onRight));
      })
      .catch(err => {
        onError(err);
      });
  }
}