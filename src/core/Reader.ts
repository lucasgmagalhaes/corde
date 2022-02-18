/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import { printHookErrors } from "./printHookError";
import runtime from "./runtime";
import { FileError } from "../errors";
import { IConfigOptions, ITestFilePattern } from "../types";
import { getFiles } from "../utils/getFiles";
import { importFile } from "../utils/importFile";
import { safeImportFile } from "../utils/safeImportFile";

export class Reader {
  /**
   * Read config file(*.json) from root of project
   * and validates it
   * @throws
   */
  loadConfig() {
    let _config: IConfigOptions;

    const jsonFilePath = path.resolve(process.cwd(), "corde.config.json");
    const tsFilePath = path.resolve(process.cwd(), "corde.config.ts");
    const jsFilePath = path.resolve(process.cwd(), "corde.config.js");

    if (runtime.configFilePath) {
      return this.loadConfigFromConfigFilePath();
    }

    if (fs.existsSync(jsonFilePath)) {
      _config = JSON.parse(fs.readFileSync(jsonFilePath).toString());
    } else if (fs.existsSync(tsFilePath)) {
      _config = require(tsFilePath);
    } else if (fs.existsSync(jsFilePath)) {
      _config = require(jsFilePath);
    } else {
      throw new FileError("No config file was found");
    }

    if (!_config || Object.keys(_config).length === 0) {
      throw new FileError("This appears to be a invalid config file");
    } else {
      return _config;
    }
  }

  async getTestsFromFiles(filesPattern: ITestFilePattern) {
    if (!filesPattern || !filesPattern.filesPattern.length) {
      throw new FileError("No file was informed.");
    }

    const filesPath: string[] = [];

    try {
      const matches = await getFiles(filesPattern.filesPattern, filesPattern.ignorePattern);
      filesPath.push(...matches);
    } catch (error) {
      console.log(error);
    }

    const { configs, testCollector } = runtime;

    for (const file of filesPath) {
      const extension = path.extname(file);
      if (configs.extensions?.includes(extension)) {
        const resolvedCwd = process.cwd().replace(/\\/g, "/");
        testCollector.createTestFile(file.replace(resolvedCwd + "/", ""));

        if (configs.exitOnFileReadingError) {
          await importFile(file);
        } else {
          await safeImportFile(file, console.error);
        }

        // After each file read, execute group closures to load all tests
        // into currentTestFile
        const groupErrors = await testCollector.executeGroupClojure();

        if (groupErrors && groupErrors.length) {
          printHookErrors(groupErrors);
        }
      }
    }

    return testCollector.testFiles;
  }

  private loadConfigFromConfigFilePath(): IConfigOptions {
    let filePath = "";
    if (fs.existsSync(runtime.configFilePath)) {
      filePath = path.resolve(process.cwd(), runtime.configFilePath);
    } else {
      throw new FileError(`The path '${runtime.configFilePath}' do not appears to be a valid path`);
    }
    const fileExt = path.extname(filePath);

    if (fileExt === ".json") {
      return JSON.parse(fs.readFileSync(filePath).toString());
    } else if (fileExt === ".js" || fileExt === ".ts") {
      return require(filePath);
    } else {
      throw new FileError(`Extension '${fileExt}' is not supported`);
    }
  }
}

const reader = new Reader();
export { reader };