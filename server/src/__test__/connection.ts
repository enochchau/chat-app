import { createConnection, getConnection, Connection } from 'typeorm';
type DbTypeOption = 'sqlite' | 'postgres';

// For database testing, use postgres
// for integration testing, use sqlite3

// establish databse connections for tests
export class DBConnect {
  public connection: Connection;
  public async create(type: DbTypeOption){
    if(type === 'sqlite'){
      this.connection = await createConnection({
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        synchronize: true,
        logging: false,
        entities: [
          "./src/entity/**/*.ts"
        ]
      });
    }
    if(type === 'postgres') { 
      this.connection = await createConnection();
    }
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