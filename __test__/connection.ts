import { createConnection, getConnection, Connection } from 'typeorm';

export class DBConnect {
  public connection: Connection;
  public async create(){
    this.connection = await createConnection();
  }

  public async close(){
    await this.connection.close();
  }

  public async clear(){
    const entities = this.connection.entityMetadatas;

    entities.forEach( async (entity) => {
      const repository = this.connection.getRepository(entity.name);
      await repository.query(`DELETE FROM \"${entity.tableName}\";`);
    })
  }

  public async get(): Promise<Connection>{
    return await this.connection;
  }
}