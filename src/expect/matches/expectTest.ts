import { ICordeBot, IExpectTestParams, ITestReport } from "../../types";
import { buildReportMessage } from "../../utils";

/**
 * Entity helper for expectation assertions used for Corde tests
 *
 * @description Have 3 generic parameters that serves to define
 * what are the data that the test function will receive.
 *
 * These data will be used in action() command, witch will be implemented
 * by the inherited class.
 *
 */
export abstract class ExpectTest {
  protected expectation: any;
  protected hasPassed: boolean;

  protected readonly isNot: boolean;
  protected readonly command: string | number | boolean;
  protected readonly cordeBot: ICordeBot;
  protected readonly timeout: number;
  protected readonly testName: string;
  protected readonly isCascade: boolean;
  protected readonly guildId: string | undefined;
  protected readonly channelIdToSendCommand?: string;
  protected readonly channelId: string;

  /**
   * Initialize the match class with its default values.
   *
   * @param cordeBot The instance of CordeBot initialized by the runtime.
   * @param command The command to execute.
   * @param isNot Definition if this is a deny test.
   */
  constructor({
    isNot,
    command,
    cordeBot,
    timeout,
    testName,
    isCascade,
    guildId,
    channelId,
    channelIdToSendCommand,
  }: IExpectTestParams) {
    this.isNot = isNot;
    this.command = command;
    this.cordeBot = cordeBot;
    this.hasPassed = false;
    this.timeout = timeout;
    this.testName = testName;
    this.isCascade = isCascade ?? false;
    this.guildId = guildId;
    this.channelIdToSendCommand = channelIdToSendCommand;
    this.channelId = channelId;
  }

  /**
   * Execute the test, checking if a command did what was proposed to do.
   *
   * @returns A report of the executed command.
   */
  abstract action(...args: any[]): Promise<ITestReport>;

  protected invertHasPassedIfIsNot() {
    if (this.isNot) {
      this.hasPassed = !this.hasPassed;
    }
  }

  /**
   * Encapsulation of cordeBot.sendTextMessage
   * Sends `command` as message
   *
   * @param forceSend Defines if the message should be send even if the test if
   * is cascade (this is offen used only by the TodoInCascade test).
   *
   * @returns Message sent
   */
  protected sendCommandMessage(forceSend?: boolean) {
    // Tests in cascade controus when the message should be sent.
    if (!this.isCascade || forceSend) {
      return this.cordeBot.sendTextMessage(this.command, this.channelIdToSendCommand);
    }
    return Promise.resolve();
  }

  protected createFailedTest(...messages: (string | null | undefined)[]): ITestReport {
    const report = this.createReport(...messages);
    report.pass = false;
    return report;
  }

  protected createPassTest(): ITestReport {
    return {
      pass: true,
      testName: this.testName,
    };
  }
  protected createReport(...messages: (string | null | undefined)[]): ITestReport {
    let message = "";
    if (messages.length) {
      message = buildReportMessage(...messages);
    }

    return {
      testName: this.testName,
      pass: this.hasPassed,
      message,
    };
  }

  toString() {
    return this.testName ?? "ExpectTest";
  }
}
