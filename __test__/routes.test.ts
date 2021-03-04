import { Server } from 'http';
import supertest from 'supertest';
import { DBConnect } from './connection';
import { begin } from '../src/app';
import jwt_decode from 'jwt-decode';

interface testUserInterface {
  name: string;
  username: string;
  password: string;
}

interface testJWTUserInterface {
  id: number;
  username: string;
}

interface jwtContentInterface{
  user: testJWTUserInterface;
  iat: number;
}

let server: Server;
let conn = new DBConnect();

const testUser: testUserInterface = {
  name: "Test User",
  username: "test",
  password: "test123",
}

let testJwt: string = "";

beforeAll(async ()=>{
  await conn.create();
  server = begin();
});

afterAll(async (done) =>{
  await conn.clear();
  await conn.close();
  done();
});

test("GET /", async () => {
  await supertest(server)
    .get("/")
    .expect(200)
    .then((res) => {
      expect(res.body.message).toBe("hello world");
    });
})

test("POST /api/auth/register", async () => {
  await supertest(server)
    .post("/api/auth/register")
    .send(testUser)
    .expect(200)
    .then((res) => {
      expect(res.body.message).toBe("Registration successful");
    })
})

test("POST /api/auth/login", async () => {
  await supertest(server)
    .post("/api/auth/login")
    .send(testUser)
    .expect(200)
    .then((res) => {
      testJwt = res.body;
      let decode = jwt_decode(testJwt) as jwtContentInterface;
      let jwtUser = decode.user as testJWTUserInterface;

      expect(jwtUser.id).toBe(2);
      expect(jwtUser.username).toBe(testUser.username);
    })
})
