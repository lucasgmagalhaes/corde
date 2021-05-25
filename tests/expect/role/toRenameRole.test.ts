import { Client } from "discord.js";
import { ToRenameRole } from "../../../src/expect/matches";
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
  return testUtils.initTestClass(ToRenameRole, {
    command: "toDelete",
    isCascade: false,
    cordeBot: cordeBot,
    isNot: isNot,
  });
}

describe("testing ToRenameRole operation", () => {
  afterEach(() => {
    mockDiscord = new MockDiscord();
  });

  it("should fail due to undefined roleIdentifier", async () => {
    const corde = initClient();
    const toRename = initTestClass(corde, false);
    const report = await toRename.action("egg", undefined);

    const message = buildReportMessage(
      "expected: data to identifier the role (id or name)\n",
      `received: null`,
    );

    const expectReport = createReport(toRename, false, message);

    expect(report).toEqual(expectReport);
    expect(report).toMatchSnapshot();
  });

  it("should return false due to invalid newName value (null)", async () => {
    const corde = initClient();
    const toRename = initTestClass(corde, false);
    // @ts-ignore
    const report = await toRename.action({}, { id: "123" });

    const message = buildReportMessage(
      `expected: parameter newName must be a string or a number\n`,
      `received: object`,
    );

    const expectReport = createReport(toRename, false, message);

    expect(report).toEqual(expectReport);
    expect(report).toMatchSnapshot();
  });

  it("should return false due to newName be a empty string", async () => {
    const corde = initClient();
    const toRename = initTestClass(corde, false);
    const report = await toRename.action("", { id: "123" });

    const message = buildReportMessage(
      `expected: parameter newName must be a valid string\n`,
      `received: ''`,
    );

    const expectReport = createReport(toRename, false, message);

    expect(report).toEqual(expectReport);
    expect(report).toMatchSnapshot();
  });

  it("should return false due to not found role", async () => {
    const corde = initClient();
    corde.findRole = jest.fn().mockReturnValue(null);
    const toRename = initTestClass(corde, false);
    const report = await toRename.action("newName", { id: "123" });

    const message = buildReportMessage(`expected: role with id 123\n`, `received: null`);

    const expectReport = createReport(toRename, false, message);

    expect(report).toEqual(expectReport);
    expect(report).toMatchSnapshot();
  });

  it("should fail due to no role was renamed", async () => {
    const corde = initClient();

    runtime.setConfigs({ timeout: 100 }, true);

    const toRename = initTestClass(corde, false);
    const report = await toRename.action("newName", { id: "123" });

    const message = buildReportMessage(
      `expected: role 'WE DEM BOYZZ!!!!!! 1' to be renamed to newName\n`,
      `received: name was not changed`,
    );

    const expectReport = createReport(toRename, false, message);

    expect(report).toEqual(expectReport);
    expect(report).toMatchSnapshot();
  });

  it("should return true due to isNot true and no role change", async () => {
    const corde = initClient();

    runtime.setConfigs({ timeout: 100 }, true);

    const toRename = initTestClass(corde, true);
    const report = await toRename.action("newName", { id: "123" });

    const expectReport = createReport(toRename, true);

    expect(report).toEqual(expectReport);
    expect(report).toMatchSnapshot();
  });

  it("should return true due to role has changed the name (isNot false)", async () => {
    const corde = initClient();

    runtime.setConfigs({ timeout: 100 }, true);
    const mockEvent = new MockEvents(corde, mockDiscord);
    mockEvent.mockOnceRoleRenamed(mockDiscord.role);
    const toRename = initTestClass(corde, false);
    const report = await toRename.action(mockDiscord.role.name, { id: "123" });

    const expectReport = createReport(toRename, true);

    expect(report).toEqual(expectReport);
    expect(report).toMatchSnapshot();
  });

  it("should return a not passed test due to name should not change (isNot true)", async () => {
    const corde = initClient();

    runtime.setConfigs({ timeout: 100 }, true);
    const mockEvent = new MockEvents(corde, mockDiscord);
    mockEvent.mockOnceRoleRenamed(mockDiscord.role);
    const toRename = initTestClass(corde, true);
    const report = await toRename.action(mockDiscord.role.name, { id: "123" });

    const message = buildReportMessage(
      `expected: role not change name to '${mockDiscord.role.name}'\n`,
      `received: name was not changed (actual: '${mockDiscord.role.name}')`,
    );

    const expectReport = createReport(toRename, false, message);

    expect(report).toEqual(expectReport);
    expect(report).toMatchSnapshot();
  });

  it("should return a not passed test due expected name did not match to received", async () => {
    const corde = initClient();

    runtime.setConfigs({ timeout: 100 }, true);
    const mockEvent = new MockEvents(corde, mockDiscord);
    mockEvent.mockOnceRoleRenamed(mockDiscord.role);
    const toRename = initTestClass(corde, false);
    const report = await toRename.action("test", { id: "123" });

    const message = buildReportMessage(
      `expected: role change name to 'test'\n`,
      `received: name was not changed (actual: '${mockDiscord.role.name}')`,
    );

    const expectReport = createReport(toRename, false, message);

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

    const toRename = initTestClass(corde, false);
    const report = await toRename.action("test", { id: "123" });

    const expectReport = createReport(toRename, false, buildReportMessage(erroMessage));

    expect(report).toEqual(expectReport);
    expect(report).toMatchSnapshot();
  });
});
