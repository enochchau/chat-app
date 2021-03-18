import { rest } from 'msw';
import { URL, LOGIN, REGISTER } from '../api';
import jwt from 'jwt-simple';

export interface TestUser {
  username: string;
  password: string;
  id: number;
  name: string;
}

// this person is already in the database
export const testUser:TestUser = {
  username: "test_user",
  password: "test123",
  id: 999888777,
  name: "Test User Person"
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

  rest.post(`http://${URL}${REGISTER}`, (req, res, ctx) => {
    const body = req.body as TestUser ;
    if(body.username === testUser.username){
      return res(ctx.json({message: 'That username is already taken.'}));
    }
    if(!body.name){
      return res(ctx.json({message: "Please include a name."}));
    }
    return res(ctx.json({message: "Registration successful."}));
  })
]