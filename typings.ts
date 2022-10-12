export type LoggerOptions = {
    name: string;
    timezone: string;
    tzformat: number;
    consolecolored: boolean;
    logconsole: {
        enabled: boolean;
        colored: boolean;
    };
    logsaving: {
        path: string;
        enabled: boolean;
    };
};