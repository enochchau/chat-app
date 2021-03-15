import { Server } from "http";
import { ServerSetup } from '../server';

export class RouteSetup extends ServerSetup{

  constructor(n: number, random: boolean = false){
    super(n, random);
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