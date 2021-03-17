import axios from 'axios';
import { getToken } from './token';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';

export const URL = "localhost:5000";
export const LOGIN = "/api/auth/login";
export const REGISTER = "/api/auth/register";
export const WSURL = `ws://${URL}/chat`;
export const TIMEOUT = 9000;

axios.defaults.baseURL = `http://${URL}`;
axios.defaults.timeout = TIMEOUT;

export const axiosAuth = axios.create({
  headers: { Authorization: `Bearer ${getToken()}`}
});

// fetch groups
export const GroupData = t.type({
  created: tt.DateFromISOString,
  updated: tt.DateFromISOString,
  name: t.string,
  id: t.number
});
export type GroupData = t.TypeOf<typeof GroupData>;
// response validator
export const GroupDataArr = t.array(GroupData);
export type GroupDataArr = t.TypeOf<typeof GroupDataArr>;
export function fetchGroups(){
  return axiosAuth.get('/api/group', {
    params: {
      count: 15,
      date: new Date(),
    }
  })
}

export function searchUsers(searchValue: string){
  return axiosAuth.get('/api/user/many',{
    params: {
      count: 30,
      search: searchValue,
    }
  })
}