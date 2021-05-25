import { logger } from "../environment";
import { buildReportMessage, formatObject, LogUpdate } from "../utils";

/**
 * @internal
 */
export function printHookErrors(errors: Error[], log?: LogUpdate) {
  for (let i = 0; i < errors.length; i++) {
    // Errors thrown by hooks are always of type Error.

    if (errors[i].message) {
      print(buildReportMessage(errors[i].message), log);
      print(buildReportMessage(errors[i].stack), log);
    } else {
      const _formatedObject = formatObject(errors[i]);
      print(buildReportMessage(_formatedObject));
    }
  }
}

function print(message: string, log?: LogUpdate) {
  if (log) {
    log.append(message);
    return;
  }
  logger.log(message);
}
