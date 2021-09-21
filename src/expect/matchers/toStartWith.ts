import chalk from "chalk";
import { ITestProps } from "../../types";
import { buildReportMessage, asymetricTypeOf } from "../../utils";
import { matcherUtils } from "../matcherUtils";

/**
 * @internal
 */
export function toStartWith(this: ITestProps, expected: any, value: string) {
  let pass = matcherUtils.match(
    () => typeof expected === "string" && expected.startsWith(value),
    {
      value: expected,
      validParameters: [String],
    },
    {
      value: value,
      validParameters: [String],
    },
  );

  let isNotText = "";

  if (this.isNot) {
    pass = !pass;
    isNotText = " not";
  }

  let message = matcherUtils.getFailMessageForStringsLengthTest({
    expectationText: "start with",
    expected,
    props: this,
    isNotText,
    value,
  });

  return {
    pass,
    message: pass ? "" : buildReportMessage(this.createHint("value"), "\n\n", message),
  };
}