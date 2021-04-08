import axios, { AxiosResponse } from 'axios';
import { getToken } from './token';

export const URL = "localhost:5000";
export const REGISTER = "/api/auth/register";
export const WSURL = `ws://${URL}/chat`;
export const TIMEOUT = 9000;

axios.defaults.baseURL = `http://${URL}`;
axios.defaults.timeout = TIMEOUT;

export const axiosAuth = axios.create({
  headers: { Authorization: `Bearer ${getToken()}`}
});

export class AuthRequest{
  static API = '/api/auth';
  static postLogin (data:{email: string, password: string}): Promise<AxiosResponse<any>>{
    return axios.post(`${this.API}/login`, data)
  }

  static postRegister (data: {name: string, password: string, email: string}): Promise<AxiosResponse<any>>{
    return axios.post(`${this.API}/register`, data);
  }
}

export class GroupRequest {

  static API = '/api/group'
  static postNewGroup(data: {userIds: number[], groupName: string}): Promise<AxiosResponse<any>>{
    return axiosAuth.post(this.API, data);
  }

  static getGroupsForUser(parameters: {count: number, date: Date}): Promise<AxiosResponse<any>>{
    return axiosAuth.get(this.API, {params: parameters});
  }

  static patchLeaveGroup(data: {groupId: number}): Promise<AxiosResponse<any>>{
    return axiosAuth.patch(this.API + '/leave', data);
  }

  static patchAddToGroup(data: {groupId: number, userId: number}): Promise<AxiosResponse<any>>{
    return axiosAuth.patch(this.API + '/add', data);
  }

  static getGroupWithUsers(params: {groupId: number}): Promise<AxiosResponse<any>>{
    return axiosAuth.get(this.API + "/single", {params: params});
  }

  static patchChangeName(data: {groupId: number, newName: string}): Promise<AxiosResponse<any>>{
    return axiosAuth.patch(this.API + "/name", data);
  }
}

export class MessageRequest {
  static API = '/api/msg';

  static getLastMessages(parameters: {groupIds: number}): Promise<AxiosResponse<any>>{
    return axiosAuth.get(this.API + '/last', {
      params: parameters
    });
  } 

  static removeMessage(data: {messageId: number}): Promise<AxiosResponse<any>>{
    return axiosAuth.patch(this.API, data);
  }
}

export class SearchRequest {
  static API = '/api/search';

  static getSearchGroups(parameters: {count: number, search: string}): Promise<AxiosResponse<any>>{
    return axiosAuth.get(`${this.API}/group`, { params: parameters});
  }
  static getSearchUsers(parameters: {count: number, search: string}): Promise<AxiosResponse<any>>{
    return axiosAuth.get(`${this.API}/user`, { params: parameters});
  }
}

export class UserRequest{
  static API = "/api/user";

  static getUser(
    params: {userId: number},
  ): Promise<AxiosResponse<any>>{
    return axiosAuth.get(this.API, {params: params});
  }

  static getManyUsers(
    params: {userIds: Array<number>, count: number},
  ): Promise<AxiosResponse<any>>{
    return axiosAuth.get(this.API + "/many", {params: params});
  }

  static getUsersForGroup(
    params: {groupId: number},
  ): Promise<AxiosResponse<any>>{
    return axiosAuth.get(this.API + '/group', {params: params});
  }
}


// TODO account patching