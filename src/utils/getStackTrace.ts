import { DEFAULT_STACK_TRACE_LIMIT, EXPECT_RECEIVED_TAB_SPACE } from "../consts";

/**
 * Gets the trace of the current function / object
 * Spacing each line of the trace with `DEFAULT_STACK_TRACE_LIMIT`
 *
 * @example
 *
 * 20  function creator(fn) {
 * 21    fn();
 * 22    return getStackTrace();
 * 23  }
 * 24
 * 25  creator(() => {});
 *
 * // Being that the function is in file: D:\github\corde\test.js
 * // And current working dir: D:\github\corde\test.js
 *
 * // Outputs:
 *     creator (test.js:22:10)
 *     Object.<anonymous> (test.js:25:13)
 *
 * @param stackLimit Amount of lines to be collected.
 * @returns Formated stack trace.
 *
 * @internal
 */
export function getStackTrace(
  stackLimit?: number | undefined | null,
  removeFirstStack = true,
  functionName?: string,
  adicionalSpace?: string,
): string {
  const obj: any = {};

  let space = EXPECT_RECEIVED_TAB_SPACE;

  if (adicionalSpace) {
    space += adicionalSpace;
  }

  Error.prepareStackTrace = (_, calls) => {
    const stacksWithoutFirstCall = calls.slice(removeFirstStack ? 1 : 0);

    // There is no need of 100% stack trace,
    // so we remove irrelevant paths.

    const formatFunctionName = functionName ? `${functionName} ` : "";

    const trace =
      space +
      "at " +
      formatFunctionName +
      stacksWithoutFirstCall
        .filter((s) => isStrackRelevant(s))
        .slice(0, stackLimit ?? DEFAULT_STACK_TRACE_LIMIT)
        .join("\n" + space + "at ");

    // removes full path of the file for security.
    const formatedPath = process.cwd().replace(/\\/g, "\\\\");
    const regex = new RegExp(formatedPath + "\\\\", "g");
    return trace.replace(regex, "");
  };

  Error.captureStackTrace(obj, getStackTrace);
  return obj.stack;
}

function isStrackRelevant(stack: NodeJS.CallSite) {
  const fileName = stack.getFileName();
  const functionName = stack.getFunctionName();
  return (
    !stack.isNative() &&
    !stack.isEval() &&
    (!functionName || !functionName.includes("Promise")) &&
    (!fileName ||
      (!fileName.startsWith("internal") &&
        !fileName.includes("\node_modules") &&
        !fileName.includes("node_modules")))
  );
}
