import morgan from 'morgan'

import { logger } from '.'
import config from '../config'

morgan.token('message', (req: any, res: any) => res.locals.errorMessage || '');

const getIpFormat = () => (config.env === 'prod' ? ':remote-addr - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
  skip: (req: any, res: any) => res.statusCode >= 400,
  stream: { write: (message: string) => logger.info(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (req: any, res: any) => res.statusCode < 400,
  stream: { write: (message: string) => logger.error(message.trim()) },
});

module.exports = {
  successHandler,
  errorHandler,
};