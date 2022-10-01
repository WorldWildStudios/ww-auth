import { Request, Response, NextFunction } from "express";
import Logger from "../structures/Logger";
import chalk from "chalk";

const getMs = (start: any) => {
    const NS_PER_SEC = 1e9; //  convert to nanoseconds
    const NS_TO_MS = 1e6; // convert to milliseconds
    const diff = process.hrtime(start);
    return ((diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS).toLocaleString();
};

const timingColor = (ms: string | number) => {
    let msnum: number;
    if(typeof ms === "string") msnum = parseInt(ms as string);
    else msnum = ms as number;

    if(msnum < 100) return chalk.green(ms + "ms");
    else if(msnum < 500) return chalk.yellow(ms + "ms");
    else return chalk.red(ms + "ms");
};

export default (logger: Logger) => {
    // @ts-ignore
    return (req: Request, res: Response, next: NextFunction) => {
        next();
        const start = process.hrtime();
        const ms = getMs(start);
        if(res.statusCode >= 400 && res.statusCode < 500) return logger.warn(`${req.method} @${req.url} - ${res.statusCode} (${timingColor(ms)})`, "Express");
        if(res.statusCode >= 500) return logger.error(`${req.method} @${req.url} - ${res.statusCode} (${timingColor(ms)})`, "Express");
        logger.info(`${req.method} @${req.url} - ${res.statusCode} (${timingColor(ms)})`, "Express");
    };
};
