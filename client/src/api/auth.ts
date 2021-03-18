import axios from 'axios';
const API = '/api/auth';
export function postLogin(data:{email: string, password: string}){
  return axios.post(`${API}/login`, data);
}
export function postRegister(data: {name: string, password: string, email: string}){
  return axios.post(`${API}/register`, data);
}