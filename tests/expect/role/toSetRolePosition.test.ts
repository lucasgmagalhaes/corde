import { Client } from "discord.js";
import { runtime } from "../../../src/environment";
import { ToSetRolePosition } from "../../../src/expect/matches";
import { ICordeBot, ITestReport } from "../../../src/types";
import { buildReportMessage, typeOf } from "../../../src/utils";
import MockDiscord from "../../mocks/mockDiscord";
import { MockEvents } from "../../mocks/mockEvents";
import { createReport, initCordeClientWithChannel, testUtils } from "../../testHelper";

let mockDiscord = new MockDiscord();

function initClient() {
  const corde = initCordeClientWithChannel(mockDiscord, new Client());
  corde.findRole = jest.fn().mockReturnValue(mockDiscord.role);
  corde.fetchRole = jest.fn().mockReturnValue(mockDiscord.role);
  corde.sendTextMessage = jest.fn().mockImplementation(() => {});
  runtime.setConfigs({ timeout: 100 }, true);
  return corde;
}

function initTestClass(cordeBot: ICordeBot, isNot: boolean) {
  return testUtils.initTestClass(ToSetRolePosition, {
    command: "toDelete",
    cordeBot: cordeBot,
    isCascade: false,
    isNot: isNot,
  });
}

/**
 * I can not figure out how to mock position of roles.
 * They come as -1 '-'. So I in tests I'm gonna test with -2.
 */
describe("testing ToSetRolePosition operation", () => {
  afterEach(() => {
    mockDiscord = new MockDiscord();
  });

  it("should fail due to undefined roleIdentifier", async () => {
    const corde = initClient();
    const toSetRolePosition = initTestClass(corde, false);
    const report = await toSetRolePosition.action(1, null);

    const message = buildReportMessage(
      "expected: data to identifier the role (id or name)\n",
      `received: null`,
    );

    const expectReport = createReport(toSetRolePosition, false, message);

    expect(report).toEqual(expectReport);
    expect(report).toMatchSnapshot();
  });

  it("should fail due to newPosition is not a number", async () => {
    const corde = initClient();
    const toSetRolePosition = initTestClass(corde, false);
    // @ts-ignore
    const report = await toSetRolePosition.action("batata", { id: "1231231" });

    const message = buildReportMessage(
      `expected: position option to be a number\n`,
      `received: ${typeOf("batata")}`,
    );

    const expectReport = createReport(toSetRolePosition, false, message);

    expect(report).toEqual(expectReport);
    expect(report).toMatchSnapshot();
  });

  it("should find and must return passed report due to 'changed position' (isNot false)", async () => {
    const corde = createCordeBotWithMockedFunctions();
    const mockEvent = new MockEvents(corde, mockDiscord);
    mockEvent.mockOnceRolePositionUpdate();
    const toSetPosition = initTestClass(corde, false);
    const report = await toSetPosition.action(-1, { id: "123" });

    const matchReport = createReport(toSetPosition, true);

    expect(report).toEqual(matchReport);
  });

  it("should find and must return passed report due to 'changed position' (isNot true)", async () => {
    const corde = createCordeBotWithMockedFunctions();
    const mockEvent = new MockEvents(corde, mockDiscord);
    mockEvent.mockOnceRolePositionUpdate();

    const toSetPosition = initTestClass(corde, true);
    const report = await toSetPosition.action(-2, { id: "123" });
    const matchReport = createReport(toSetPosition, true);

    expect(report).toEqual(matchReport);
    expect(report).toMatchSnapshot();
  });

  it("should not find a role and must return not passed (isNot true)", async () => {
    const corde = createCordeBotWithMockedFunctions(null);

    const toSetPosition = initTestClass(corde, true);
    const report = await toSetPosition.action(1, { id: "123" });

    const message = buildReportMessage(`expected: role with id 123\n`, `received: null`);

    const matchReport = createReport(toSetPosition, false, message);
    expect(report).toEqual(matchReport);
    expect(report).toMatchSnapshot();
  });

  it("should not find a role and must return not passed (isNot false)", async () => {
    const corde = createCordeBotWithMockedFunctions(null);
    const toSetPosition = initTestClass(corde, false);
    const report = await toSetPosition.action(2, { id: "123" });

    const message = buildReportMessage(`expected: role with id 123\n`, `received: null`);

    const matchReport = createReport(toSetPosition, false, message);

    expect(report).toEqual(matchReport);
    expect(report).toMatchSnapshot();
  });

  it("should return a not passed test due to new position be higher than the permitted (isNot false)", async () => {
    const corde = createCordeBotWithMockedFunctions();
    const toSetPosition = initTestClass(corde, false);
    const report = await toSetPosition.action(2, { id: "123" });

    const message = buildReportMessage(
      `expected: position to be >= 0 and <= 1 (max value possible)\n`,
      `received: 2`,
    );

    const matchReport = createReport(toSetPosition, false, message);

    expect(report).toEqual(matchReport);
    expect(report).toMatchSnapshot();
  });

  it("should not find a role and return a failed report", async () => {
    const corde = createCordeBotWithMockedFunctions();

    corde.findRole = jest.fn().mockImplementation(null);
    const toSetPosition = initTestClass(corde, false);
    const report = await toSetPosition.action(1, { id: "123" });

    const message = buildReportMessage(`expected: role with id 123\n`, `received: null`);

    const matchReport = createReport(toSetPosition, false, message);

    expect(report).toEqual(matchReport);
    expect(report).toMatchSnapshot();
  });

  it("should return a passed report due to timeout and isNot true", async () => {
    const corde = createCordeBotWithMockedFunctions();

    runtime.setConfigs({ timeout: 10 }, true);
    corde.findRole = jest.fn().mockReturnValue(mockDiscord.role);
    const toSetPosition = initTestClass(corde, true);
    const report = await toSetPosition.action(-2, { id: "123" });

    const matchReport = createReport(toSetPosition, true);
    expect(report).toEqual(matchReport);
    expect(report).toMatchSnapshot();
  });

  it("should return a failed report due to timeout and isNot false", async () => {
    const corde = createCordeBotWithMockedFunctions();

    runtime.setConfigs({ timeout: 10 }, true);
    corde.findRole = jest.fn().mockReturnValue(mockDiscord.role);
    const toSetPosition = initTestClass(corde, false);
    const report = await toSetPosition.action(-2, { id: "123" });

    const message = buildReportMessage(
      `expected: role position to change to ${-2}\n`,
      `received: position didn't change`,
    );

    const matchReport = createReport(toSetPosition, false, message);

    expect(report).toEqual(matchReport);
    expect(report).toMatchSnapshot();
  });

  it("should return a failed report position setted was different than expected", async () => {
    const corde = createCordeBotWithMockedFunctions();

    runtime.setConfigs({ timeout: 10 }, true);
    corde.findRole = jest.fn().mockReturnValue(mockDiscord.role);

    const mockEvent = new MockEvents(corde, mockDiscord);
    mockEvent.mockOnceRolePositionUpdate();
    const toSetPosition = initTestClass(corde, false);
    const report = await toSetPosition.action(-2, { id: "123" });

    const message = buildReportMessage(
      `expected: role position to change to ${-2}\n`,
      `received: 1`,
    );

    const matchReport = createReport(toSetPosition, false, message);

    expect(report).toEqual(matchReport);
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

    const toSetPosition = initTestClass(corde, false);
    const report = await toSetPosition.action(-1, { id: "123" });

    const expectReport = createReport(toSetPosition, false, buildReportMessage(erroMessage));

    expect(report).toEqual(expectReport);
    expect(report).toMatchSnapshot();
  });
});

function createCordeBotWithMockedFunctions(findRoleMock: any = mockDiscord.role) {
  const corde = initCordeClientWithChannel(mockDiscord, new Client());
  corde.getRoles = jest.fn().mockReturnValue(mockDiscord.roleManager.cache);
  corde.findRole = jest.fn().mockReturnValue(findRoleMock);
  corde.sendTextMessage = jest.fn().mockImplementation(() => {});
  return corde;
}
