import { Client } from "discord.js";
import MockDiscord from "../../mocks/mockDiscord";
import { createReport, initCordeClientWithChannel, testUtils } from "../../testHelper";
import { MockEvents } from "../../mocks/mockEvents";
import { ICordeBot, ITestReport } from "../../../src/types";
import { ToDeleteRole } from "../../../src/expect/matches";
import { roleUtils } from "../../../src/expect/roleUtils";
import { buildReportMessage } from "../../../src/utils";
import { runtime } from "../../../src/environment";

let mockDiscord = new MockDiscord();
let mockEvents: MockEvents;

describe("testing toDeleteRole function", () => {
  afterEach(() => {
    mockDiscord = new MockDiscord();
  });

  function initTestClass(cordeBot: ICordeBot, isNot: boolean, command?: string) {
    return testUtils.initTestClass(ToDeleteRole, {
      command: command ?? "toDelete",
      isCascade: false,
      cordeBot: cordeBot,
      isNot: isNot,
    });
  }

  describe("isnot true", () => {
    it("should return a failed report for a found role with property role.deleted = true role", async () => {
      const corde = initializeCorde();
      mockEvents.mockOnceRoleDelete();
      const role = mockDiscord.role;
      role.deleted = true;
      corde.fetchRole = jest.fn().mockReturnValue(role);

      const isNot = true;
      const command = "!removeRole 123";
      const toDeleteRole = initTestClass(corde, isNot, command);
      const report = await toDeleteRole.action({ id: "123" });

      const message = buildReportMessage(
        `expected: role ${role.id} not deleted\n`,
        `received: role was deleted before call the command '${command}'`,
      );

      const model = createReport(toDeleteRole, false, message);

      expect(report).toMatchObject(model);
      expect(report).toMatchSnapshot();
    });

    it("should return a passed report for a deleted role", async () => {
      const corde = initializeCorde();
      mockEvents.mockOnceRoleDelete();
      corde.fetchRole = jest.fn().mockReturnValue(mockDiscord.role);

      const isNot = true;
      const toDeleteRole = initTestClass(corde, isNot);
      const report = await toDeleteRole.action({ id: "123" });

      const model = createReport(toDeleteRole, true);

      expect(report).toMatchObject(model);
    });

    it("should return a failed report for a deleted role(isNot true)", async () => {
      const corde = initializeCorde();
      mockEvents.mockOnceRoleDelete();

      const isNot = true;
      const toDeleteRole = initTestClass(corde, isNot);
      const report = await toDeleteRole.action({ id: "123" });

      const message = buildReportMessage(`expected: role ${mockDiscord.role.id} to not be deleted`);
      const model = createReport(toDeleteRole, false, message);

      expect(report).toMatchObject(model);
      expect(report).toMatchSnapshot();
    });

    it("should get timeout when trying to delete the role, but should pass", async () => {
      const corde = initializeCorde();
      corde.fetchRole = jest.fn().mockReturnValue(mockDiscord.role);

      const isNot = true;
      const roleIdentifier = { id: mockDiscord.role.id };
      runtime.setConfigs({ timeout: 100 }, true);

      const toDeleteRole = initTestClass(corde, isNot);
      const report = await toDeleteRole.action(roleIdentifier);

      const model = createReport(toDeleteRole, true);
      expect(report).toMatchObject(model);
      expect(report).toMatchSnapshot();
    });
  });

  describe("isNot false", () => {
    it("should return a passed report for a deleted role", async () => {
      const corde = initializeCorde();
      mockEvents.mockOnceRoleDelete();

      const isNot = false;
      const toDeleteRole = initTestClass(corde, isNot);
      const report = await toDeleteRole.action({ id: "123" });

      const model = createReport(toDeleteRole, true);

      expect(report).toMatchObject(model);
      expect(report).toMatchSnapshot();
    });

    it("should get timeout when trying to delete the role", async () => {
      const corde = initializeCorde();
      corde.fetchRole = jest.fn().mockReturnValue(mockDiscord.role);

      const isNot = false;
      const roleIdentifier = { id: mockDiscord.role.id };
      runtime.setConfigs({ timeout: 100 }, true);

      const toDeleteRole = initTestClass(corde, isNot);
      const report = await toDeleteRole.action(roleIdentifier);

      const message = buildReportMessage(
        `timeout: role ${mockDiscord.role.id} wasn't deleted in the expected time (${runtime.timeout})`,
      );

      const model = createReport(toDeleteRole, false, message);
      expect(report).toMatchObject(model);
      expect(report).toMatchSnapshot();
    });

    it("should fail due to roleIdentifier null", async () => {
      const corde = initializeCorde();
      mockEvents.mockOnceRoleDelete();

      const isNot = false;
      const toDeleteRole = initTestClass(corde, isNot);
      const report = await toDeleteRole.action(null);
      const message = buildReportMessage(
        "expected: data to identifier the role (id or name)\n",
        `received: null`,
      );
      const model = createReport(toDeleteRole, false, message);

      expect(report).toMatchObject(model);
      expect(report).toMatchSnapshot();
    });

    it("should return a failed report for a no deleted role", async () => {
      const corde = initializeCorde();
      mockEvents.mockOnceRoleDelete();
      corde.fetchRole = jest.fn().mockReturnValue(mockDiscord.role);

      const isNot = false;
      const roleIdentifier = { id: "123" };
      const toDeleteRole = initTestClass(corde, isNot);
      const report = await toDeleteRole.action(roleIdentifier);

      const message = buildReportMessage(`expected: role ${mockDiscord.role.id} to be deleted`);

      const model = createReport(toDeleteRole, false, message);
      expect(report).toMatchObject(model);
      expect(report).toMatchSnapshot();
    });

    it("should return a passed report for a found role with property role.deleted = true role", async () => {
      const corde = initializeCorde();
      mockEvents.mockOnceRoleDelete();
      const role = mockDiscord.role;
      role.deleted = true;
      corde.fetchRole = jest.fn().mockReturnValue(role);

      const isNot = false;
      const roleIdentifier = { id: "123" };
      const command = "!deleteRole 123";
      const toDeleteRole = initTestClass(corde, isNot, command);
      const report = await toDeleteRole.action(roleIdentifier);

      const message = buildReportMessage(
        `expected: role ${role.id} not deleted\n`,
        `received: role was deleted before call the command '${command}'`,
      );

      const model = createReport(toDeleteRole, false, message);

      expect(report).toMatchObject(model);
      expect(report).toMatchSnapshot();
    });

    it("should fail due to inexistent role", async () => {
      const corde = initCordeClientWithChannel(mockDiscord, new Client());
      mockEvents = new MockEvents(corde, mockDiscord);
      mockEvents.mockOnceRoleDelete();

      corde.findRole = jest.fn().mockReturnValue(null);

      const isNot = true;
      const roleIdentifier = { id: "123" };
      const toDeleteRole = initTestClass(corde, isNot);
      const report = await toDeleteRole.action(roleIdentifier);

      const baseMessage = roleUtils.createExpectedMessageForRoleData(roleIdentifier);
      const message = buildReportMessage(`expected: ${baseMessage}\n`, `received: null`);

      const model = createReport(toDeleteRole, false, message);
      expect(report).toMatchObject(model);
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

      mockEvents = new MockEvents(corde, mockDiscord);

      mockEvents.mockOnceRoleDelete();

      const role = mockDiscord.role;
      role.deleted = false;
      corde.fetchRole = jest.fn().mockReturnValue(role);

      const isNot = false;
      const roleIdentifier = { id: "123" };
      const command = "!deleteRole 123";
      const toDeleteRole = initTestClass(corde, isNot, command);
      const report = await toDeleteRole.action(roleIdentifier);

      const message = buildReportMessage(erroMessage);

      const model = createReport(toDeleteRole, false, message);

      expect(report).toMatchObject(model);
      expect(report).toMatchSnapshot();
    });
  });
});

function initializeCorde() {
  const corde = initCordeClientWithChannel(mockDiscord, mockDiscord.client);

  corde.findRole = jest.fn().mockReturnValue(mockDiscord.role);
  corde.sendTextMessage = jest.fn().mockImplementation(() => {});
  corde.fetchRole = jest.fn().mockReturnValue(null);

  mockEvents = new MockEvents(corde, mockDiscord);
  return corde;
}
