import { createConnection, getConnection, Connection } from 'typeorm';

export class DBConnect {
  public connection: Connection;
  public async create(){
    this.connection = await createConnection({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      synchronize: true,
      logging: false,
      entities: [
        "src/entity/**/*.ts"
      ]
    });
  }

  public async close(){
    await this.connection.close();
  }

  private async clear(action: string){
    const entities = this.connection.entityMetadatas;

    let entity;
    for (entity of entities){
      try {
        await this.connection.query(action + ` TABLE \"${entity.tableName}\" CASCADE;`);
      } catch(err) {
        console.error(err);
      }
    }
  }
  public dropTables(){
    return this.clear("DROP");
  }
  public truncateTables(){
    return this.clear("TRUNCATE");
  }

  public async get(): Promise<Connection>{
    return await this.connection;
  }
}