import { Client } from "discord.js";
import MockDiscord from "../../mocks/mockDiscord";
import { createCordeBotWithMockedFunctions, testUtils } from "../../testHelper";
import { MockEvents } from "../../mocks/mockEvents";
import { ICordeBot, ITestReport } from "../../../src/types";
import { ToReturn } from "../../../src/expect/matches";
import { buildReportMessage, diff, formatObject } from "../../../src/utils";
import { runtime } from "../../../src/environment";

let mockDiscord = new MockDiscord();

describe("testing toReturn", () => {
  afterEach(() => {
    mockDiscord = new MockDiscord();
  });

  function initTestClass(cordeBot: ICordeBot, isNot: boolean) {
    return testUtils.initTestClass(ToReturn, {
      isCascade: false,
      command: "toReturn",
      cordeBot: cordeBot,
      isNot: isNot,
    });
  }

  it("should return a failed test due to invalid parameter (null)", async () => {
    const cordeClient = createCordeBotWithMockedFunctions(mockDiscord, new Client());

    const message = buildReportMessage(
      `expected: expect value to be a primitive value (string, boolean, number) or an IMessageEmbed\n`,
      `received: null`,
    );

    const toReturn = initTestClass(cordeClient, false);

    const reportModel: ITestReport = {
      pass: false,
      testName: toReturn.toString(),
      message,
    };

    const report = await toReturn.action(null);
    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should return a failed test due to invalid parameter (undefined)", async () => {
    const cordeClient = createCordeBotWithMockedFunctions(mockDiscord, new Client());

    const message = buildReportMessage(
      `expected: expect value to be a primitive value (string, boolean, number) or an IMessageEmbed\n`,
      `received: undefined`,
    );

    const toReturn = initTestClass(cordeClient, false);

    const reportModel: ITestReport = {
      pass: false,
      testName: toReturn.toString(),
      message,
    };

    const report = await toReturn.action(undefined);
    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should fail due to no message was sent by the bot", async () => {
    runtime.setConfigs({ timeout: 100 }, true);
    const cordeClient = createCordeBotWithMockedFunctions(mockDiscord, new Client());

    const message = buildReportMessage(
      `expected: testing bot to send a message\n`,
      `received: no message was sent`,
    );

    const toReturn = initTestClass(cordeClient, false);

    const reportModel: ITestReport = {
      pass: false,
      testName: toReturn.toString(),
      message,
    };

    const report = await toReturn.action("pong");
    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should get success test due to timeout but isNot = true", async () => {
    runtime.setConfigs({ timeout: 100 }, true);
    const cordeClient = createCordeBotWithMockedFunctions(mockDiscord, new Client());

    const toReturn = initTestClass(cordeClient, true);

    const reportModel: ITestReport = {
      pass: true,
      testName: toReturn.toString(),
    };

    const report = await toReturn.action("pong");
    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should get success test due to bot returned equal message", async () => {
    runtime.setConfigs({ timeout: 100 }, true);
    const cordeClient = createCordeBotWithMockedFunctions(mockDiscord, new Client());

    const events = new MockEvents(cordeClient, mockDiscord);
    events.mockOnceMessage();

    const toReturn = initTestClass(cordeClient, false);

    const reportModel: ITestReport = {
      pass: true,
      testName: toReturn.toString(),
    };

    const report = await toReturn.action(mockDiscord.message.content);

    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should get success test due to bot returned equal messages (string type)", async () => {
    runtime.setConfigs({ timeout: 100 }, true);
    const cordeClient = createCordeBotWithMockedFunctions(mockDiscord, new Client());

    const events = new MockEvents(cordeClient, mockDiscord);
    events.mockOnceMessage();

    const toReturn = initTestClass(cordeClient, false);

    const reportModel: ITestReport = {
      pass: true,
      testName: toReturn.toString(),
    };

    const report = await toReturn.action(mockDiscord.message.content);

    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should get success test due to bot returned equal messages (string number)", async () => {
    runtime.setConfigs({ timeout: 100 }, true);
    const cordeClient = createCordeBotWithMockedFunctions(mockDiscord, new Client());
    mockDiscord.message.content = "2";

    const events = new MockEvents(cordeClient, mockDiscord);
    events.mockOnceMessage();

    const toReturn = initTestClass(cordeClient, false);

    const reportModel: ITestReport = {
      pass: true,
      testName: toReturn.toString(),
    };

    const report = await toReturn.action(2);

    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should get success test due to bot returned equal messages (type embed)", async () => {
    runtime.setConfigs({ timeout: 100 }, true);
    const cordeClient = createCordeBotWithMockedFunctions(mockDiscord, new Client());

    const events = new MockEvents(cordeClient, mockDiscord);
    mockDiscord.message.embeds.push(mockDiscord.messageEmbed);
    events.mockOnceMessage(mockDiscord.message);

    const toReturn = initTestClass(cordeClient, false);

    const reportModel: ITestReport = {
      pass: true,
      testName: toReturn.toString(),
    };

    const report = await toReturn.action(mockDiscord.messageEmbedLike);

    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should get failed test due to bot returned equal messages (isNot true)", async () => {
    runtime.setConfigs({ timeout: 100 }, true);
    const cordeClient = createCordeBotWithMockedFunctions(mockDiscord, new Client());
    mockDiscord.message.embeds.push(mockDiscord.messageEmbed);

    const events = new MockEvents(cordeClient, mockDiscord);
    events.mockOnceMessage();

    const toReturn = initTestClass(cordeClient, true);

    const reportModel: ITestReport = {
      pass: false,
      testName: toReturn.toString(),
      message: buildReportMessage(
        `expected: message from bot be different from expectation\n`,
        `received: both returned and expectation are equal`,
      ),
    };

    const report = await toReturn.action(mockDiscord.messageEmbedLike);

    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should get success test due to bot returned different messages (isNot true)", async () => {
    runtime.setConfigs({ timeout: 100 }, true);
    const cordeClient = createCordeBotWithMockedFunctions(mockDiscord, new Client());

    const events = new MockEvents(cordeClient, mockDiscord);
    events.mockOnceMessage();

    const toReturn = initTestClass(cordeClient, true);

    const reportModel: ITestReport = {
      pass: true,
      testName: toReturn.toString(),
    };

    const report = await toReturn.action(mockDiscord.messageEmbedLike);

    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should get fail test due to bot returned different messages (both embed)", async () => {
    runtime.setConfigs({ timeout: 100 }, true);
    const cordeClient = createCordeBotWithMockedFunctions(mockDiscord, new Client());

    mockDiscord.message.embeds.push(mockDiscord.messageEmbed);

    const events = new MockEvents(cordeClient, mockDiscord);
    events.mockOnceMessage();

    const toReturn = initTestClass(cordeClient, false);

    const embedReturned = toReturn.getMessageByType(mockDiscord.message, "embed");
    const embedLike = {
      author: "ITest",
      fields: mockDiscord.messageEmbedLike.fields,
    };

    const embedExpect = toReturn.embedMessageLikeToMessageEmbed(embedLike);
    const embedExpectedMinified = toReturn.getMessageByType(embedExpect, "embed");

    const reportModel: ITestReport = {
      pass: false,
      testName: toReturn.toString(),
      message: buildReportMessage(diff(embedReturned, embedExpectedMinified)),
    };

    const report = await toReturn.action(embedLike);

    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should get fail test due to bot returned different messages (expect primitive and returned embed)", async () => {
    runtime.setConfigs({ timeout: 100 }, true);
    const cordeClient = createCordeBotWithMockedFunctions(mockDiscord, new Client());

    mockDiscord.message.embeds.push(mockDiscord.messageEmbed);

    const events = new MockEvents(cordeClient, mockDiscord);
    events.mockOnceMessage();

    const toReturn = initTestClass(cordeClient, false);

    const expectValue = "expect value";
    const embedReturned = toReturn.getMessageByType(mockDiscord.message, "embed");

    const reportModel: ITestReport = {
      pass: false,
      testName: toReturn.toString(),
      message: buildReportMessage(
        `expected: '${expectValue}'\n`,
        `received: ${formatObject(embedReturned)}`,
      ),
    };

    const report = await toReturn.action(expectValue);

    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should get fail test due to bot returned different messages (expect embed and returned primitive)", async () => {
    runtime.setConfigs({ timeout: 100 }, true);
    const cordeClient = createCordeBotWithMockedFunctions(mockDiscord, new Client());

    const events = new MockEvents(cordeClient, mockDiscord);
    events.mockOnceMessage();

    const toReturn = initTestClass(cordeClient, false);

    const embedExpect = toReturn.embedMessageLikeToMessageEmbed(mockDiscord.messageEmbedLike);

    const reportModel: ITestReport = {
      pass: false,
      testName: toReturn.toString(),
      message: buildReportMessage(
        `expected: ${formatObject(embedExpect)}\n`,
        `received: '${mockDiscord.message}'`,
      ),
    };

    const report = await toReturn.action(mockDiscord.messageEmbedLike);

    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should get fail test due to bot returned different messages both primitive values", async () => {
    runtime.setConfigs({ timeout: 100 }, true);
    const cordeClient = createCordeBotWithMockedFunctions(mockDiscord, new Client());

    const events = new MockEvents(cordeClient, mockDiscord);
    events.mockOnceMessage();

    const toReturn = initTestClass(cordeClient, false);
    const expectValue = "expect value";

    const reportModel: ITestReport = {
      pass: false,
      testName: toReturn.toString(),
      message: buildReportMessage(
        `expected: '${expectValue}'\n`,
        `received: '${mockDiscord.message.content}'`,
      ),
    };

    const report = await toReturn.action(expectValue);

    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should return a failed test due to failure in message sending", async () => {
    const corde = createCordeBotWithMockedFunctions(mockDiscord, new Client());
    corde.getRoles = jest.fn().mockReturnValue(mockDiscord.roleManager.cache);
    corde.findRole = jest.fn().mockReturnValue(mockDiscord.role);

    const erroMessage = "can not send message to channel x";
    corde.sendTextMessage = jest
      .fn()
      .mockImplementation(() => Promise.reject(new Error(erroMessage)));

    const toReturn = initTestClass(corde, false);
    const report = await toReturn.action("");

    const reportModel: ITestReport = {
      pass: false,
      message: buildReportMessage(erroMessage),
      testName: toReturn.toString(),
    };

    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });
});
