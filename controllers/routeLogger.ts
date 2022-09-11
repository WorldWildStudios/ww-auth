import { Request, Response, NextFunction } from 'express';
import Logger from "../structures/Logger";
import chalk from "chalk";

/*
export default class RouteLogger {
    public logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
        return this;
    };

    public middleware(req: Request, res: Response, next: NextFunction) {
        console.log(this.logger);
        this.logger.info(`${req.url} @${req.method}`, 'Express');
        next();
    };
};
*/

const getMs = (start: any) => {
    const NS_PER_SEC = 1e9; //  convert to nanoseconds
    const NS_TO_MS = 1e6; // convert to milliseconds
    const diff = process.hrtime(start);
    return ((diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS).toLocaleString();
};

export default (logger: Logger, req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    next();
    const start = process.hrtime();
    const ms = getMs(start);
    logger.info(`${req.method} @${req.url} - ${res.statusCode} (${chalk.red(`${ms} ms`)})`, 'Express');
};
