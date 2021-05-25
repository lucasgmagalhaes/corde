import { logger } from "../src/environment";

logger.mock();

console.log("I'm a log message");
console.info("I'm a info message");
console.warn("I'm a warn message");
console.error("I'm a error message");
console.count("I'm a count message");

logger.printStacks();
