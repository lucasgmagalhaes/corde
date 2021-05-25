import MockDiscord from "../../mocks/mockDiscord";
import { initCordeClientWithChannel, testUtils } from "../../testHelper";
import { Client } from "discord.js";
import { ToRemoveReaction } from "../../../src/expect/matches";
import { ICordeBot, ITestReport } from "../../../src/types";
import { buildReportMessage, typeOf } from "../../../src/utils";
import { MockEvents } from "../../mocks/mockEvents";
import { runtime } from "../../../src/environment";

describe("testing toRemoveReaction function", () => {
  let mockDiscord = new MockDiscord();
  afterEach(() => {
    mockDiscord = new MockDiscord();
  });

  function initTestClass(cordeBot: ICordeBot, isNot: boolean) {
    return testUtils.initTestClass(ToRemoveReaction, {
      command: "",
      isCascade: false,
      cordeBot: cordeBot,
      isNot: isNot,
    });
  }

  it("should fail due to invalid messageIdentifier (number)", async () => {
    const cordeClient = initCordeClientWithChannel(mockDiscord, new Client(), 1000);
    const toRemoveReaction = initTestClass(cordeClient, false);
    // @ts-ignore
    const report = await toRemoveReaction.action(["1"], 1);

    const expectedReport: ITestReport = {
      pass: false,
      testName: toRemoveReaction.toString(),
      message: buildReportMessage(
        `expect: message data to be null, undefined, string or an object with id or text properties\n`,
        `received: ${typeOf(1)}`,
      ),
    };

    expect(report).toEqual(expectedReport);
    expect(report).toMatchSnapshot();
  });

  it("should fail due to invalid emoji (undefined)", async () => {
    const cordeClient = initCordeClientWithChannel(mockDiscord, new Client(), 1000);
    const toRemoveReaction = initTestClass(cordeClient, false);
    // @ts-ignore
    const report = await toRemoveReaction.action(undefined);

    const expectedReport: ITestReport = {
      pass: false,
      testName: toRemoveReaction.toString(),
      message: buildReportMessage(
        `expected: emojis parameter to be an array with string or objects\n`,
        `received: ${typeOf(undefined)}`,
      ),
    };

    expect(report).toEqual(expectedReport);
    expect(report).toMatchSnapshot();
  });

  it("should fail due to invalid emoji (null)", async () => {
    const cordeClient = initCordeClientWithChannel(mockDiscord, new Client(), 1000);
    const toRemoveReaction = initTestClass(cordeClient, false);
    // @ts-ignore
    const report = await toRemoveReaction.action(null);

    const expectedReport: ITestReport = {
      pass: false,
      testName: toRemoveReaction.toString(),
      message: buildReportMessage(
        `expected: emojis parameter to be an array with string or objects\n`,
        `received: ${typeOf(null)}`,
      ),
    };

    expect(report).toEqual(expectedReport);
    expect(report).toMatchSnapshot();
  });

  it("should fail due to invalid emoji (object)", async () => {
    const cordeClient = initCordeClientWithChannel(mockDiscord, new Client(), 1000);
    const toRemoveReaction = initTestClass(cordeClient, false);
    // @ts-ignore
    const report = await toRemoveReaction.action({});

    const expectedReport: ITestReport = {
      pass: false,
      testName: toRemoveReaction.toString(),
      message: buildReportMessage(
        `expected: emojis parameter to be an array with string or objects\n`,
        `received: ${typeOf({})}`,
      ),
    };

    expect(report).toEqual(expectedReport);
    expect(report).toMatchSnapshot();
  });

  it("should return a passed test with isNot = false", async () => {
    const cordeClient = initCordeClientWithChannel(mockDiscord, new Client(), 1000);
    const events = new MockEvents(cordeClient, mockDiscord);
    events.mockOnceMessageReactionsRemove();

    cordeClient.sendTextMessage = jest.fn().mockReturnValue(mockDiscord.message);
    const toRemoveReaction = initTestClass(cordeClient, false);

    const reportModel: ITestReport = {
      pass: true,
      testName: toRemoveReaction.toString(),
    };

    const report = await toRemoveReaction.action([mockDiscord.messageReaction.emoji.name]);
    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should return a passed test with isNot = true", async () => {
    runtime.setConfigs({ timeout: 10 }, true);
    const cordeClient = initCordeClientWithChannel(mockDiscord, new Client(), 1000);
    cordeClient.sendTextMessage = jest.fn().mockReturnValue(mockDiscord.message);
    const toRemoveReaction = initTestClass(cordeClient, true);

    const reportModel: ITestReport = {
      pass: true,
      testName: toRemoveReaction.toString(),
    };

    const report = await toRemoveReaction.action([mockDiscord.messageReaction.emoji.name]);
    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should return a failed test with isNot = false", async () => {
    runtime.setConfigs({ timeout: 10 }, true);
    const cordeClient = initCordeClientWithChannel(mockDiscord, new Client(), 1000);
    cordeClient.sendTextMessage = jest.fn().mockReturnValue(mockDiscord.message);
    const toRemoveReaction = initTestClass(cordeClient, false);

    const reportModel: ITestReport = {
      pass: false,
      testName: toRemoveReaction.toString(),
      message: buildReportMessage(
        `expected: to remove reactions ${[mockDiscord.messageReaction.emoji.name].join(", ")}\n`,
        `received: no reaction was removed to message`,
      ),
    };

    const report = await toRemoveReaction.action([mockDiscord.messageReaction.emoji.name]);
    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should return a failed test with isNot = false and timeout", async () => {
    runtime.setConfigs({ timeout: 10 });
    const cordeClient = initCordeClientWithChannel(mockDiscord, new Client(), 1000);
    cordeClient.sendTextMessage = jest.fn().mockReturnValue(mockDiscord.message);
    const events = new MockEvents(cordeClient, mockDiscord);
    events.mockOnceMessageReactionsRemoveToReject();
    const toRemoveReaction = initTestClass(cordeClient, false);

    const reportModel: ITestReport = {
      pass: false,
      testName: toRemoveReaction.toString(),
      message: buildReportMessage(
        `expected: to remove reactions ${[mockDiscord.messageReaction.emoji.name].join(", ")}\n`,
        `received: ${[mockDiscord.messageReaction.emoji.name].join(", ")}`,
      ),
    };

    const report = await toRemoveReaction.action([mockDiscord.messageReaction.emoji.name]);
    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should return a passed test with isNot = false", async () => {
    runtime.setConfigs({ timeout: 10 });
    const cordeClient = initCordeClientWithChannel(mockDiscord, new Client(), 1000);
    cordeClient.sendTextMessage = jest.fn().mockReturnValue(mockDiscord.message);
    const events = new MockEvents(cordeClient, mockDiscord);
    events.mockOnceMessageReactionsRemove();
    const toRemoveReaction = initTestClass(cordeClient, false);

    const reportModel: ITestReport = {
      pass: true,
      testName: toRemoveReaction.toString(),
    };

    const report = await toRemoveReaction.action([mockDiscord.messageReaction.emoji.name]);
    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should return a failed test with isNot = true and emoji object with id and other with name", async () => {
    runtime.setConfigs({ timeout: 10 });
    const cordeClient = initCordeClientWithChannel(mockDiscord, new Client(), 1000);
    cordeClient.sendTextMessage = jest.fn().mockReturnValue(mockDiscord.message);
    const events = new MockEvents(cordeClient, mockDiscord);
    events.mockOnceMessageReactionsRemove();
    const toRemoveReaction = initTestClass(cordeClient, true);

    const reportModel: ITestReport = {
      pass: false,
      testName: toRemoveReaction.toString(),
      message: buildReportMessage(
        `expected: not to remove reactions ${[
          mockDiscord.messageReaction.emoji.id,
          mockDiscord.messageReaction.emoji.name,
        ].join(", ")}\n`,
        `received: ${[mockDiscord.messageReaction.emoji.name].join(", ")}`,
      ),
    };

    const report = await toRemoveReaction.action([
      { id: mockDiscord.messageReaction.emoji.id },
      { name: mockDiscord.messageReaction.emoji.name },
    ]);

    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should return a failed test due to failure in message sending", async () => {
    const corde = initCordeClientWithChannel(mockDiscord, new Client());
    corde.getRoles = jest.fn().mockReturnValue(mockDiscord.roleManager.cache);
    corde.findRole = jest.fn().mockReturnValue(mockDiscord.role);

    const erroMessage = "can not send message to channel x";
    corde.sendTextMessage = jest
      .fn()
      .mockImplementation(() => Promise.reject(new Error(erroMessage)));

    const toRemoveReaction = initTestClass(corde, false);
    const report = await toRemoveReaction.action(["😀"], { id: "123" });

    const reportModel: ITestReport = {
      pass: false,
      message: buildReportMessage(erroMessage),
      testName: toRemoveReaction.toString(),
    };

    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });
});
