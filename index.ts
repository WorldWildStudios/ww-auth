import express, {NextFunction, Response, urlencoded} from 'express';
import path from 'path';
import config from './config.js';
import 'reflect-metadata';
import Logger from './structures/Logger.js';
import session, {Session, SessionData} from 'express-session';
import { TypeormStore } from "connect-typeorm";
import {DB, users, sessionRepository} from './models/entities/Database.js';
import * as url from 'url';
import registerPost from './controllers/RegisterPost.js';
import routeLogger from './controllers/routeLogger.js';
import cookierParser from 'cookie-parser';
import fs from "fs";
import * as Express from 'express';
// @ts-ignore
export interface Request extends Express.Request {
    session: Session & Partial<SessionData> & {
        userId?: number;
        redirectTo?: string;
    };
}
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
    resave: true,
    saveUninitialized: true,
    store: new TypeormStore({
        cleanupLimit: 2,
        limitSubquery: false, // If using MariaDB.
        ttl: 86400
    }).connect(sessionRepository)
}));
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
            let run;
            if(route.loginRequired) {
                run = (req: Request, res: Response, next: NextFunction) => {
                    logger.debug(JSON.stringify(req.session), "DEVDEBUG")
                    if (!req.session.userId) {
                        req.session['redirectTo'] = req.path;
                        return res.render('mustlogin');
                    } else {
                        const connectedUser = users.findOne({where: {id: req.session['userId']}});
                        return route.router(logger)({connectedUser})(req, res, next);
                    }
                }
            } else {
                run = route.router(logger)();
            }

            switch(route.method.toLowerCase()) {
                case 'get':
                    app.get(route.path, run);
                    break;
                case 'post':
                    app.post(route.path, run);
                    break;
                case 'put':
                    app.put(route.path, run);
                    break;
                case 'delete':
                    app.delete(route.path, run);
                    break;
                case 'patch':
                    app.patch(route.path, run);
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



