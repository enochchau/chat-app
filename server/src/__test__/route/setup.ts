import { Server } from "http";
import { App } from "../../app";
import { DBConnect } from "../connection";
import { TestUserSetup } from "../testusers";

export class RouteSetup extends TestUserSetup{

  public app: App;
  public server: Server;
  public connection: DBConnect;

  constructor(n: number, random: boolean = false){
    super(n, random);
    this.app = new App();
    this.connection = new DBConnect();
  }

  public async buildUp(cb: () => void, truncateTables: boolean = false){
    await this.connection.create('postgres');
    if (truncateTables) await this.connection.truncateTables();
    this.server = this.app.createServer();
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