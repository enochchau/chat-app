import * as Sq from "sequelize";
import sequelize from '../db';
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

  public getUsers!: Sq.HasManyGetAssociationsMixin<User>;
  public addUser!: Sq.HasManyAddAssociationMixin<User, number>;
  public hasUser!: Sq.HasManyHasAssociationMixin<User, number>;
  public countUsers!: Sq.HasManyCountAssociationsMixin;
  public createUser!: Sq.HasManyCreateAssociationMixin<User>;

  public readonly users?: User[];
  
  public static associations: {
    users: Sq.Association<User, Group>;
  }
}

Group.init(
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
    tableName: "Groups",
    sequelize
  }
)

export default Group;