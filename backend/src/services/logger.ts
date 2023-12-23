import { AsyncLocalStorage } from "node:async_hooks";

type LoggingContext = { isProduction: boolean };
export const loggingContext = new AsyncLocalStorage<LoggingContext>();

const INFO_COLOR = "\x1b[34m";
const DEBUG_COLOR = "\x1b[35m";
const ERROR_COLOR = "\x1b[31m";
const RESET_COLOR = "\x1b[0m";

export const log = {
  info: (message: string) => {
    console.log(`${INFO_COLOR}[info]${RESET_COLOR}`, message);
  },

  debug: (message: string) => {
    const isProduction = loggingContext.getStore()?.isProduction ?? false;
    if (isProduction) {
      return;
    }
    console.log(`${DEBUG_COLOR}[debug]${RESET_COLOR}`, message);
  },

  error: (message: string) => {
    const log = loggingContext.getStore()?.isProduction
      ? console.error
      : console.log;

    log(`${ERROR_COLOR}[error]${RESET_COLOR}`, message);
  },
} as const;
