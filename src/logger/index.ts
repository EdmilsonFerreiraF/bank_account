import winston from 'winston'
import * as rfs from 'rotating-file-stream'
import path from 'path'

import config from '../config'

console.log('rfs', rfs)
const enumerateErrorFormat = winston.format((info: any) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }

    return info;
});

// create a rotating write stream
export const accessLogStream = rfs.createStream('access.log', {
    size: "10M", // rotate every 10 MegaBytes written   
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
})

export const logger = winston.createLogger({
    level: config.env === 'dev' ? 'debug' : 'info',
    format: winston.format.combine(
        enumerateErrorFormat(),
        config.env === 'dev' ? winston.format.colorize() : winston.format.uncolorize(),
        winston.format.splat(),
        winston.format.printf(({ level, message }: { level: any, message: any }) => `${level}: ${message}`)
    ),
    transports: [
        new winston.transports.Console({
            stderrLevels: ['error'],
        }),
    ],
});