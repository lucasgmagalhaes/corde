import chalk from "chalk";
import fs from "fs";
import ora, { Color, Ora } from "ora";
import path from "path";
import { runtime, testCollector } from "../common";
import { reader, summary, TestExecutor } from "../core";
import { FileError } from "../errors";
import { LogUpdate } from "../utils/logUpdate";
import { validate } from "./validate";

declare module "ora" {
  interface Ora {
    _spinner: object;
  }
}

process.on("uncaughtException", () => {
  stopLoading();
});

let spinner: Ora;

export async function exec() {
  loadConfigs();
  const files = readDir(runtime.testFiles);
  if (!files || files.length === 0) {
    throw new FileError(`No test file was found in the path '${runtime.testFiles}'`);
  }
  await runTests(files);
}

function loadConfigs() {
  const configs = reader.loadConfig();
  runtime.setConfigs(configs);
  validate(runtime.configs);
}

async function runTests(files: string[]) {
  startLoading("login to corde bot");
  // No need to await this function
  runtime.loginBot(runtime.cordeTestToken);
  await runtime.events.onceReady();
  spinner.stop();

  try {
    const testFiles = await reader.getTestsFromFiles(files);
    if (testFiles.length === 0) {
      console.log(`${chalk.bgYellow(chalk.black(" INFO "))} No test were found.`);
      await finishProcess(0);
    }
    const log = new LogUpdate();
    const testRunner = new TestExecutor(log);
    const executionReport = await testRunner.runTestsAndPrint(testFiles);

    if (runtime.environment.isE2eTest) {
      console.log(log.stdout);
    }

    summary.print(executionReport);

    if (executionReport.totalTestsFailed > 0) {
      await finishProcess(1);
    } else {
      await finishProcess(0);
    }
  } catch (error) {
    spinner.stop();
    console.error(error);
    await finishProcess(1);
  }
}

async function finishProcess(code: number, error?: any): Promise<never> {
  try {
    if (error) {
      console.log(error);
    }

    if (testCollector.afterAllFunctions.hasFunctions) {
      const exceptions = await testCollector.afterAllFunctions.executeWithCatchCollectAsync();
      if (exceptions.length) {
        console.log(...exceptions);
        code = 1;
      }
    }

    runtime.logoffBot();
  } finally {
    process.exit(code);
  }
}

function startLoading(initialMessage: string) {
  spinner = ora(initialMessage).start();
  spinner._spinner = {
    interval: 80,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  };
  spinner.color = getRandomSpinnerColor() as Color;
}

function getRandomSpinnerColor() {
  const colors = ["red", "green", "yellow", "blue", "magenta", "cyan"];
  let random = Math.random() * (colors.length - 1);
  random = Math.round(random);
  return colors[random];
}

function stopLoading() {
  if (spinner) {
    spinner.stop();
    spinner.clear();
  }
}

/**
 * Load tests files into configs
 */
function readDir(directories: string[]) {
  const files: string[] = [];
  for (const dir of directories) {
    const resolvedPath = path.resolve(process.cwd(), dir);

    if (fs.existsSync(resolvedPath)) {
      const stats = fs.lstatSync(resolvedPath);
      if (stats.isDirectory()) {
        const dirContent = fs.readdirSync(resolvedPath);
        const dirContentPaths = [];
        for (const singleDirContent of dirContent) {
          dirContentPaths.push(path.resolve(dir, singleDirContent));
        }
        files.push(...readDir(dirContentPaths));
      } else if (stats.isFile() && dir.includes(".test.")) {
        files.push(resolvedPath);
      }
    }
  }

  return files;
}