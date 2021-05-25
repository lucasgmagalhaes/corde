import MockDiscord from "../../mocks/mockDiscord";
import { createReport, initCordeClientWithChannel, testUtils } from "../../testHelper";
import { Client } from "discord.js";
import { ToAddReaction } from "../../../src/expect/matches";
import { ICordeBot, ITestReport } from "../../../src/types";
import { buildReportMessage, typeOf } from "../../../src/utils";
import { MockEvents } from "../../mocks/mockEvents";
import { runtime } from "../../../src/environment";

describe("testing toAddReaction function", () => {
  let mockDiscord = new MockDiscord();
  afterEach(() => {
    mockDiscord = new MockDiscord();
  });

  function initTestClass(cordeBot: ICordeBot, commandName?: string, isNot?: boolean) {
    return testUtils.initTestClass(ToAddReaction, {
      command: commandName,
      cordeBot: cordeBot,
      isNot: isNot,
    });
  }

  it("should fail due to invalid messageIdentifier (number)", async () => {
    const cordeClient = initCordeClientWithChannel(mockDiscord, new Client(), 1000);
    const toAddReaction = initTestClass(cordeClient, "add", false);
    // @ts-ignore
    const report = await toAddReaction.action(["1"], 1);

    const message = buildReportMessage(
      `expect: message data to be null, undefined, string or an object with id or text properties\n`,
      `received: ${typeOf(1)}`,
    );

    const expectedReport = createReport(toAddReaction, false, message);

    expect(report).toEqual(expectedReport);
    expect(report).toMatchSnapshot();
  });

  it("should fail due to invalid emoji (undefined)", async () => {
    const cordeClient = initCordeClientWithChannel(mockDiscord, new Client(), 1000);
    const toAddReaction = initTestClass(cordeClient, "add", false);
    // @ts-ignore
    const report = await toAddReaction.action(undefined);

    const message = buildReportMessage(
      `expected: emojis parameter to be an array with string or objects\n`,
      `received: ${typeOf(undefined)}`,
    );

    const expectedReport = createReport(toAddReaction, false, message);

    expect(report).toEqual(expectedReport);
    expect(report).toMatchSnapshot();
  });

  it("should fail due to invalid emoji (null)", async () => {
    const cordeClient = initCordeClientWithChannel(mockDiscord, new Client(), 1000);
    const toAddReaction = initTestClass(cordeClient, "add", false);
    // @ts-ignore
    const report = await toAddReaction.action(null);

    const message = buildReportMessage(
      `expected: emojis parameter to be an array with string or objects\n`,
      `received: ${typeOf(null)}`,
    );

    const expectedReport = createReport(toAddReaction, false, message);

    expect(report).toEqual(expectedReport);
    expect(report).toMatchSnapshot();
  });

  it("should fail due to invalid emoji (object)", async () => {
    const cordeClient = initCordeClientWithChannel(mockDiscord, new Client(), 1000);
    const toAddReaction = initTestClass(cordeClient, "add", false);
    // @ts-ignore
    const report = await toAddReaction.action({});

    const message = buildReportMessage(
      `expected: emojis parameter to be an array with string or objects\n`,
      `received: ${typeOf({})}`,
    );

    const expectedReport = createReport(toAddReaction, false, message);

    expect(report).toEqual(expectedReport);
    expect(report).toMatchSnapshot();
  });

  it("should return a passed test with isNot = false", async () => {
    const cordeClient = initCordeClientWithChannel(mockDiscord, new Client(), 1000);
    const events = new MockEvents(cordeClient, mockDiscord);
    events.mockOnceMessageReactionsAdd();

    cordeClient.sendTextMessage = jest.fn().mockReturnValue(mockDiscord.message);
    const toAddReaction = initTestClass(cordeClient, "add", false);

    const reportModel = createReport(toAddReaction, true);

    const report = await toAddReaction.action([mockDiscord.messageReaction.emoji.name]);
    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should return a passed test with isNot = true", async () => {
    runtime.setConfigs({ timeout: 10 }, true);
    const cordeClient = initCordeClientWithChannel(mockDiscord, new Client(), 1000);
    cordeClient.sendTextMessage = jest.fn().mockReturnValue(mockDiscord.message);
    const toAddReaction = initTestClass(cordeClient, "add", true);

    const reportModel = createReport(toAddReaction, true);

    const report = await toAddReaction.action([mockDiscord.messageReaction.emoji.name]);
    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should return a failed test with isNot = false", async () => {
    runtime.setConfigs({ timeout: 10 }, true);
    const cordeClient = initCordeClientWithChannel(mockDiscord, new Client(), 1000);
    cordeClient.sendTextMessage = jest.fn().mockReturnValue(mockDiscord.message);
    const toAddReaction = initTestClass(cordeClient, "add", false);

    const message = buildReportMessage(
      `expected: to add reactions ${[mockDiscord.messageReaction.emoji.name].join(", ")}\n`,
      `received: no reaction was added to message`,
    );

    const reportModel = createReport(toAddReaction, false, message);

    const report = await toAddReaction.action([mockDiscord.messageReaction.emoji.name]);
    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should return a failed test with isNot = false and timeout", async () => {
    runtime.setConfigs({ timeout: 10 });
    const cordeClient = initCordeClientWithChannel(mockDiscord, new Client(), 1000);
    cordeClient.sendTextMessage = jest.fn().mockReturnValue(mockDiscord.message);
    const events = new MockEvents(cordeClient, mockDiscord);
    events.mockOnceMessageReactionsAddToReject();
    const toAddReaction = initTestClass(cordeClient, "add", false);

    const message = buildReportMessage(
      `expected: to add reactions ${[mockDiscord.messageReaction.emoji.name].join(", ")}\n`,
      `received: ${[mockDiscord.messageReaction.emoji.name].join(", ")}`,
    );

    const reportModel = createReport(toAddReaction, false, message);

    const report = await toAddReaction.action([mockDiscord.messageReaction.emoji.name]);
    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should return a passed test with isNot = false", async () => {
    runtime.setConfigs({ timeout: 10 });
    const cordeClient = initCordeClientWithChannel(mockDiscord, new Client(), 1000);
    cordeClient.sendTextMessage = jest.fn().mockReturnValue(mockDiscord.message);
    const events = new MockEvents(cordeClient, mockDiscord);
    events.mockOnceMessageReactionsAdd();
    const toAddReaction = initTestClass(cordeClient, "add", false);

    const reportModel = createReport(toAddReaction, true);

    const report = await toAddReaction.action([mockDiscord.messageReaction.emoji.name]);
    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should return a failed test with isNot = true", async () => {
    runtime.setConfigs({ timeout: 10 });
    const cordeClient = initCordeClientWithChannel(mockDiscord, new Client(), 1000);
    cordeClient.sendTextMessage = jest.fn().mockReturnValue(mockDiscord.message);
    const events = new MockEvents(cordeClient, mockDiscord);
    events.mockOnceMessageReactionsAdd();
    const toAddReaction = initTestClass(cordeClient, "add", true);

    const message = buildReportMessage(
      `expected: not to add reactions ${[mockDiscord.messageReaction.emoji.name].join(", ")}\n`,
      `received: ${[mockDiscord.messageReaction.emoji.name].join(", ")}`,
    );

    const reportModel = createReport(toAddReaction, false, message);

    const report = await toAddReaction.action([mockDiscord.messageReaction.emoji.name]);
    expect(report).toEqual(reportModel);
    expect(report).toMatchSnapshot();
  });

  it("should return a failed test with isNot = false and emoji object with id and other with name", async () => {
    runtime.setConfigs({ timeout: 10 });
    const cordeClient = initCordeClientWithChannel(mockDiscord, new Client(), 1000);
    cordeClient.sendTextMessage = jest.fn().mockReturnValue(mockDiscord.message);
    const events = new MockEvents(cordeClient, mockDiscord);
    events.mockOnceMessageReactionsRemove();
    const toAddReaction = initTestClass(cordeClient, "add", false);

    const message = buildReportMessage(
      `expected: to add reactions ${[
        mockDiscord.messageReaction.emoji.id,
        mockDiscord.messageReaction.emoji.name,
      ].join(", ")}\n`,
      `received: no reaction was added to message`,
    );

    const reportModel = createReport(toAddReaction, false, message);

    const report = await toAddReaction.action([
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

    const toAddReaction = initTestClass(corde, "");
    const report = await toAddReaction.action(["😃"], { id: "123" });

    const expectReport = createReport(toAddReaction, false, buildReportMessage(erroMessage));

    expect(report).toEqual(expectReport);
    expect(report).toMatchSnapshot();
  });
});
