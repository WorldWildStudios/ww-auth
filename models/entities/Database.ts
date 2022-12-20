import Users from './Users.js';
import Applications from "./Applications.js";
import Connections from "./Connections.js";
import Sessions from "./Sessions.js";
import { DataSource } from 'typeorm';
import config from '../../config.js';


const DB = new DataSource({
    "type": "mssql",
    "host": config.host,
    "username": config.username,
    "password": config.password,
    "port": config.dbport,
    "database": "wwauth", //"ww_auth_db",
    "entities": [Users, Applications, Connections, Sessions],
    "extra": {
        "encrypt": true,
        "trustServerCertificate": false
    }
});

const users = DB.getRepository(Users);
const applications = DB.getRepository(Applications);
const connections = DB.getRepository(Connections);
const sessionRepository = DB.getRepository(Sessions);


export {
    DB,
    users,
    applications,
    connections,
    sessionRepository
};