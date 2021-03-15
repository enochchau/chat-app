import { DBConnect } from "../connection"
import { TestUserSetup } from "../testusers";

export class EntitySetup extends TestUserSetup{
  public connector = new DBConnect();

  constructor(numberOfUsers: number, randomUsers: boolean){
    super(numberOfUsers, randomUsers);
  }
  public async clearDatabase(drop: boolean=false, truncate: boolean=false){
    await this.connector.create('postgres');
    if(drop) await this.connector.dropTables();
    if(truncate) await this.connector.truncateTables();
    await this.connector.close();
  }

  public async connectDatabase(){
    await this.connector.create('postgres');
  }

  public async disconnectDatabase(){
    await this.connector.close();
  }
}

export class UserEntitySetup extends EntitySetup{
  constructor(){
    super(1, true);
  }
}

export class GroupEntitySetup extends EntitySetup{
  constructor(){
    super(10, false);
  }
}