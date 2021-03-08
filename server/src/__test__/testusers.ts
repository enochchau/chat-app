
export interface testUserInterface {
  name: string;
  username: string;
  password: string;
  jwt: string;
  id: number;
}

// setup test users in memory
export class TestUserSetup{
  public testUsers: Array<testUserInterface>;
  constructor(numberOfTestUsers: number, randomUsername: boolean = false){
    this.testUsers = new Array();

    for (let i=0; i<numberOfTestUsers; i++){
      let user: testUserInterface = {
        name: "Test User" + i.toString(),
        username: "test" + (randomUsername ? Math.floor(Math.random()*Math.floor(9999999999)) : i).toString(),
        password: "test123",
        jwt: "",
        id: 0,
      };
      this.testUsers.push(user)
    }
  }
}