import * as Sq from "sequelize";
import config from './config';

const sequelize = new Sq.Sequelize(config.DATABASE_URL);

export default sequelize;