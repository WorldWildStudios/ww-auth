import express, { urlencoded } from 'express';
import path from 'path';
import config from './config.js';
import 'reflect-metadata';
import Logger from './structures/Logger.js';
import session from 'express-session';
import {DB} from './models/entities/Database.js';
import * as url from 'url';
import registerPost from './controllers/RegisterPost.js';
import routeLogger from './controllers/routeLogger.js';
import flash from 'connect-flash';
import cookierParser from 'cookie-parser';
import fs from "fs";
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
app.set('trust proxy', 1);
app.use(cookierParser(config.secret));
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));
app.use(flash());
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.listen(port, () => {
    logger.info('listening on port 80', 'Express');
});

app.use(routeLogger(logger));

const files = fs.readdirSync(path.join(__dirname, 'routes')).filter(file => file.endsWith('.js'));

async function main() {
    for (const file of files) {
        const route = (await import("file://" + path.join(__dirname, 'routes', file))).default;
        if (route.path && route.router) {
            switch(route.method.toLowerCase()) {
                case 'get':
                    app.get(route.path, route.router(logger)());
                    break;
                case 'post':
                    app.post(route.path, route.router(logger)());
                    break;
                case 'put':
                    app.put(route.path, route.router(logger)());
                    break;
                case 'delete':
                    app.delete(route.path, route.router(logger)());
                    break;
                case 'patch':
                    app.patch(route.path, route.router(logger)());
                    break;
                default:
                    throw new Error(`Invalid method '${route.method}' in file '${file}'`);
            }
            logger.info(`Loaded route '${route.path}' with method ${route.method}`, 'Express');
        }
    }
}




class Err extends Error {
    public status: number = 501;

    constructor(message: string) {
        super(message);
    };
}
main().then(() => {
    app.post('/register', registerPost);

    app.use((req, res, next) => {
        const error = new Err("Not found");
        error.status = 404;
        next(error);
    });

    app.use((error: Err, req: express.Request, res: express.Response) => {
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
});



