import chalk from "chalk";
import { Queue } from "../data-structures";
import { runtime } from "../environment";
import { VoidLikeFunction } from "../types";
import { executePromiseWithTimeout, formatObject } from "../utils";

interface HookParams {
  queueToAdd: Queue<VoidLikeFunction>;
  fn: () => void | Promise<void>;
  trace: string;
  errorTitle: string;
  timeout?: number;
}

/**
 * Add a function to a informed hook
 *
 * @internal
 */
export function hookBuilder(params: HookParams) {
  const { queueToAdd, fn, trace, errorTitle, timeout } = params;
  queueToAdd.enqueue(async () => {
    try {
      await executePromiseWithTimeout<void>(async (resolve, reject) => {
        try {
          await fn();
          resolve();
        } catch (error) {
          reject(error);
        }
      }, timeout ?? runtime.timeout);
    } catch (error) {
      let newError: Error;
      const errorLabel = chalk.bgRed(`● ${errorTitle}`);
      if (error instanceof Error && error.message) {
        newError = new Error(`${errorLabel}: ${error.message}`);
      } else {
        newError = new Error(`${errorLabel}: ${formatObject(error)}`);
      }

      newError.stack = trace;
      throw newError;
    }
  });
}
