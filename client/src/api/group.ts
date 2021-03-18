import { axiosAuth } from './index';
import { GroupData, GroupMessageDataArr } from './validators/entity';
import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Either';
import * as t from 'io-ts';

export class GroupRequest {
  static API = '/api/group'

  static postNewGroup(
    data: {userIds: number, groupName: string}, 
    onLeft: (errors: t.Errors) => void,
    onRight: (data: GroupData) => void,
    onError: (err: Error) => void,
  ){
    axiosAuth.post(this.API, data)
      .then(res => res.data)
      .then(data => {
        pipe(GroupData.decode(data), fold(onLeft, onRight))
      })
      .catch(err => {
        onError(err);
      });
  }

  static getGroupsForUser(
    parameters: {count: number, date: Date},
    onLeft: (errors: t.Errors) => void,
    onRight: (data: GroupMessageDataArr) => void,
    onError: (err: Error) => void,
  ){
    axiosAuth.get(this.API, {params: parameters})
      .then(res => {
        pipe(GroupMessageDataArr.decode(res.data), fold(onLeft, onRight));
      })
      .catch(err => {
        onError(err);
      });
  }

  static patchLeaveGroup(
    data: {groupId: number},
    onError: (err: Error) => void,
  ){
    axiosAuth.patch(this.API + '/leave', data)
      .catch(err => {
        onError(err);
      });
  }

  static patchAddToGroup(
    data: {groupId: number, userId: number},
    onLeft: (errors: t.Errors) => void,
    onRight: (data: GroupData) => void,
    onError: (err: Error ) => void,
  ){
    axiosAuth.patch(this.API + '/add', data)
      .then(res => res.data)
      .then(data => {
        pipe(GroupData.decode(data), fold(onLeft, onRight));
      })
  }
}