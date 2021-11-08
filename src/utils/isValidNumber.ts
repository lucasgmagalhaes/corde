import { isNumeric } from ".";

/**
 * Checks if a value is a number and is different than **NaN**.
 *
 * @param value Value to check if is a valid number
 * @internal
 */
export function isValidNumber(value: any) {
  return isNumeric(value) && !isNaN(Number(value));
}