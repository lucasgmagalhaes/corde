import { Client } from "discord.js";
import { ToSetRoleMentionable } from "../../../src/expect/matches";
import MockDiscord from "../../mocks/mockDiscord";
import { createReport, initCordeClientWithChannel, testUtils } from "../../testHelper";
import { ICordeBot, ITestReport } from "../../../src/types";
import { buildReportMessage } from "../../../src/utils";
import { MockEvents } from "../../mocks/mockEvents";
import { runtime } from "../../../src/environment";

let mockDiscord = new MockDiscord();

function initClient() {
  const corde = initCordeClientWithChannel(mockDiscord, new Client());
  corde.findRole = jest.fn().mockReturnValue(mockDiscord.role);
  corde.fetchRole = jest.fn().mockReturnValue(mockDiscord.role);
  corde.sendTextMessage = jest.fn().mockImplementation(() => {});
  return corde;
}

function initTestClass(cordeBot: ICordeBot, isNot: boolean) {
  return testUtils.initTestClass(ToSetRoleMentionable, {
    command: "toDelete",
    cordeBot: cordeBot,
    isCascade: false,
    isNot: isNot,
  });
}

describe("testing toSetRoleMentionable operation", () => {
  afterEach(() => {
    mockDiscord = new MockDiscord();
  });

  it("should fail due to undefined roleIdentifier", async () => {
    const corde = initClient();
    const toSetRoleMentionable = initTestClass(corde, false);
    const report = await toSetRoleMentionable.action(true, undefined);

    const message = buildReportMessage(
      "expected: data to identifier the role (id or name)\n",
      `received: null`,
    );

    const expectReport = createReport(toSetRoleMentionable, false, message);

    expect(report).toEqual(expectReport);
    expect(report).toMatchSnapshot();
  });

  it("should return false due to invalid mentionable parameter (object)", async () => {
    const corde = initClient();
    const toSetRoleMentionable = initTestClass(corde, false);
    // @ts-ignore
    const report = await toSetRoleMentionable.action({}, { id: "123" });

    const message = buildReportMessage(
      `expected: mentionable parameter to be of boolean type\n`,
      `received: object`,
    );

    const expectReport = createReport(toSetRoleMentionable, false, message);

    expect(report).toEqual(expectReport);
    expect(report).toMatchSnapshot();
  });

  it("should return false due to invalid mentionable parameter (undefined)", async () => {
    const corde = initClient();
    const toSetRoleMentionable = initTestClass(corde, false);
    // @ts-ignore
    const report = await toSetRoleMentionable.action(undefined, { id: "123" });

    const message = buildReportMessage(
      `expected: mentionable option to be true or false\n`,
      `received: undefined`,
    );

    const expectReport = createReport(toSetRoleMentionable, false, message);

    expect(report).toEqual(expectReport);
    expect(report).toMatchSnapshot();
  });

  it("should return false due to not found role", async () => {
    const corde = initClient();
    corde.findRole = jest.fn().mockReturnValue(null);
    const toSetRoleMentionable = initTestClass(corde, false);
    const report = await toSetRoleMentionable.action(false, { id: "123" });

    const message = buildReportMessage(`expected: role with id 123\n`, `received: null`);

    const expectReport = createReport(toSetRoleMentionable, false, message);

    expect(report).toEqual(expectReport);
    expect(report).toMatchSnapshot();
  });

  it("should fail due to no role mentionable was not updated", async () => {
    const corde = initClient();

    runtime.setConfigs({ timeout: 100 }, true);

    const toSetRoleMentionable = initTestClass(corde, false);
    const report = await toSetRoleMentionable.action(false, { id: "123" });

    const message = buildReportMessage(
      `expected: mentionable to be false\n`,
      `received: role mentionable was not updated`,
    );

    const expectReport = createReport(toSetRoleMentionable, false, message);

    expect(report).toEqual(expectReport);
    expect(report).toMatchSnapshot();
  });

  it("should return true due to isNot true and no role change", async () => {
    const corde = initClient();

    runtime.setConfigs({ timeout: 100 }, true);

    const toSetRoleMentionable = initTestClass(corde, true);
    const report = await toSetRoleMentionable.action(false, { id: "123" });

    const expectReport = createReport(toSetRoleMentionable, true);

    expect(report).toEqual(expectReport);
    expect(report).toMatchSnapshot();
  });

  it("should return true due to role changed the mentionable (isNot false)", async () => {
    const corde = initClient();

    runtime.setConfigs({ timeout: 100 }, true);
    const mockEvent = new MockEvents(corde, mockDiscord);
    mockEvent.mockOnceMentionableUpdate(mockDiscord.role);
    const toSetRoleMentionable = initTestClass(corde, false);
    const report = await toSetRoleMentionable.action(mockDiscord.role.mentionable, { id: "123" });

    const expectReport = createReport(toSetRoleMentionable, true);

    expect(report).toEqual(expectReport);
    expect(report).toMatchSnapshot();
  });

  it("should return a not passed test due to mentionable should not change (isNot true)", async () => {
    const corde = initClient();

    runtime.setConfigs({ timeout: 100 }, true);
    const mockEvent = new MockEvents(corde, mockDiscord);
    mockEvent.mockOnceMentionableUpdate(mockDiscord.role);
    const toSetRoleMentionable = initTestClass(corde, true);
    const report = await toSetRoleMentionable.action(mockDiscord.role.mentionable, { id: "123" });

    const message = buildReportMessage(
      `expected: mentionable to not be ${mockDiscord.role.mentionable}\n`,
      `received: ${mockDiscord.role.mentionable}`,
    );

    const expectReport = createReport(toSetRoleMentionable, false, message);

    expect(report).toEqual(expectReport);
    expect(report).toMatchSnapshot();
  });

  it("should return a not passed test due expected name did not match to received", async () => {
    const corde = initClient();

    runtime.setConfigs({ timeout: 100 }, true);
    const mockEvent = new MockEvents(corde, mockDiscord);
    mockEvent.mockOnceMentionableUpdate(mockDiscord.role);
    const toSetRoleMentionable = initTestClass(corde, false);
    const report = await toSetRoleMentionable.action(true, { id: "123" });

    const message = buildReportMessage(`expected: mentionable to be true\n`, `received: false`);

    const expectReport = createReport(toSetRoleMentionable, false, message);

    expect(report).toEqual(expectReport);
    expect(report).toMatchSnapshot();
  });

  it("should return a failed test due to failure in message sending", async () => {
    const corde = initCordeClientWithChannel(mockDiscord, mockDiscord.client);

    corde.findRole = jest.fn().mockReturnValue(mockDiscord.role);
    corde.fetchRole = jest.fn().mockReturnValue(null);

    const erroMessage = "can not send message to channel x";
    corde.sendTextMessage = jest
      .fn()
      .mockImplementation(() => Promise.reject(new Error(erroMessage)));

    const toSetRoleMentionable = initTestClass(corde, false);
    const report = await toSetRoleMentionable.action(true, { id: "123" });

    const expectReport = createReport(toSetRoleMentionable, false, buildReportMessage(erroMessage));

    expect(report).toEqual(expectReport);
    expect(report).toMatchSnapshot();
  });
});
