import axios from 'axios';

const API = '/api/auth';
export class AuthRequest{
  static postLogin = (data:{email: string, password: string}) => axios.post(`${API}/login`, data)

  static postRegister = (data: {name: string, password: string, email: string}) => axios.post(`${API}/register`, data);
}