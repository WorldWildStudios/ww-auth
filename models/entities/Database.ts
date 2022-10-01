import Users from './Users.js';
import { DataSource } from 'typeorm';
import config from '../../config.js';


const DB = new DataSource({
    "type": "mssql",
    "host": config.host,
    "username": config.username,
    "password": config.password,
    "port": config.dbport,
    "database": "wwauth", //"ww_auth_db",
    "entities": [Users],
    "extra": {
        "encrypt": true,
        "trustServerCertificate": false
    }
});
const users = DB.getRepository(Users);


export {
    DB,
    users
};