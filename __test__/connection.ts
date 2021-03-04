import { createConnection, getConnection, Connection } from 'typeorm';

export class DBConnect {
  public async create(){
    await createConnection();
  }

  public async close(){
    await getConnection().close();
  }

  public async clear(){
    const connection = getConnection();
    const entities = connection.entityMetadatas;

    entities.forEach( async (entity) => {
      const repository = connection.getRepository(entity.name);
      await repository.query(`DELETE FROM \`${entity.tableName}\`;`);
    })
  }

  public async get(): Promise<Connection>{
    return await getConnection();
  }
}