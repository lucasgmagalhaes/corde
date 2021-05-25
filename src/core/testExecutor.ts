import chalk from "chalk";
import { testCollector } from "../common/testCollector";
import { printHookErrors } from "../common/printHookError";
import {
  MESSAGE_TAB_SPACE,
  TAG_FAIL,
  TAG_PASS,
  TAG_PENDING,
  TEST_FAIL_ICON,
  TEST_PASSED_ICON,
  DOT,
  TEXT_EMPTY,
  TEXT_FAIL,
  TEXT_PASS,
} from "../consts";
import { Queue } from "../data-structures";
import {
  IGroup,
  IRunnerReport,
  ISemiRunnerReport,
  ITest,
  ITestFile,
  ITestReport,
  VoidLikeFunction,
} from "../types";
import { formatObject, stringIsNullOrEmpty, Timer } from "../utils";
import { LogUpdate } from "../utils";
import { runtime } from "../environment";

export class TestExecutor {
  private _logUpdate: LogUpdate;

  constructor(logUpdate: LogUpdate) {
    this._logUpdate = logUpdate;
  }

  async runTestsAndPrint(testMatches: ITestFile[]): Promise<IRunnerReport> {
    const testsTimer = new Timer();
    testsTimer.start();

    const semiReport: ISemiRunnerReport = {
      totalTests: 0,
      totalTestFiles: 0,
      totalTestsPassed: 0,
      totalTestsFailed: 0,
      totalTestFilesPassed: 0,
      totalTestFilesFailed: 0,
      totalEmptyTestFiles: 0,
      totalEmptyTests: 0,
    };

    for (const testFile of testMatches) {
      if (testFile.isEmpty) {
        this._logUpdate.append(`${TAG_PENDING("EMPTY")}  ${testFile.path}`);
        this._logUpdate.persist();
        semiReport.totalEmptyTestFiles++;
        semiReport.totalTestFiles++;
      } else {
        if (await this.executeTestFile(testFile, semiReport)) {
          semiReport.totalTestFilesPassed++;
        } else {
          semiReport.totalTestFilesFailed++;
        }
      }
    }
    const testsDiff = testsTimer.stop();

    runtime.printLoggerIfNotSilent();

    return {
      testTimer: testsDiff[0],
      ...semiReport,
    };
  }

  private async executeTestFile(testFile: ITestFile, semiReport: ISemiRunnerReport) {
    const testFileTimer = new Timer();
    semiReport.totalTestFiles++;
    let fileHasPassed = true;

    testFileTimer.start();
    const logIndex = this._logUpdate.append(`${TAG_PENDING()}  ${testFile.path}`);

    for (const group of testFile.groups) {
      if (!(await this.executeGroup(group, semiReport))) {
        fileHasPassed = false;
      }
    }

    const _diff = testFileTimer.stop();

    let fileLabel = TAG_PASS();
    let fileNameLabel = testFile.path;

    if (!fileHasPassed) {
      fileLabel = TAG_FAIL();
      fileNameLabel = chalk.red(fileNameLabel);
    }

    this._logUpdate.updateLine(
      logIndex,
      `${fileLabel}  ${fileNameLabel}   ${chalk.cyan(_diff[0])}`,
    );

    this._logUpdate.persist();

    return fileHasPassed;
  }

  private async executeGroup(group: IGroup, semiReport: ISemiRunnerReport) {
    const tests = this.getAssertionPropsFromGroup(group);
    let fileHasPassed = true;
    for (const test of tests) {
      if (!(await this.executeTest(test, semiReport, group.name))) {
        fileHasPassed = false;
      }
    }
    return fileHasPassed;
  }

  private async executeTest(
    test: ITest,
    semiReport: ISemiRunnerReport,
    groupName?: string | number | boolean,
  ) {
    const testTimer = new Timer();
    let fileHasPassed = true;
    testTimer.start();
    let logPosition = 0;

    const testText = this.createTestText(test.name);
    logPosition = this._logUpdate.appendLine(testText);

    const reports = await this.runTest(test);

    if (reports.length === 0) {
      semiReport.totalEmptyTests++;
      semiReport.totalTests++;
    }

    const testDiff = testTimer.stop();

    const testNameLabel = this.ITestReportLabelFunction(reports);

    const formatedGroupName = !stringIsNullOrEmpty(groupName) ? groupName + " -> " : "";

    if (stringIsNullOrEmpty(test.name)) {
      this._logUpdate.updateLine(
        logPosition,
        `${MESSAGE_TAB_SPACE}${testNameLabel(
          formatedGroupName + "<empty test name>",
        )}   ${chalk.cyan(testDiff[0])}`,
      );
    } else {
      this._logUpdate.updateLine(
        logPosition,
        `${MESSAGE_TAB_SPACE}${testNameLabel(formatedGroupName + test.name)}   ${chalk.cyan(
          testDiff[0],
        )}`,
      );
    }

    if (!this.printTestsReportAndUpdateRunnerReport(reports, semiReport)) {
      fileHasPassed = false;
    }

    test.testsReports = reports;
    return fileHasPassed;
  }

  private printTestsReportAndUpdateRunnerReport(
    reports: ITestReport[],
    semiReport: ISemiRunnerReport,
  ) {
    let fileHasPassed = true;
    for (const report of reports) {
      semiReport.totalTests++;
      if (!this.printReportAndUpdateRunnerReport(report, semiReport)) {
        fileHasPassed = false;
      }
    }
    return fileHasPassed;
  }

  private ITestReportLabelFunction(reports: ITestReport[]) {
    if (reports.length === 0) {
      return (text: string) => TEXT_EMPTY(" " + DOT + " " + text + " (empty)");
    }

    if (reports.some((report) => !report.pass)) {
      return (text: string) => TEXT_FAIL(TEST_FAIL_ICON + " " + text);
    }
    return (text: string) => TEXT_PASS(TEST_PASSED_ICON + " " + text);
  }

  private printReportAndUpdateRunnerReport(report: ITestReport, semiReport: ISemiRunnerReport) {
    if (report.pass) {
      semiReport.totalTestsPassed++;
      return true;
    }

    semiReport.totalTestsFailed++;
    this.printReportData(report);

    return false;
  }

  private printReportData(report: ITestReport) {
    if (report.message) {
      this._logUpdate.appendLine(report.message);
    }

    if (!report.pass && report.trace) {
      this._logUpdate.appendLine(report.trace);
    }
  }

  private createTestText(testName?: string | number | boolean) {
    if (stringIsNullOrEmpty(testName)) {
      return this.createTestTextByStatus("<empty test name>");
    }
    return this.createTestTextByStatus(testName);
  }

  private createTestTextByStatus(testName?: string | number | boolean) {
    const icon = DOT;
    return `${MESSAGE_TAB_SPACE}${icon} ${testName}`;
  }

  async runTest(test: ITest) {
    const reports: ITestReport[] = [];

    // before e after hooks will run just one time
    // for test structure (if the hook fail)
    let keepRunningBeforeEachFunctions = true;
    let keepRunningAfterEachFunctions = true;

    for (const testfn of test.testsFunctions) {
      keepRunningBeforeEachFunctions = await this.executeHookFunctionIfPossible(
        keepRunningBeforeEachFunctions,
        testCollector.beforeEachFunctions,
      );

      let _report: ITestReport;
      try {
        _report = await runtime.injectBot(testfn);
      } catch (error) {
        _report = {
          testName: "",
          pass: false,
          message: this.getErrorMessage(error),
        };
      }

      keepRunningAfterEachFunctions = await this.executeHookFunctionIfPossible(
        keepRunningAfterEachFunctions,
        testCollector.afterEachFunctions,
      );

      reports.push(_report);
    }

    return reports;
  }

  private async executeHookFunctionIfPossible(
    keepRunning: boolean,
    queues: Queue<VoidLikeFunction>,
  ) {
    if (keepRunning) {
      const _functionErrors = await queues.executeWithCatchCollectAsync();
      if (_functionErrors && _functionErrors.length) {
        printHookErrors(_functionErrors);
        return false;
      }
      return true;
    }
    return false;
  }

  private getErrorMessage(error: any) {
    if (error instanceof Error) {
      return error.message;
    }

    return formatObject(error);
  }

  private getAssertionPropsFromGroup(group: IGroup) {
    const assertions: ITest[] = [];
    if (group.tests) {
      group.tests.forEach((test) => {
        assertions.push(...this.getAssertionsPropsFromTest(test));
      });
    }

    if (group.subGroups) {
      group.subGroups.forEach((subGroup) => {
        const subGroupTests = this.getAssertionPropsFromGroup(subGroup);
        assertions.push(...subGroupTests);
      });
    }

    return assertions;
  }

  private getAssertionsPropsFromTest(test: ITest) {
    const tests: ITest[] = [test];

    if (test.subTests) {
      test.subTests.forEach((subtest) => {
        tests.push(...this.getAssertionsPropsFromTest(subtest));
      });
    }

    return tests;
  }
}
