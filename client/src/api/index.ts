import axios, { AxiosInstance } from 'axios';
import { getToken } from './token';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { pipe } from 'fp-ts/lib/pipeable';
import { fold } from 'fp-ts/Either';

export const URL = "localhost:5000";
export const REGISTER = "/api/auth/register";
export const WSURL = `ws://${URL}/chat`;
export const TIMEOUT = 9000;

axios.defaults.baseURL = `http://${URL}`;
axios.defaults.timeout = TIMEOUT;

export const axiosAuth = axios.create({
  headers: { Authorization: `Bearer ${getToken()}`}
});