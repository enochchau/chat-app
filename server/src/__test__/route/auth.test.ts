import request from 'supertest';
import { RouteSetup } from './setup';
import { JwtUserInterface, jwtToJwtUser } from '../../auth/jwt';

describe ('API: /api/auth', () => {

  const runner = new RouteSetup(5);
  beforeAll((done)=>{
    runner.buildUp(done, false);
  });

  afterAll((done) => {
    runner.tearDown(done, false);
  });


//----- AUTH -----//
  // register all test users
  test("POST /api/auth/register: register all test users", async () => {
    for (let testUser of runner.testUsers){
      await request(runner.server)
        .post("/api/auth/register")
        .send({
          name: testUser.name,
          email: testUser.email,
          password: testUser.password
        })
        .expect(200)
        .then((res) => {
          expect(res.body.message).toBe("Registration successful.");
        })
        .catch(error => console.error(error))
    }
  });

  // login all users to obtain id and jwt
  test("POST /api/auth/login: login all test users", async () => {
    // for (let testUser of runner.testUsers){
      const testUser = runner.testUsers[0];
      await request(runner.server)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200)
        .then((res) => {
          testUser.jwt = res.body.token;

          const jwtUser = jwtToJwtUser(testUser.jwt);
          expect(jwtUser).toBeTruthy();
          if(!jwtUser) return;

          testUser.id = jwtUser.id;
          expect(testUser.id).toBeGreaterThan(0);
          expect(jwtUser.email).toBe(testUser.email);
        })
        .catch(err => console.error(err))
    // }
  });
});