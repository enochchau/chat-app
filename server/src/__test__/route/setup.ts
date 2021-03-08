import { Server } from "http";
import { App } from "../../app";
import { DBConnect } from "../connection";
import { TestUserSetup } from "../testusers";

export class RouteSetup extends TestUserSetup{

  public app: App;
  public server: Server;
  public connection: DBConnect;

  constructor(numberOfTestUsers: number, randomUsername: boolean = false){
    super(numberOfTestUsers, randomUsername);
    this.app = new App();
    this.connection = new DBConnect();
  }

  public async buildUp(cb: () => void, truncateTables: boolean = false){
    await this.connection.create('sqlite');
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