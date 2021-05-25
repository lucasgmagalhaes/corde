import { Runtime } from "./common/runtime";
import { initErrorHandlers } from "./errorHandler";
import { Logger } from "./common/logger";

let runtime: Runtime;
let logger: Logger;

/**
 * @internal
 */
export function initCordeEnv() {
  initEnvVariables();
  initErrorHandlers();

  runtime = new Runtime();
  logger = new Logger(process.stdout);
  logger.mock();
}

export function initEnvVariables() {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "corde_test";
  }
}

export { runtime, logger };
