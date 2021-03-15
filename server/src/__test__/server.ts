import { Server } from "http";
import { App } from "../app";
import { DBConnect } from "./connection";
import { TestUserSetup } from "./testusers";

export class ServerSetup extends TestUserSetup{
  public app: App;
  public server: Server;
  public connection: DBConnect;

  constructor(n: number, random: boolean = false){
    super(n, random);
    this.app = new App();
    this.connection = new DBConnect();
  }
}