import * as Sq from "sequelize";
import User from './user';

interface GroupAttributes{
  id: number;
  name: string | null;
}

interface GroupCreationAttributes extends Sq.Optional<GroupAttributes, "id">{}

class Group extends Sq.Model<GroupAttributes, GroupCreationAttributes> implements GroupAttributes {
  public id!:number;
  public name!:string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public addUser!: Sq.BelongsToManyAddAssociationMixin<User, number>
  public addUsers!: Sq.BelongsToManyAddAssociationsMixin<User, number>
  public countUsers!: Sq.BelongsToManyCountAssociationsMixin
  public createUser!: Sq.BelongsToManyCreateAssociationMixin<User>
  public getUsers!: Sq.BelongsToManyGetAssociationsMixin<User>
  public hasUser!: Sq.BelongsToManyHasAssociationMixin<User, number>
  public hasUsers!: Sq.BelongsToManyHasAssociationsMixin<User, number>
  public removeUser!: Sq.BelongsToManyRemoveAssociationMixin<User, number>
  public removeUsers!: Sq.BelongsToManyRemoveAssociationsMixin<User, number>
  public setUsers!: Sq.BelongsToManySetAssociationsMixin<User, number>

  public readonly Users?: User[];
  
  public static associations: {
    Users: Sq.Association<User, Group>;
  }

  public static initialize(sequelize: Sq.Sequelize){
    this.init(
      {
        id: {
          type: Sq.DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: new Sq.DataTypes.STRING(128),
          allowNull: true,
        }
      },{
        tableName: "Group",
        sequelize
      }
    )
  }
}


export default Group;