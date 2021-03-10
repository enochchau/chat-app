import axios from 'axios';
import { getToken } from './token';

export const URL = "localhost:5000";
export const LOGIN = "/api/auth/login";
export const REGISTER = "/api/auth/register";
export const WSURL = `ws://${URL}/chat`;
export const TIMEOUT = 9000;

axios.defaults.baseURL = `http://${URL}`;
axios.defaults.timeout = TIMEOUT;

export const axiosAuth = axios.create({
  headers: { Authroization: `Bearer ${getToken()}`}
});
