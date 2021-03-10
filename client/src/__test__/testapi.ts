import { rest } from 'msw';
import { URL, LOGIN } from '../api/index';
import jwt from 'jwt-simple';

interface TestUser {
  username: string;
  password: string;
  id: number;
}
export const testUser:TestUser = {
  username: "test_user",
  password: "test123",
  id: 999888777,
};

const testJwt = jwt.encode({user:{username: testUser.username, id: testUser.id}}, 'SUPERSECRET');

export const handler = [
  rest.post(`http://${URL}${LOGIN}`, (req, res, ctx) => {
    const body = req.body as TestUser;

    if(body.username !== testUser.username){
      return res(ctx.json({message: "That username does not exist."}))
    }
    if (body.password !== testUser.password){
      return res(ctx.json({message: "Your password is invalid."}))
    }
    return res(ctx.json({message: "Logged in successfully.", token: testJwt}));
  }),
]