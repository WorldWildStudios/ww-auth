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
import cookieParser from 'cookie-parser';
import fs from "fs";
import * as Express from 'express';

// @ts-ignore
export interface CRequest extends Express.Request {
    session: Session & Partial<SessionData> & {
        userId?: number;
        redirectTo?: string;
    };
    error?: Err;
}
export interface CResponse extends Express.Response {

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
app.use(cookieParser(config.secret));
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
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

const isValidMethod = (method: string) => ['get', 'post', 'put', 'patch', 'delete'].includes(method.toLowerCase());


async function main() {
    const files = fs.readdirSync(path.join(__dirname, 'routes')).filter(file => file.endsWith('.js'));
    for (const file of files) {
        const route = (await import("file://" + path.join(__dirname, 'routes', file))).default;
        if (route.path && route.router && isValidMethod(route.method)) {

            const run = (req: CRequest, res: CResponse) => {
                console.log(req.session);
                if(route.loginRequired) {
                    if(!req.session.userId) {
                        req.session['redirectTo'] = req.path;
                        req.session.save((err) => {
                            if(err) {
                                logger.error(err, 'Express');
                            }
                        });
                        return res.render('mustlogin');
                    } else {
                        const connectedUser = users.findOne({ where: { id: req.session['userId'] } });
                        return route.router(req, res, logger, {connectedUser});
                    }
                } else {
                    return route.router(req, res, logger, {});
                }
            }


            // @ts-ignore
            app[route.method.toLowerCase()](route.path, run);
            logger.info(`Loaded route '${route.path}' (${route.method.toUpperCase()})`, 'Express');
        }
    }
}




class Err extends Error {
    public status: number = 500;

    constructor(message: string) {
        super(message);
    };
}
main().then(() => {
    app.post('/register', registerPost);


    app.use((req: CRequest, res: CResponse, next) => {
        console.log("Debug 1");
        const error = new Err("Not found");
        error.status = 404;
        console.log(next);
        req.error = error;
        next();
    });

    app.use((req: CRequest, res: CResponse) => {
        console.log(req.error);
        let error = (!req.error ? new Err("Internal Server Error") : req.error) as Err;
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
}).catch((error) => {
    logger.fatal(error.stack + "\n\n**** FATAL: The website needs to be loaded.", 'Express');
});



