/**
 * Returns the timestamp removing the miliseconds
 */
export function getTimeStampFormated(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Gets a number and transform it in a time formatted.
 * @example 3600 will become 01:00:00
 * @param number Element that will be converted
 */
export function getTime(number: number) {
  const seconds = Math.floor(number % 60);
  number = number / 60;

  const minutes = Math.floor(number % 60);
  number = number / 60;

  const hours = Math.floor(number % 24);
  const days = Math.floor(number / 24);

  if (days > 0) {
    if (days === 1) {
      return `${days} day, ${expand(hours)}:${expand(minutes)}:${expand(seconds)}`;
    }
    return `${days} days, ${expand(hours)}:${expand(minutes)}:${expand(seconds)}`;
  }
  return `${expand(hours)}:${expand(minutes)}:${expand(seconds)}`;
}

/**
 * Checks if the number is less than 10, putting a 0 in front of him if
 * it be
 * @param number Element that will receive another decimal house
 */
function expand(number: number): string {
  return number < 10 ? `0${number}` : number.toString();
}
