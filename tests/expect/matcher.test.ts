import { testCollector } from "../../src/common/testCollector";
import { Colors } from "../../src/utils/colors";
import {
  ToSetRolePosition,
  ToRenameRole,
  ToSetRoleHoist,
  ToSetRoleMentionable,
  ToSetRolePermission,
  ToPinMessage,
  ToUnPinMessage,
  ToAddReaction,
  ToDeleteRole,
  ToEditMessage,
  ToRemoveReaction,
  ToReturn,
  ToSetRoleColor,
} from "../../src/expect/matches";
import { IExpectTestBaseParams, IExpectTestParams, ITestReport } from "../../src/types";
import { ExpectTest } from "../../src/expect/matches/expectTest";
import { buildReportMessage } from "../../src/utils";
import { IToHaveResult } from "../../src/expect/matches/toHaveResult";
import { expect as _expect } from "../../src/expect";
import MockDiscord from "../mocks/mockDiscord";
import { runtime } from "../../src/environment";

jest.mock("../../src/expect/matches/message/toReturn.ts");
jest.mock("../../src/expect/matches/message/toRemoveReaction.ts");
jest.mock("../../src/expect/matches/message/toEditMessage.ts");
jest.mock("../../src/expect/matches/message/toAddReaction.ts");
jest.mock("../../src/expect/matches/message/toPinMessage.ts");
jest.mock("../../src/expect/matches/message/toUnpinMessage.ts");

jest.mock("../../src/expect/matches/role/toDeleteRole.ts");
jest.mock("../../src/expect/matches/role/toSetRoleColor.ts");
jest.mock("../../src/expect/matches/role/toSetRoleMentionable");
jest.mock("../../src/expect/matches/role/toSetRoleHoist");
jest.mock("../../src/expect/matches/role/toRenameRole");
jest.mock("../../src/expect/matches/role/toSetRolePosition");
jest.mock("../../src/expect/matches/role/toSetRolePermission.ts");

jest.mock("../../src/expect/matches/toHaveResult.ts");

const toEditMessageActionMock = jest.fn();
const toSetRoleMentionableActionMock = jest.fn();
const toSetHoistActionMock = jest.fn();
const toReturnActionMock = jest.fn();
const toAddReactionActionMock = jest.fn();
const toRemoveReactionActionMock = jest.fn();
const toRenameRoleActionMock = jest.fn();
const toSetRoleColorActionMock = jest.fn();
const toDeleteRoleActionMock = jest.fn();
const toSetRolePositionActionMock = jest.fn();
const toSetRolePermissionActionMock = jest.fn();
const toPinMessageActionMock = jest.fn();
const toUnpinMessageActionMock = jest.fn();
const toHaveResultsActionMock = jest.fn();

const con = "test";
const mockDiscord = new MockDiscord();
const channelId = mockDiscord.channelId;
const guildId = mockDiscord.guild.id;

runtime.setConfigs({ guildId: "22222222222", channelId: "33333333333333" }, true);

async function createToBeCalledTestFor(actionMock: jest.Mock<any, any>) {
  await runtime.injectBot(testCollector.cloneIsolatedTestFunctions()[0]);
  expect(actionMock).toBeCalled();
}

async function createDefaultTestFor<T extends ExpectTest>(
  testClass: new (params: IExpectTestParams) => T,
  testClassActionMock: jest.Mock<any, any>,
  testClassParams: Partial<IExpectTestBaseParams>,
  ...callForActionMock: Parameters<T["action"]>
) {
  const {
    command,
    channelIdToSendCommand,
    guildId,
    cordeBot,
    isNot,
    timeout,
    channelId,
    isCascade,
  } = testClassParams;

  await runtime.injectBot(testCollector.cloneIsolatedTestFunctions()[0]);
  const params: IExpectTestBaseParams = {
    command: command ?? con,
    channelIdToSendCommand: channelIdToSendCommand,
    guildId: guildId ?? "22222222222",
    cordeBot: cordeBot ?? runtime.bot,
    isNot,
    timeout: timeout ?? runtime.timeout,
    channelId: channelId ?? "33333333333333",
    isCascade: isCascade ?? false,
  };
  expect(testClass).toBeCalledWith(params);
  expect(testClassActionMock).toBeCalledWith(...callForActionMock);
}

describe("Testing matches class", () => {
  beforeEach(() => {
    testCollector.clearIsolatedTestFunctions();

    ToReturn.prototype.action = toReturnActionMock;
    ToAddReaction.prototype.action = toAddReactionActionMock;
    ToRemoveReaction.prototype.action = toRemoveReactionActionMock;
    ToSetRoleColor.prototype.action = toSetRoleColorActionMock;

    ToEditMessage.prototype.action = toEditMessageActionMock;
    ToDeleteRole.prototype.action = toDeleteRoleActionMock;
    ToSetRoleMentionable.prototype.action = toSetRoleMentionableActionMock;
    ToSetRoleHoist.prototype.action = toSetHoistActionMock;

    ToRenameRole.prototype.action = toRenameRoleActionMock;
    ToSetRolePosition.prototype.action = toSetRolePositionActionMock;
    ToSetRolePermission.prototype.action = toSetRolePermissionActionMock;
    ToPinMessage.prototype.action = toPinMessageActionMock;

    ToUnPinMessage.prototype.action = toUnpinMessageActionMock;
    IToHaveResult.prototype.action = toHaveResultsActionMock;
  });

  afterEach(() => {
    toEditMessageActionMock.mockClear();
    toSetRoleMentionableActionMock.mockClear();
    toSetHoistActionMock.mockClear();
    toReturnActionMock.mockClear();

    toAddReactionActionMock.mockClear();
    toRemoveReactionActionMock.mockClear();
    toRenameRoleActionMock.mockClear();
    toSetRoleColorActionMock.mockClear();

    toDeleteRoleActionMock.mockClear();
    toSetRolePositionActionMock.mockClear();
    toSetRolePermissionActionMock.mockClear();
    toPinMessageActionMock.mockClear();

    toSetRolePositionActionMock.mockClear();
    toSetRolePositionActionMock.mockClear();
    toSetRolePositionActionMock.mockClear();
  });

  it("should not return a function", async () => {
    const matches = initExpectMatch("name");
    expect(matches.not).not.toBe(undefined);
  });

  it("should pass channelId as argumento of expect", async () => {
    const channelId = "1231241212";
    initExpectMatch(con, channelId).toReturn("12");
    await createDefaultTestFor(
      ToReturn,
      toReturnActionMock,
      { channelIdToSendCommand: channelId, isNot: false },
      "12",
    );
  });

  describe("testing operationFactory", () => {
    it("should return failed test due to null command name", async () => {
      initExpectMatch("").toReturn("");
      const report = await runtime.injectBot(testCollector.cloneIsolatedTestFunctions()[0]);
      expect(report).toEqual<ITestReport>({
        pass: false,
        testName: undefined,
        message: buildReportMessage("command can not be null or an empty string"),
      });
    });

    it("should return passed test without trace", async () => {
      initExpectMatch().toReturn("");
      ToReturn.prototype.action = jest.fn().mockReturnValue(Promise.resolve({ pass: true }));
      const report = await runtime.injectBot(testCollector.cloneIsolatedTestFunctions()[0]);
      expect(report.pass).toEqual(true);
      expect(report.trace).toBeFalsy();
    });

    it("should return failed test with trace", async () => {
      initExpectMatch().toReturn("");
      ToReturn.prototype.action = jest.fn().mockReturnValue(Promise.resolve({ pass: false }));
      const report = await runtime.injectBot(testCollector.cloneIsolatedTestFunctions()[0]);
      expect(report.pass).toEqual(false);
      expect(report.trace).toBeTruthy();
    });
  });

  describe("testing toReturn function", () => {
    it("should add a function to hasIsolatedTestFunctions after call toReturn", async () => {
      initExpectMatch().toReturn("empty");
      expect(testCollector.hasIsolatedTestFunctions()).toBe(true);
    });

    it("should add a toReturn function", async () => {
      initExpectMatch().toReturn("expect");
      await runtime.injectBot(testCollector.cloneIsolatedTestFunctions()[0]);
      expect(toReturnActionMock).toBeCalled();
    });

    it("should add a toReturn function with correct values (isNot false)", async () => {
      const expectName = "empty";
      initExpectMatch().toReturn(expectName);
      await createDefaultTestFor(ToReturn, toReturnActionMock, { isNot: false }, expectName);
    });

    it("should add a toReturn function with correct values (isNot false, and channelId informed)", async () => {
      const expectName = "empty";

      initExpectMatch().inChannel(channelId).toReturn(expectName);

      await createDefaultTestFor(
        ToReturn,
        toReturnActionMock,
        { isNot: false, channelId },
        expectName,
      );
    });

    it("should add a toReturn function with correct values (isNot true)", async () => {
      const expectName = "empty";
      initExpectMatch().not.toReturn(expectName);
      await createDefaultTestFor(ToReturn, toReturnActionMock, { isNot: true }, expectName);
    });
  });

  describe("testing toEditMessage function", () => {
    it("should add a function to hasIsolatedTestFunctions after call toReturn", async () => {
      initExpectMatch().toEditMessage("empty", { id: "123" });
      expect(testCollector.hasIsolatedTestFunctions()).toBe(true);
    });

    it("should add a toEditMessage function", async () => {
      initExpectMatch().toEditMessage("empty", { id: "123" });
      await runtime.injectBot(testCollector.cloneIsolatedTestFunctions()[0]);
      expect(toEditMessageActionMock).toBeCalled();
    });

    it("should add a toEditMessage function with correct values (isNot false)", async () => {
      initExpectMatch().toEditMessage("empty", { id: "123" });
      await createDefaultTestFor(
        ToEditMessage,
        toEditMessageActionMock,
        { isNot: false },
        "empty",
        {
          id: "123",
        },
      );
    });

    it("should add a toEditMessage function with correct values (isNot true)", async () => {
      initExpectMatch().not.toEditMessage("empty", { id: "123" });
      await createDefaultTestFor(ToEditMessage, toEditMessageActionMock, { isNot: true }, "empty", {
        id: "123",
      });
    });

    it("should add a toEditMessage function with correct values (isNot true and with channelId)", async () => {
      initExpectMatch().inChannel(channelId).not.toEditMessage("empty", { id: "123" });
      await createDefaultTestFor(
        ToEditMessage,
        toEditMessageActionMock,
        { isNot: true, channelId },
        "empty",
        {
          id: "123",
        },
      );
    });
  });

  describe("testing toAddReaction function", () => {
    it("should add a function to hasIsolatedTestFunctions after call toAddReaction", async () => {
      initExpectMatch().toAddReaction(["😀"], "123124");
      expect(testCollector.hasIsolatedTestFunctions()).toBe(true);
    });

    it("should add a toAddReaction function", async () => {
      initExpectMatch().toAddReaction(["😀"], "123124");
      await runtime.injectBot(testCollector.cloneIsolatedTestFunctions()[0]);
      expect(toAddReactionActionMock).toBeCalled();
    });

    it("should add a toAddReaction function with correct values (isNot false)", async () => {
      const expectReaction = ["😀"];
      initExpectMatch().toAddReaction(expectReaction, "123124");
      await createDefaultTestFor(
        ToAddReaction,
        toAddReactionActionMock,
        { isNot: false },
        expectReaction,
        "123124",
      );
    });

    it("should add a toAddReaction function with correct values (isNot false and channelId)", async () => {
      const expectReaction = ["😀"];
      initExpectMatch().inChannel(channelId).toAddReaction(expectReaction, "123124");
      await createDefaultTestFor(
        ToAddReaction,
        toAddReactionActionMock,
        { isNot: false, channelId },
        expectReaction,
        "123124",
      );
    });

    it("should add a toAddReaction function with correct values (isNot true)", async () => {
      const expectReaction = ["😀"];
      initExpectMatch().not.toAddReaction(expectReaction, "123124");
      await createDefaultTestFor(
        ToAddReaction,
        toAddReactionActionMock,
        { isNot: true },
        expectReaction,
        "123124",
      );
    });
  });

  describe("testing toRemoveReaction function", () => {
    it("should add a function to hasIsolatedTestFunctions after call toRemoveReaction", async () => {
      initExpectMatch().toRemoveReaction(["😀"]);
      expect(testCollector.hasIsolatedTestFunctions()).toBe(true);
    });

    it("should add a toRemoveReaction function", async () => {
      initExpectMatch().toRemoveReaction(["😀"]);
      await runtime.injectBot(testCollector.cloneIsolatedTestFunctions()[0]);
      expect(toRemoveReactionActionMock).toBeCalled();
    });

    it("should add a toRemoveReaction function with message data", async () => {
      const expectReaction = ["😀"];
      const messageIdentifier = { id: "12312312" };
      initExpectMatch().toRemoveReaction(expectReaction, messageIdentifier);
      await createDefaultTestFor(
        ToRemoveReaction,
        toRemoveReactionActionMock,
        { isNot: false },
        expectReaction,
        messageIdentifier,
      );
    });

    it("should add a toRemoveReaction function with channelId informed", async () => {
      const expectReaction = ["😀"];
      const messageIdentifier = { id: "12312312" };

      initExpectMatch().inChannel(channelId).toRemoveReaction(expectReaction, messageIdentifier);

      await createDefaultTestFor(
        ToRemoveReaction,
        toRemoveReactionActionMock,
        { isNot: false, channelId },
        expectReaction,
        messageIdentifier,
      );
    });

    it("should add a toRemoveReaction function with array of emojis", async () => {
      const expectReaction = ["😀"];
      const messageIdentifier = { id: "12312312" };
      initExpectMatch().toRemoveReaction(expectReaction, messageIdentifier);
      await createDefaultTestFor(
        ToRemoveReaction,
        toRemoveReactionActionMock,
        { isNot: false },
        expectReaction,
        messageIdentifier,
      );
    });

    it("should add a toRemoveReaction function with correct values (isNot true)", async () => {
      const expectReaction = ["😀"];
      initExpectMatch().not.toRemoveReaction(expectReaction);
      await createDefaultTestFor(
        ToRemoveReaction,
        toRemoveReactionActionMock,
        { isNot: true },
        expectReaction,
        undefined,
      );
    });
  });

  describe("testing toSetRoleColor function", () => {
    const color = Colors.DARK_AQUA;

    it("should add a function to hasIsolatedTestFunctions after call toSetRoleColor", async () => {
      initExpectMatch().toSetRoleColor(color, "123");
      expect(testCollector.hasIsolatedTestFunctions()).toBe(true);
    });

    it("should add a toSetRoleColor function", async () => {
      initExpectMatch().toSetRoleColor(color, "123");
      await runtime.injectBot(testCollector.cloneIsolatedTestFunctions()[0]);
      expect(toSetRoleColorActionMock).toBeCalled();
    });

    it("should add a toSetRoleColor function with correct values (isNot false)", async () => {
      initExpectMatch().toSetRoleColor(color, "123");
      await createDefaultTestFor(
        ToSetRoleColor,
        toSetRoleColorActionMock,
        { isNot: false },
        color,
        "123",
      );
    });

    it("should add a toSetRoleColor function with message data", async () => {
      initExpectMatch().toSetRoleColor(Colors.DARK_AQUA, "123");
      await createDefaultTestFor(
        ToSetRoleColor,
        toSetRoleColorActionMock,
        { isNot: false },
        color,
        "123",
      );
    });

    it("should add a toSetRoleColor function with message data and with guildId", async () => {
      initExpectMatch().inGuild(guildId).toSetRoleColor(Colors.DARK_AQUA, "123");
      await createDefaultTestFor(
        ToSetRoleColor,
        toSetRoleColorActionMock,
        { isNot: false, guildId },
        color,
        "123",
      );
    });

    it("should add a toSetRoleColor function with correct values (isNot true)", async () => {
      initExpectMatch().not.toSetRoleColor(color, "123");
      await createDefaultTestFor(
        ToSetRoleColor,
        toSetRoleColorActionMock,
        { isNot: true },
        color,
        "123",
      );
    });
  });

  describe("testing toDeleteRole function", () => {
    const roleId = {
      id: "123",
    };

    it("should add a function to hasIsolatedTestFunctions after call toDeleteRole", async () => {
      initExpectMatch().toDeleteRole("123");
      expect(testCollector.hasIsolatedTestFunctions()).toBe(true);
    });

    it("should add a toDeleteRole function", async () => {
      initExpectMatch().toDeleteRole("123");
      await runtime.injectBot(testCollector.cloneIsolatedTestFunctions()[0]);
      expect(toDeleteRoleActionMock).toBeCalled();
    });

    it("should add a toDeleteRole function with correct values (isNot false)", async () => {
      initExpectMatch().toDeleteRole("123");
      await createDefaultTestFor(ToDeleteRole, toDeleteRoleActionMock, { isNot: false }, "123");
    });

    it("should add a toDeleteRole function with id", async () => {
      initExpectMatch().toDeleteRole("123");
      await createDefaultTestFor(ToDeleteRole, toDeleteRoleActionMock, { isNot: false }, "123");
    });

    it("should add a toDeleteRole function with id in data object", async () => {
      initExpectMatch().toDeleteRole(roleId);
      await createDefaultTestFor(ToDeleteRole, toDeleteRoleActionMock, { isNot: false }, roleId);
    });

    it("should add a toDeleteRole function with id in data object and with guild id", async () => {
      initExpectMatch().inGuild(guildId).toDeleteRole(roleId);
      await createDefaultTestFor(
        ToDeleteRole,
        toDeleteRoleActionMock,
        { isNot: false, guildId },
        roleId,
      );
    });

    it("should add a toDeleteRole function with name in data object", async () => {
      initExpectMatch().toDeleteRole({ name: "test" });
      await createDefaultTestFor(
        ToDeleteRole,
        toDeleteRoleActionMock,
        { isNot: false },
        { name: "test" },
      );
    });

    it("should add a toDeleteRole function with correct values (isNot true)", async () => {
      initExpectMatch().not.toDeleteRole("123");
      await createDefaultTestFor(ToDeleteRole, toDeleteRoleActionMock, { isNot: true }, roleId.id);
    });
  });

  describe("testing toSetRoleMentionable function", () => {
    const roleId = {
      id: "123",
    };
    const mentionableTrue = true;

    it("should add a function to hasIsolatedTestFunctions after call toSetRoleMentionable", async () => {
      initExpectMatch().toSetRoleMentionable(true, roleId.id);
      expect(testCollector.hasIsolatedTestFunctions()).toBe(true);
    });

    it("should add a toSetRoleMentionable function", async () => {
      initExpectMatch().toSetRoleMentionable(true, roleId.id);
      await runtime.injectBot(testCollector.cloneIsolatedTestFunctions()[0]);
      expect(toSetRoleMentionableActionMock).toBeCalled();
    });

    it("should add a toSetRoleMentionable function with correct values (isNot false)", async () => {
      initExpectMatch().toSetRoleMentionable(mentionableTrue, roleId.id);
      await createDefaultTestFor(
        ToSetRoleMentionable,
        toSetRoleMentionableActionMock,
        { isNot: false },
        mentionableTrue,
        roleId.id,
      );
    });

    it("should add a toSetRoleMentionable function with correct values (isNot false and guildId)", async () => {
      initExpectMatch().inGuild(guildId).toSetRoleMentionable(mentionableTrue, roleId.id);
      await createDefaultTestFor(
        ToSetRoleMentionable,
        toSetRoleMentionableActionMock,
        { isNot: false, guildId },
        mentionableTrue,
        roleId.id,
      );
    });

    it("should add a toSetRoleMentionable function with correct values (isNot true)", async () => {
      initExpectMatch().not.toSetRoleMentionable(mentionableTrue, roleId.id);
      await createDefaultTestFor(
        ToSetRoleMentionable,
        toSetRoleMentionableActionMock,
        { isNot: true },
        mentionableTrue,
        roleId.id,
      );
    });
  });

  describe("testing toSetRoleHoist function", () => {
    const roleId = {
      id: "123",
    };
    const mentionableTrue = true;
    it("should add a function to hasIsolatedTestFunctions after call toSetRoleHoist", async () => {
      initExpectMatch().toSetRoleHoist(mentionableTrue, roleId);
      expect(testCollector.hasIsolatedTestFunctions()).toBe(true);
    });

    it("should add a toSetRoleHoist function", async () => {
      initExpectMatch().toSetRoleHoist(mentionableTrue, roleId);
      await runtime.injectBot(testCollector.cloneIsolatedTestFunctions()[0]);
      expect(toSetHoistActionMock).toBeCalled();
    });

    it("should add a toSetRoleHoist function with correct values using id", async () => {
      initExpectMatch().toSetRoleHoist(mentionableTrue, "123");
      await createDefaultTestFor(
        ToSetRoleHoist,
        toSetHoistActionMock,
        { isNot: false },
        mentionableTrue,
        roleId.id,
      );
    });

    it("should add a toSetRoleHoist function with correct values using id and guildId", async () => {
      initExpectMatch().inGuild(guildId).toSetRoleHoist(mentionableTrue, "123");
      await createDefaultTestFor(
        ToSetRoleHoist,
        toSetHoistActionMock,
        { isNot: false, guildId },
        mentionableTrue,
        roleId.id,
      );
    });

    it("should add a toSetRoleHoist function with correct values (isNot false)", async () => {
      initExpectMatch().toSetRoleHoist(mentionableTrue, roleId);
      await createDefaultTestFor(
        ToSetRoleHoist,
        toSetHoistActionMock,
        { isNot: false },
        mentionableTrue,
        roleId,
      );
    });

    it("should add a toSetRoleHoist function with correct values (isNot true)", async () => {
      initExpectMatch().not.toSetRoleHoist(mentionableTrue, roleId);
      await createDefaultTestFor(
        ToSetRoleHoist,
        toSetHoistActionMock,
        { isNot: true },
        mentionableTrue,
        roleId,
      );
    });
  });

  describe("testing toRenameRole function", () => {
    const roleId = {
      id: "123",
    };

    it("should add a function to hasIsolatedTestFunctions after call toRenameRole", async () => {
      initExpectMatch().toRenameRole("newName", roleId);
      expect(testCollector.hasIsolatedTestFunctions()).toBe(true);
    });

    it("should add a toRenameRole function", async () => {
      initExpectMatch().toRenameRole("newName", roleId);
      await runtime.injectBot(testCollector.cloneIsolatedTestFunctions()[0]);
      expect(toRenameRoleActionMock).toBeCalled();
    });

    it("should add a toRenameRole function with correct values using id", async () => {
      const newName = "newName";
      const id = "123";
      initExpectMatch().toRenameRole(newName, id);
      await createDefaultTestFor(
        ToRenameRole,
        toRenameRoleActionMock,
        { isNot: false },
        newName,
        id,
      );
    });

    it("should add a toRenameRole function with correct values using id and guildId", async () => {
      const newName = "newName";
      const id = "123";
      initExpectMatch().inGuild(guildId).toRenameRole(newName, id);
      await createDefaultTestFor(
        ToRenameRole,
        toRenameRoleActionMock,
        { isNot: false, guildId },
        newName,
        id,
      );
    });

    it("should add a toRenameRole function with correct values (isNot false)", async () => {
      const newName = "newName";
      const id = roleId;
      initExpectMatch().toRenameRole(newName, id);
      await createDefaultTestFor(
        ToRenameRole,
        toRenameRoleActionMock,
        { isNot: false },
        newName,
        id,
      );
    });

    it("should add a toRenameRole function with correct values (isNot true)", async () => {
      const newName = "newName";
      const id = roleId;
      initExpectMatch().not.toRenameRole(newName, id);
      await createDefaultTestFor(
        ToRenameRole,
        toRenameRoleActionMock,
        { isNot: true },
        newName,
        id,
      );
    });
  });

  describe("testing toSetRolePosition function", () => {
    const roleId = {
      id: "123",
    };

    const newPosition = 1;
    it("should add a function to hasIsolatedTestFunctions after call toSetRolePosition", async () => {
      initExpectMatch().toSetRolePosition(newPosition, roleId);
      expect(testCollector.hasIsolatedTestFunctions()).toBe(true);
    });

    it("should add a toSetRolePosition function", async () => {
      initExpectMatch().toSetRolePosition(newPosition, roleId);
      await runtime.injectBot(testCollector.cloneIsolatedTestFunctions()[0]);
      expect(toSetRolePositionActionMock).toBeCalled();
    });

    it("should add a toSetRolePosition function with correct values using id", async () => {
      initExpectMatch().toSetRolePosition(newPosition, roleId);
      await createDefaultTestFor(
        ToSetRolePosition,
        toSetRolePositionActionMock,
        { isNot: false },
        newPosition,
        roleId,
      );
    });

    it("should add a toSetRolePosition function with correct values using id and guildId", async () => {
      initExpectMatch().inGuild(guildId).toSetRolePosition(newPosition, roleId);
      await createDefaultTestFor(
        ToSetRolePosition,
        toSetRolePositionActionMock,
        { isNot: false, guildId },
        newPosition,
        roleId,
      );
    });

    it("should add a toSetRolePosition function with correct values (isNot false)", async () => {
      initExpectMatch().toSetRolePosition(newPosition, roleId);
      await createDefaultTestFor(
        ToSetRolePosition,
        toSetRolePositionActionMock,
        { isNot: false },
        newPosition,
        roleId,
      );
    });

    it("should add a toSetRolePosition function with correct values (isNot true)", async () => {
      initExpectMatch().not.toSetRolePosition(newPosition, roleId);
      await createDefaultTestFor(
        ToSetRolePosition,
        toSetRolePositionActionMock,
        { isNot: true },
        newPosition,
        roleId,
      );
    });
  });

  describe("testing toSetRolePermission function", () => {
    const roleId = {
      id: "123",
    };

    function toSetRolePermission() {
      initExpectMatch().toSetRolePermission(roleId, "ADMINISTRATOR");
    }

    it("should add a function to hasIsolatedTestFunctions after call toSetRolePermission", async () => {
      toSetRolePermission();
      expect(testCollector.hasIsolatedTestFunctions()).toBe(true);
    });

    it("should add a toSetRolePermission function", async () => {
      toSetRolePermission();
      await createToBeCalledTestFor(toSetRolePermissionActionMock);
    });

    it("should add a toSetRolePermission function with correct values using id", async () => {
      toSetRolePermission();
      await createDefaultTestFor(
        ToSetRolePermission,
        toSetRolePermissionActionMock,
        { isNot: false },
        roleId,
        ["ADMINISTRATOR"],
      );
    });

    it("should add a toSetRolePermission function with correct values using id and guildId", async () => {
      initExpectMatch().inGuild(guildId).toSetRolePermission(roleId, "ADMINISTRATOR");
      await createDefaultTestFor(
        ToSetRolePermission,
        toSetRolePermissionActionMock,
        { isNot: false, guildId },
        roleId,
        ["ADMINISTRATOR"],
      );
    });

    it("should add a toSetRolePermission function with correct values (isNot false)", async () => {
      toSetRolePermission();
      await createDefaultTestFor(
        ToSetRolePermission,
        toSetRolePermissionActionMock,
        { isNot: false },
        roleId,
        ["ADMINISTRATOR"],
      );
    });

    it("should add a toSetRolePermission function with correct values (isNot true)", async () => {
      initExpectMatch().inGuild(guildId).not.toSetRolePermission(roleId, "ADMINISTRATOR");
      await createDefaultTestFor(
        ToSetRolePermission,
        toSetRolePermissionActionMock,
        { isNot: true, guildId },
        roleId,
        ["ADMINISTRATOR"],
      );
    });
  });

  describe("testing to pinMessage", () => {
    const messageId = {
      id: "123",
    };

    it("should add a function to hasIsolatedTestFunctions after call toPin", async () => {
      initExpectMatch().toPin(messageId);
      expect(testCollector.hasIsolatedTestFunctions()).toBe(true);
    });

    it("should add a toPin function", async () => {
      initExpectMatch().toPin(messageId);
      await createToBeCalledTestFor(toPinMessageActionMock);
    });

    it("should add a toPin function with correct values using id", async () => {
      initExpectMatch().toPin(messageId);
      await createDefaultTestFor(ToPinMessage, toPinMessageActionMock, { isNot: false }, messageId);
    });

    it("should add a toPin function with correct values using string id", async () => {
      const id = "1323";
      initExpectMatch().toPin(id);
      await createDefaultTestFor(ToPinMessage, toPinMessageActionMock, { isNot: false }, id);
    });

    it("should add a toPin function with correct values (isNot false)", async () => {
      initExpectMatch().toPin(messageId);
      await createDefaultTestFor(ToPinMessage, toPinMessageActionMock, { isNot: false }, messageId);
    });

    it("should add a toPin function with correct values (isNot false and channelId)", async () => {
      initExpectMatch().inChannel(channelId).toPin(messageId);
      await createDefaultTestFor(
        ToPinMessage,
        toPinMessageActionMock,
        { isNot: false, channelId },
        messageId,
      );
    });

    it("should add a toPin function with correct values (isNot true)", async () => {
      initExpectMatch().not.toPin(messageId);
      await createDefaultTestFor(ToPinMessage, toPinMessageActionMock, { isNot: true }, messageId);
    });
  });

  describe("testing to unPinMessage", () => {
    const messageId = {
      id: "123",
    };

    it("should add a function to hasIsolatedTestFunctions after call toUnpin", async () => {
      initExpectMatch().toUnPin(messageId);
      expect(testCollector.hasIsolatedTestFunctions()).toBe(true);
    });

    it("should add a toUnpin function", async () => {
      initExpectMatch().toUnPin(messageId);
      await createToBeCalledTestFor(toUnpinMessageActionMock);
    });

    it("should add a toUnpin function with correct values using id", async () => {
      initExpectMatch().toUnPin(messageId);
      await createDefaultTestFor(
        ToUnPinMessage,
        toUnpinMessageActionMock,
        { isNot: false },
        messageId,
      );
    });

    it("should add a toUnpin function with correct values using id and channelId", async () => {
      initExpectMatch().inChannel(channelId).toUnPin(messageId);
      await createDefaultTestFor(
        ToUnPinMessage,
        toUnpinMessageActionMock,
        { isNot: false, channelId },
        messageId,
      );
    });

    it("should add a toUnpin function with correct values using string id", async () => {
      const id = "123121";
      initExpectMatch().toUnPin(id);
      await createDefaultTestFor(ToUnPinMessage, toUnpinMessageActionMock, { isNot: false }, id);
    });

    it("should add a toUnpin function with correct values (isNot false)", async () => {
      initExpectMatch().toUnPin(messageId);
      await createDefaultTestFor(
        ToUnPinMessage,
        toUnpinMessageActionMock,
        { isNot: false },
        messageId,
      );
    });

    it("should add a toUnpin function with correct values (isNot true)", async () => {
      initExpectMatch().not.toUnPin(messageId);
      await createDefaultTestFor(
        ToUnPinMessage,
        toUnpinMessageActionMock,
        { isNot: true },
        messageId,
      );
    });
  });

  describe("testing to toHaveResult", () => {
    it("should add a function to hasIsolatedTestFunctions after call toUnpin", async () => {
      initExpectMatch().toHaveResult();
      expect(testCollector.hasIsolatedTestFunctions()).toBe(true);
    });

    it("should add a toHaveResult function", async () => {
      initExpectMatch().toHaveResult();
      await createToBeCalledTestFor(toUnpinMessageActionMock);
    });

    it("should add a toHaveResult function with correct values using id", async () => {
      const call = _expect.toReturn("test");
      initExpectMatch().toHaveResult(call);
      await createDefaultTestFor(
        IToHaveResult,
        toHaveResultsActionMock,
        { isNot: false },
        expect.any(Function),
      );
    });

    it("should add a toHaveResult function with correct values (isNot true)", async () => {
      const call = _expect.toReturn("test");
      initExpectMatch().not.toHaveResult(call);
      await createDefaultTestFor(
        IToHaveResult,
        toHaveResultsActionMock,
        { isNot: true },
        expect.any(Function),
      );
    });
  });
});

function initExpectMatch(value?: any, channelId?: string) {
  return _expect(value ?? con, channelId);
}
