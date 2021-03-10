import axios from 'axios';
import { getToken } from './token';

export const TIMEOUT = 9000;
export const LOGIN = "/api/auth/login";
export const REGISTER = "/api/auth/register";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.timeout = TIMEOUT;

export const axiosAuth = axios.create({
  headers: { Authroization: `Bearer ${getToken()}`}
});
