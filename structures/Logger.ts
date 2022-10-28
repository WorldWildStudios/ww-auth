import chalk from 'chalk';
import { LoggerOptions } from '../typings';
import moment from 'moment';
import 'moment-timezone';
import fs from 'fs';

class LoggerError extends Error {
    constructor(message: string) {
        super(message);
    };
}

const colors = {
    grey: '#bbbbbb',
    gray: '#4C4C4C',
    blue: '#48ACF8',
    loggernamecolor: '#4CBAFF',
    processcolor: '#4C70FF',
    info: {
        color: '#59E77D',
        light: '#96F2AD',
        background: '#D2EED9',
        highlight: false,
    },
    debug: {
        color: '#68E3DF',
        light: '#AFF8F5',
        background: '#D5F5F4',
        highlight: false,
    },
    warn: {
        color: '#F2D349',
        light: '#FBE47E',
        background: '#FAEFBB',
        highlight: false,
    },
    error: {
        color: '#F6545C',
        light: '#FB979C',
        background: '#FACBCD',
        highlight: false,
    },
    fatal: {
        color: '#F71111',
        light: '#F46161',
        background: '#FAACAC',
        highlight: true,
    }
};



export default class Logger {
    public options: LoggerOptions = {
        name: 'MyLogger',
        timezone: 'Europe/Paris',
        tzformat: 24,
        consolecolored: true,
        logconsole: {
            enabled: true,
            colored: true
        },
        logsaving: {
            path: './logs',
            enabled: false
        }
    };
    public colors: typeof colors = colors;
    public name: string;
    public date: Date = new Date();
    public formattedDate: string = moment(this.date).tz(this.options.timezone).format(`DD/MM/YYYY HH:mm:ss`);
    public sessiondate: string = moment(new Date()).tz(this.options.timezone).format(`DD-MM-YYYY--HH-mm-ss`);
    public max_length: number = 16;

    constructor(options: LoggerOptions) {
        if(!options) throw new LoggerError('Please provide options to the logger.');
        if(!options.name) throw new LoggerError('Please provide a name.');
        
        this.options = options;
        if(this.options.logsaving.enabled && !fs.existsSync(this.options.logsaving.path)) {
            console.warn(`[Logger] The logs folder doesn't exist, creating it...`);
            fs.mkdirSync(this.options.logsaving.path);
        }
    };

    /**
     * 
     * @param message The message to format
     * @param type The type of the log
     * @param process The optionnal process of the log
     * @returns The formatted message
     */
     public formatMessage(message: string, type: ('info' | 'debug' | 'warn' | 'fatal' | 'error'), process?: string): [string, string] {
        this.refreshDates();
        const loggernamecolor = this.colors.loggernamecolor;
        const processcolor = this.colors.processcolor;
        const blue = this.colors.blue;
        const grey = this.colors.grey;
        const color = this.colors[type].color;
        const colorlight = this.colors[type].light;
        const background = this.colors[type].background;
        const highlight = this.colors[type].highlight;
        
        /*const firstPart = `[${this.formattedDate}] [${this.options.name.toUpperCase()}${process ? ` / ${process}` : ''}]`;
        const firstPart_length = firstPart.length;
 
        if(firstPart_length > this.max_length) {
            this.max_length = firstPart_length;
        };
  

        const formattedMessage =  `${firstPart}${new Array(0).join(" ")} ▪ ${message}`;*/
        const formattedMessage = `[${this.formattedDate}] [${type.toUpperCase()}${process ? ` / ${process}` : ''}] ${type.toUpperCase()} ▪ ${message}`;

        if(this.options.logconsole.colored) {
            return [`${chalk.hex(grey)('[')}${chalk.hex(blue)(this.formattedDate)}${chalk.hex(grey)(']')} ${chalk.hex(grey)('[')}${chalk.hex(loggernamecolor)(this.options.name)}${process ? chalk.hex(grey)(' / ') : ''}${process ? chalk.hex(processcolor)(process) : ''}${chalk.hex(grey)(']')} ${highlight ? chalk.bgHex(background)(chalk.hex(colorlight)(type.toUpperCase())) : chalk.hex(colorlight)(type.toUpperCase())} ${chalk.hex(grey)('▪')} ${chalk.hex(color)(message)}`, formattedMessage];
        } else {
            return [formattedMessage, formattedMessage];
        }
    };

    refreshDates(): void {
        const date = new Date();

        this.date = date;
        this.formattedDate = moment(date).tz(this.options.timezone).format(`DD/MM/YYYY HH:mm:ss${this.options.tzformat === 12 ? ' A' : ''}`);
    };

    public info(message: string, process: string): void {
        const [formattedMessage, black_and_white] = this.formatMessage(message, 'info', process);
        this.refreshDates();

        if(this.options.logconsole.enabled) console.info(formattedMessage);
        if(this.options.logsaving.enabled) fs.appendFileSync(`${this.options.logsaving.path}/${this.sessiondate}.log`, `${black_and_white}\n`);
    };

    public error(message: string, process: string): void {
        const [formattedMessage, black_and_white] = this.formatMessage(message, 'error', process);
        this.refreshDates();

        if(this.options.logconsole.enabled) console.error(formattedMessage);
        if(this.options.logsaving.enabled) fs.appendFileSync(`${this.options.logsaving.path}/${this.sessiondate}.log`, `${black_and_white}\n`);
    };

    public fatal(message: string, optionalprocess: string):void {
        const [formattedMessage, black_and_white] = this.formatMessage(message, 'fatal', optionalprocess);
        this.refreshDates();

        if(this.options.logconsole.enabled) console.error(formattedMessage);
        if(this.options.logsaving.enabled) fs.appendFileSync(`${this.options.logsaving.path}/${this.sessiondate}.log`, `${black_and_white}\n`);
        process.exit(1);
    };

    public debug(message: string, process: string):void {
        const [formattedMessage, black_and_white] = this.formatMessage(message, 'debug', process);
        this.refreshDates();

        if(this.options.logconsole.enabled) console.debug(formattedMessage);
        if(this.options.logsaving.enabled) fs.appendFileSync(`${this.options.logsaving.path}/${this.sessiondate}.log`, `${black_and_white}\n`);
    };

    public warn(message: string, process: string):void {
        const [formattedMessage, black_and_white] = this.formatMessage(message, 'warn', process);
        this.refreshDates();

        if(this.options.logconsole.enabled) console.warn(formattedMessage);
        if(this.options.logsaving.enabled) fs.appendFileSync(`${this.options.logsaving.path}/${this.sessiondate}.log`, `${black_and_white}\n`);
    };
};