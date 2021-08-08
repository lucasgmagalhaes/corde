/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */

/**
 * package.json script: "e2e": "ts-node ./e2e/pipeline"
 */

/**
 * Corde script for end-to-end tests. In comparation with Jest, this script,
 * runs tests with avarage of ~5 seconds faster.
 * usage: yarn e2e
 *
 * This script must be executed outside ./e2e folder witch means, in the root
 * of corde folder.
 *
 * This script also suport specifics execution,
 * just add --tests followed by the test id
 *
 */

import chalk from "chalk";
import path from "path";
import { login, bot } from "./bot";
import { generator } from "./tests";
import testUtils from "./testUtils";

function logoutBot() {
  console.log(chalk.cyanBright("logout bot"));
  bot.destroy();
}

async function main() {
  console.log(`Environment: ${chalk.cyan(testUtils.env())}`);
  let exitCode = 0;

  process.stdout.write(chalk.cyanBright("loging example bot..."));

  await login();

  try {
    process.stdout.write(chalk.green(" Done\n"));

    const selectedTests = process.argv
      .slice(process.argv.indexOf("--tests"))
      .filter((el: any) => !isNaN(el));

    for (const [fileObj, testFn] of generator) {
      if (selectedTests.length === 0 || selectedTests.includes(fileObj.id.toString())) {
        const output = await testFn();
        console.log(chalk.cyanBright(`Output of: ${fileObj.testFile}\n`));
        console.log(output.stdout);
        testUtils.saveOutput(path.join(fileObj.folder, fileObj.testFile), output);

        if (output.exitCode !== fileObj.exitCodeExpectation) {
          console.log(
            `${chalk.bgRed.black(" FAIL ")} Exit code: ${output.exitCode}. Expected: ${
              fileObj.exitCodeExpectation
            }`,
          );
          logoutBot();
          return 1;
        }
      }
    }

    logoutBot();
  } catch (error) {
    logoutBot();
    console.log(`${chalk.bgRed.black(" FAIL ")} ${error}`);
    exitCode = 1;
  } finally {
    console.log("\n");
    if (exitCode === 0) {
      console.log(`${chalk.bgGreen(" SUCCESS ")}: All tests passed`);
    }
  }
  return exitCode;
}

main().then((exitCode) => process.exit(exitCode));
