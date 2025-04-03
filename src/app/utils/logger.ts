// https://github.com/dbfannin/ngx-logger/issues/74
import { NGXLogger } from 'ngx-logger';

export let logger: NGXLogger;

export const initLogger = (newLogger: NGXLogger) => (logger = newLogger);
