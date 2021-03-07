import { Server } from "http";
import { App } from "../src/app";
import { DBConnect } from "./connection";
import { testUserInterface } from "./testuser";

export class TestSetup {
  public testUsers: Array<testUserInterface>;

  public app: App;
  public server: Server;
  public connection: DBConnect;

  constructor(){
    for (let i=0; i<20; i++){
      let user: testUserInterface = {
        name: "Test User" + i.toString(),
        username: "test" + Math.floor(Math.random() * Math.floor(9999)),
        password: "test123",
        jwt: "",
        id: 0,
      };
      this.testUsers.push(user)
    }
    this.app = new App();
    this.connection = new DBConnect();
  }

  public async buildUp(cb: jest.DoneCallback){
    await this.connection.create();
    this.server = this.app.createWebsocketServer();
    this.server.listen(cb)
  }

  public tearDown(cb: jest.DoneCallback, truncateTables=false, dropTables=false){
    this.server.close(async () => {
      if(truncateTables) await this.connection.truncateTables();
      if(dropTables) await this.connection.dropTables();
      await this.connection.close();
      cb;
    })
  }
}