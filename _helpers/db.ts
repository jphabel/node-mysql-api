import { Sequelize } from 'sequelize';
import accountModel from '../accounts/account.model';
import refreshTokenModel from '../accounts/refresh-token.model';

const db: any = {};
export default db;

initialize();

async function initialize() {
    const sequelize = new Sequelize(
        process.env.DB_NAME || 'node_mysql_api',
        process.env.DB_USER!,
        process.env.DB_PASS!,
        {
            dialect: 'mysql',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT) || 4000,
            dialectOptions: {}
        }
    );

    db.Account = accountModel(sequelize);
    db.RefreshToken = refreshTokenModel(sequelize);

    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    await sequelize.sync();
}