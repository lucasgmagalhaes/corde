import { spinner } from "./cli/exec";
import { testCollector } from "./common/testCollector";
import { logger, runtime } from "./environment";
import { PropertyError } from "./errors";
import { exit } from "./exit";

export function initErrorHandlers() {
  process.on("uncaughtException", async (err: Error) => {
    await printErrorAndExit(err);
  });

  process.on("unhandledRejection", async (err: Error) => {
    await printErrorAndExit(err);
  });

  process.on("uncaughtExceptionMonitor", async (err) => {
    await printErrorAndExit(err);
  });
}

async function printErrorAndExit(error: Error) {
  spinner?.stop();

  if (error instanceof PropertyError) {
    logger.error(error.message);
  } else {
    logger.error(error.stack);
  }

  if (runtime.isBotLoggedIn()) {
    runtime.logoffBot();
  }

  if (testCollector.afterAllFunctions) {
    await testCollector.afterAllFunctions.executeAsync();
  }

  if (process.env.ENV !== "TEST") {
    exit(1);
  }
}
