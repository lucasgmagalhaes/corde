import chalk from "chalk";
import { ITestProps } from "../../types";
import { buildReportMessage, asymetricTypeOf } from "../../utils";
import { matcherUtils } from "../matcherUtils";

/**
 * @internal
 */
export function toBePositiveInfinity(this: ITestProps, expected: any) {
  let pass = matcherUtils.match(() => expected === Number.POSITIVE_INFINITY, {
    value: expected,
    validParameters: [Number, BigInt],
  });
  let isNotText = "";

  if (this.isNot) {
    pass = !pass;
    isNotText = " not";
  }

  let expectedOutput = expected;

  if (
    matcherUtils.isAsymetric(expected) &&
    typeof expected !== "number" &&
    typeof expected !== "bigint"
  ) {
    expectedOutput = asymetricTypeOf(expected);
  }

  return {
    pass,
    message: pass
      ? ""
      : buildReportMessage(
          this.createHint(),
          "\n\n",
          `${this.expectedColorFn("expected")} should${isNotText} be ${chalk.green("Infinity")}.\n`,
          `got: ${chalk.red(expectedOutput)}`,
        ),
  };
}