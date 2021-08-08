/* eslint-disable no-control-regex */
/* eslint-disable no-console */
import { Message } from "discord.js";
import fs from "fs";
import * as childProcess from "child_process";
import { CliOutput, OSEnv } from "./types";
import path from "path";
import chalk from "chalk";
import { IConfigOptions } from "../src/types";

function getWindowsConfigs(): Partial<IConfigOptions> {
  return {
    botPrefix: process.env.BOT_PREFIX,
    timeout: Number(process.env.TIME_OUT),
    botTestId: process.env.BOT_TEST_ID_WINDOWS,
    botToken: process.env.BOT_TEST_TOKEN_WINDOWS,
    channelId: process.env.CHANNEL_ID_WINDOWS,
    cordeBotToken: process.env.CORDE_TEST_TOKEN_WINDOWS,
    guildId: process.env.GUILD_ID_WINDOWS,
  };
}

function getMacConfigs(): Partial<IConfigOptions> {
  return {
    botPrefix: process.env.BOT_PREFIX,
    timeout: Number(process.env.TIME_OUT),
    botTestId: process.env.BOT_TEST_ID_MAC,
    botToken: process.env.BOT_TEST_TOKEN_MAC,
    channelId: process.env.CHANNEL_ID_MAC,
    cordeBotToken: process.env.CORDE_TEST_TOKEN_MAC,
    guildId: process.env.GUILD_ID_MAC,
  };
}

function getDevConfigs(): Partial<IConfigOptions> {
  return {
    botPrefix: process.env.BOT_PREFIX,
    timeout: Number(process.env.TIME_OUT),
    botTestId: process.env.BOT_TEST_ID,
    botToken: process.env.BOT_TEST_TOKEN,
    channelId: process.env.CHANNEL_ID,
    cordeBotToken: process.env.CORDE_TEST_TOKEN,
    guildId: process.env.GUILD_ID,
  };
}

function getLinuxConfigs(): Partial<IConfigOptions> {
  return {
    botPrefix: process.env.BOT_PREFIX,
    timeout: Number(process.env.TIME_OUT),
    botTestId: process.env.BOT_TEST_ID_LINUX,
    botToken: process.env.BOT_TEST_TOKEN_LINUX,
    channelId: process.env.CHANNEL_ID_LINUX,
    cordeBotToken: process.env.CORDE_TEST_TOKEN_LINUX,
    guildId: process.env.GUILD_ID_LINUX,
  };
}

namespace testUtils {
  export function parseCommand(message: Message, prefix: string) {
    if (message.content.indexOf("") !== 0) return "";
    const args = message.content.slice(prefix.length).trim().split(" ");
    return args?.shift()?.toLowerCase();
  }

  export function buildCommandWithConfigPath(folderName: string, testFileName: string) {
    return `-f ./e2e/${folderName}/${testFileName}`;
  }

  export function saveOutput(filename: string, output: CliOutput) {
    // No need of preserve output in a CI environment
    if (process.env.CI_OS_ENV) {
      return;
    }

    let data = `File: ${filename}\n`;
    data += `exit code: ${output.exitCode}\n`;

    data += output.stdout;

    const SNAPSHOT_FOLDER = "./e2e/__snapshots__";

    if (!fs.existsSync(SNAPSHOT_FOLDER)) {
      fs.mkdirSync(SNAPSHOT_FOLDER);
    }

    const fullFilePath = `${SNAPSHOT_FOLDER}/${filename}`;
    const fileDirName = path.dirname(fullFilePath);

    if (!fs.existsSync(fileDirName)) {
      fs.mkdirSync(fileDirName);
    }

    fs.writeFileSync(fullFilePath.replace(".ts", ".log"), data);
  }

  /**
   * @internal
   */
  export function runCLI(command: string, setConfig = true) {
    return new Promise<CliOutput>((resolve) => {
      let con = `node ./bin/corde ${setConfig ? "--config ./e2e/corde.config.ts" : ""} ${command}`;

      con += " ";
      con += testUtils.env();

      console.log(`${chalk.bgYellow.grey(" RUNNING ")}: ${chalk.magenta(con)}`);

      const child = childProcess.exec(con, (error, stdout, stderr) => {
        if (error) {
          resolve({ stdout: removeANSIColorStyle(stdout), exitCode: child.exitCode });
        }

        if (stdout) {
          resolve({ stdout: removeANSIColorStyle(stdout), exitCode: child.exitCode });
        }

        if (stderr) {
          resolve({ stdout: removeANSIColorStyle(stdout), exitCode: child.exitCode });
        }
      });
    });
  }

  // Duplicated code from ../tests/testHelper
  // Due to jest types not being found in e2e folder (and can not to avoid types conflict)

  export function removeANSIColorStyle(value: string) {
    return value.replace(
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      "",
    );
  }

  export function isDebug() {
    const args = process.argv.slice(2);
    return args.includes("debug");
  }

  export function env() {
    // This value will be defined in CI
    if (process.env.CI_OS_ENV) {
      return process.env.CI_OS_ENV as OSEnv;
    }

    const args = process.argv.slice(2);
    if (args.includes("linux")) return "linux";
    if (args.includes("windows")) return "windows";
    if (args.includes("mac")) return "mac";
    if (args.includes("dev")) return "dev";
    return "dev";
  }

  export function getEnvConfig(): Partial<IConfigOptions> {
    const env = testUtils.env();
    switch (env) {
      case "dev":
        return getDevConfigs();
      case "linux":
        return getLinuxConfigs();
      case "mac":
        return getMacConfigs();
      case "windows":
        return getWindowsConfigs();
      default:
        return getDevConfigs();
    }
  }
}

export default testUtils;
