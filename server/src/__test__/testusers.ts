export type TestUser = {
  email: string,
  name: string,
  password: string,
  id: number,
  jwt: string,
}

// setup test users 
export class TestUserSetup{
  public testUsers: Array<TestUser>;

  constructor(n: number, random: boolean = false){
    this.testUsers = new Array();

    for (let i=0; i<n; i++){
      let user: TestUser = {
        name: "Test User" + i.toString(),
        email: `test${(random? Math.floor(Math.random()*Math.floor(9999999999)) : i)}@test.com`,
        password: "test123",
        jwt: "",
        id: 0,
      };
      this.testUsers.push(user)
    }
  }
}