import { pipe } from 'fp-ts/lib/pipeable';
import { fold } from 'fp-ts/Either';
import * as t from 'io-ts';

import { axiosAuth } from './index';
import { MessageDataArr } from './validators/entity';

export class MessageRequest {
  private static API = '/api/msg';

  static getLastMessages(
    parameters: {groupIds: number},
    onLeft: (errors: t.Errors) => void,
    onRight: (data: MessageDataArr) => void,
    onError: (error: Error) => void,
  ){
    return axiosAuth.get(this.API + '/last', {
      params: parameters
    })
      .then(res => res.data)
      .then(data => {
        pipe(MessageDataArr.decode(data), fold(onLeft, onRight));
      })
      .catch(err => {
        onError(err)
      })
  } 
}