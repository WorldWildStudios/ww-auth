import express, { urlencoded } from 'express';
import path from 'path';
import config from './config.js';
import 'reflect-metadata';
import hash from './structures/Hash.js';
import Logger from './structures/Logger.js';
import session from 'express-session';
import {DB, users} from './models/entities/Database.js';
import * as url from 'url';
import registerPost from './controllers/RegisterPost.js';
import routeLogger from './controllers/routeLogger.js';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


const logger = new Logger({
    name: 'WW-Auth',
    timezone: 'Europe/Paris',
    tzformat: 24,
    consolecolored: true,
    logconsole: {
        enabled: true,
        colored: true
    },
    logsaving: {
        path: './logs',
        enabled: false,
    }
});





DB.initialize().then(() => {
        logger.info('connected', 'DB');
}).catch((error) => logger.fatal(error.stack + "\n\n*** This error is fatal, a Database is needed for the website to run.", 'DB'));


const port = config.port || 80;

const app = express();

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.listen(port, () => {
    logger.info('listening on port 80', 'Express');
});
app.use((req, res, next) => routeLogger(logger, req, res, next));


app.post('/register', registerPost);

app.get('/', async (req, res) => {
    /*let createdUser: Users = new Users();
    createdUser.username = "Wesh";
    createdUser.lastName = "Ribo";
    createdUser.firstName = 'Paul';
    createdUser.phone = "55555555555";
    createdUser.avatarUUID = "24164325324eds524103zqe5swx";
    createdUser.email = 'uwu@gmail.com';
    createdUser.password = hash("HuskyDeLaStreet");
    await users.save(createdUser);*/

    const usersR = await users.find();

    res.render('index', {
        users: usersR,
        password: hash("HuskyDeLaStreet")
    });
});


app.get('/register', async (req, res) => {
    /*let createdUser: Users = new Users();
    createdUser.username = "Wesh";
    createdUser.lastName = "Ribo";
    createdUser.firstName = 'Paul';
    createdUser.phone = "55555555555";
    createdUser.avatarUUID = "24164325324eds524103zqe5swx";
    createdUser.email = 'uwu@gmail.com';
    createdUser.password = hash("HuskyDeLaStreet");
    await users.save(createdUser);
    */
    const usersR = await users.find();

    res.render('register', {
        users: usersR,
        password: hash("HuskyDeLaStreet")
    });
});

class Err extends Error {
    public status: number = 501;

    constructor(message: string) {
        super(message);
    };
}

app.set('trust proxy', 1);
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use(urlencoded({ extended: true }));

app.use((req, res, next) => {
  const error = new Err("Not found");
  error.status = 404;
  next(error);
});
app.use((error: Err, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if(error.status === 404) {
        res.status(404).render("404");
    } else {
        logger.error((error.stack as string), 'Express');
        res.status(error.status || 500).render('globalerror', {
          code: error.status || 500,
          message: error.message || 'Internal Server Error',
          error: error
        });
    }
});