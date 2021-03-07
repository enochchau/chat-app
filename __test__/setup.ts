import { Server } from "http";
import { App } from "../src/app";
import { DBConnect } from "./connection";
import { testUserInterface } from "./testinterface";

export class TestSetup {
  public testUsers: Array<testUserInterface>;

  public app: App;
  public server: Server;
  public connection: DBConnect;

  constructor(numberOfTestUsers: number, random: boolean = false){
    this.testUsers = new Array();

    for (let i=0; i<numberOfTestUsers; i++){
      let user: testUserInterface = {
        name: "Test User" + i.toString(),
        username: "test" + (random ? Math.floor(Math.random()*Math.floor(9999)) : i).toString(),
        password: "test123",
        jwt: "",
        id: 0,
      };
      this.testUsers.push(user)
    }

    this.app = new App();
    this.connection = new DBConnect();
  }

  public async buildUp(cb: () => void, truncateTables: boolean = false){
    await this.connection.create();
    if (truncateTables) await this.connection.truncateTables();
    this.server = this.app.createWebsocketServer();
    this.server.listen(cb)
  }

  public tearDown(cb: () => void, dropTables:boolean = false){
    this.server.close(async () => {
      if(dropTables) await this.connection.dropTables();
      await this.connection.close();
      cb;
    })
  }
}