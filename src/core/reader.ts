import fs from "fs";
import path from "path";
import { printHookErrors } from "../common/printHookError";
import { testCollector } from "../common/testCollector";
import { logger, runtime } from "../environment";
import { FileError } from "../errors";
import { IConfigOptions, ITestFilePattern, ITestFile } from "../types";
import { utils } from "../utils";

class Reader {
  /**
   * Read config file(*.json) from root of project
   * and validates it
   * @throws
   */
  loadConfig(): IConfigOptions {
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

  async getTestsFromFiles(filesPattern: ITestFilePattern): Promise<ITestFile[]> {
    const testMatches: ITestFile[] = [];
    if (!filesPattern || !filesPattern.filesPattern.length) {
      throw new FileError("No file was informed.");
    }

    const filesPath: string[] = [];

    try {
      const matches = await utils.getFiles(filesPattern.filesPattern, filesPattern.ignorePattern);
      filesPath.push(...matches);
    } catch (error) {
      logger.log(error);
    }

    for (const file of filesPath) {
      try {
        const extension = path.extname(file);
        if (extension == ".js" || extension === ".ts") {
          require(file);
        }
      } catch (error) {
        logger.error(error);
        continue;
      }

      /**
       * This hooks is located here because after load the file,
       * We have to load the tests, and sometimes the user may,
       * expect to have something loaded in the hook above,
       * for instance, in beforeStart hook he inits the boot login,
       * and in a test, he get some data from the bot.
       */

      const _errors = await testCollector.beforeStartFunctions.executeWithCatchCollectAsync();

      if (_errors && _errors.length) {
        printHookErrors(_errors);
      }

      const groupErros = await testCollector.executeGroupClojure();

      if (groupErros && groupErros.length) {
        printHookErrors(groupErros);
      }

      const testErrors = await testCollector.executeTestClojure();

      if (testErrors && testErrors.length) {
        printHookErrors(testErrors);
      }

      this.addTestsGroupmentToGroupIfExist();
      this.addIsolatedTestFunctionsToGroupIfExists();

      const resolvedCwd = process.cwd().replace(/\\/g, "/");

      testMatches.push({
        path: file.replace(resolvedCwd + "/", ""),
        groups: testCollector.groups.slice(),
        isEmpty: testCollector.groups.length === 0,
      });

      testCollector.groups = [];
    }

    return testMatches;
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

  private addTestsGroupmentToGroupIfExist() {
    if (testCollector.tests && testCollector.tests.length > 0) {
      const testsCloned = testCollector.tests.slice();
      testCollector.groups.push({ tests: testsCloned });
      testCollector.tests = [];
    }
  }

  private addIsolatedTestFunctionsToGroupIfExists() {
    if (testCollector.hasIsolatedTestFunctions()) {
      const testsCloned = testCollector.cloneIsolatedTestFunctions();
      testCollector.groups.push({ tests: [{ testsFunctions: testsCloned }] });
      testCollector.clearIsolatedTestFunctions();
    }
  }
}

const reader = new Reader();
export { reader };
