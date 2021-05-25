import { ColorResolvable } from "discord.js";
import { testCollector } from "../common/testCollector";
import {
  IEmoji,
  IMessageIdentifier,
  IMessageEditedIdentifier,
  IMessageEmbed,
  Primitive,
  IRoleIdentifier,
  ITestReport,
  ICordeBot,
  TestFunctionType,
  IMessageMatches,
  IRoleMatches,
} from "../types";
import { Colors } from "../utils/colors";
import { RolePermission } from "../utils/permission";
import {
  ToAddReaction,
  ToDeleteRole,
  ToRenameRole,
  ToReturn,
  ToSetRoleColor,
  ToSetRoleHoist,
  ToSetRoleMentionable,
  ToSetRolePosition,
  ToEditMessage,
  ToPinMessage,
  ToRemoveReaction,
  ToUnPinMessage,
  ToSetRolePermission,
} from "./matches";
import { ExpectTest } from "./matches/expectTest";
import { buildReportMessage, resolveName, stringIsNullOrEmpty } from "../utils";
import { getStackTrace } from "../utils/getStackTrace";
import { IMacherContructorArgs, MayReturnMatch, IExpectTestBaseParams } from "../types";
import { IToHaveResult } from "./matches/toHaveResult";
import { runtime } from "../environment";

class BaseMatcher {
  protected _commandName: unknown;
  protected _isNot: boolean;
  protected _isCascade: boolean;
  protected _guildId?: string;
  protected _channelId?: string;
  protected _channelIdToSendCommand?: string;

  constructor({
    commandName,
    isNot,
    isCascade,
    channelId,
    guildId,
    channelIdToSendCommand,
  }: IMacherContructorArgs) {
    this._commandName = commandName;
    this._isNot = isNot ?? false;
    this._isCascade = isCascade ?? false;
    this._guildId = guildId;
    this._channelId = channelId;
    this._channelIdToSendCommand = channelIdToSendCommand;
  }

  // Trace can not me added inside operationFactory because it do,
  // it will get irrelevant data.

  protected async operationFactory<T extends ExpectTest>(
    trace: string,
    type: new (params: IExpectTestBaseParams) => T,
    cordeBot: ICordeBot,
    ...params: Parameters<T["action"]>
  ): Promise<ITestReport> {
    const commandName = await resolveName(this._commandName);

    const op = new type({
      cordeBot,
      command: commandName,
      isNot: this._isNot,
      timeout: runtime.timeout,
      isCascade: this._isCascade,
      guildId: this._guildId ?? runtime.guildId,
      channelId: this._channelId ?? runtime.channelId,
      channelIdToSendCommand: this._channelIdToSendCommand,
    });

    if (
      !this._isCascade &&
      (commandName == undefined ||
        (typeof commandName === "string" && stringIsNullOrEmpty(commandName)))
    ) {
      return {
        pass: false,
        message: buildReportMessage("command can not be null or an empty string"),
        testName: op.toString(),
      };
    }

    const report = await op.action(...params);

    if (!report) {
      return {
        pass: false,
        message: buildReportMessage("no report was provided by the test"),
        testName: op.toString(),
        trace,
      };
    }

    if (report.pass) {
      return report;
    }

    report.trace = trace;
    return report;
  }

  protected returnOrAddToCollector(testFunction: TestFunctionType): any {
    if (this._isCascade) {
      return testFunction;
    }

    return testCollector.addTestFunction(testFunction);
  }
}

export class MessageMatchesImpl<TReturn extends MayReturnMatch>
  extends BaseMatcher
  implements IMessageMatches<TReturn>
{
  toReturn(expect: Primitive | IMessageEmbed) {
    const trace = getStackTrace(undefined, true, "toReturn");
    return this.returnOrAddToCollector((cordeBot) =>
      this.operationFactory(trace, ToReturn, cordeBot, expect),
    );
  }

  toEditMessage(
    newValue: Primitive | IMessageEmbed,
    messageIdentifier?: IMessageEditedIdentifier | string,
  ) {
    const trace = getStackTrace(undefined, true, "toEditMessage");
    return this.returnOrAddToCollector((cordeBot) => {
      return this.operationFactory(trace, ToEditMessage, cordeBot, newValue, messageIdentifier);
    });
  }

  toPin(messageIdentifier: string | IMessageIdentifier) {
    const trace = getStackTrace(undefined, true, "toPin");
    return this.returnOrAddToCollector((cordeBot) => {
      return this.operationFactory(trace, ToPinMessage, cordeBot, messageIdentifier);
    });
  }

  toUnPin(messageIdentifier: string | IMessageIdentifier) {
    const trace = getStackTrace(undefined, true, "toUnPin");
    return this.returnOrAddToCollector((cordeBot) => {
      return this.operationFactory(trace, ToUnPinMessage, cordeBot, messageIdentifier);
    });
  }

  toAddReaction(
    emojis: string[] | IEmoji[] | (string | IEmoji)[],
    messageIdentifier?: string | IMessageIdentifier,
  ) {
    const trace = getStackTrace(undefined, true, "toAddReaction");
    return this.returnOrAddToCollector((cordeBot) =>
      this.operationFactory(trace, ToAddReaction, cordeBot, emojis, messageIdentifier),
    );
  }

  toRemoveReaction(
    emojis: string[] | IEmoji[] | (string | IEmoji)[],
    messageIdentifier?: string | IMessageIdentifier,
  ) {
    const trace = getStackTrace(undefined, true, "toRemoveReaction");
    return this.returnOrAddToCollector((cordeBot) =>
      this.operationFactory(trace, ToRemoveReaction, cordeBot, emojis, messageIdentifier),
    );
  }
}

export class ToHaveResultMatcher extends BaseMatcher {
  toHaveResult(...tests: TestFunctionType[]): void {
    const trace = getStackTrace(undefined, true, "todoInCascade");
    testCollector.addTestFunction((cordeBot) => {
      // Encapsulate the functions inside another so it do not be executed.
      const testEnhanced = tests.map((test) => () => test(cordeBot));
      return this.operationFactory(trace, IToHaveResult, cordeBot, ...testEnhanced);
    });
  }
}

export class RoleMatchesImpl<TReturn extends MayReturnMatch>
  extends BaseMatcher
  implements IRoleMatches<TReturn>
{
  toRenameRole(newName: string, roleIdentifier: IRoleIdentifier | string) {
    const trace = getStackTrace(undefined, true, "toRenameRole");
    return this.returnOrAddToCollector((cordeBot) => {
      return this.operationFactory(trace, ToRenameRole, cordeBot, newName, roleIdentifier);
    });
  }

  toSetRoleColor(color: ColorResolvable | Colors, roleIdentifier: string | IRoleIdentifier) {
    const trace = getStackTrace(undefined, true, "toSetRoleColor");
    return this.returnOrAddToCollector((cordeBot) => {
      return this.operationFactory(trace, ToSetRoleColor, cordeBot, color, roleIdentifier);
    });
  }

  toDeleteRole(roleIdentifier: string | IRoleIdentifier) {
    const trace = getStackTrace(undefined, true, "toDeleteRole");
    return this.returnOrAddToCollector((cordeBot) => {
      return this.operationFactory(trace, ToDeleteRole, cordeBot, roleIdentifier);
    });
  }

  toSetRoleMentionable(mentionable: boolean, roleIdentifier: string | IRoleIdentifier) {
    const trace = getStackTrace(undefined, true, "toSetRoleMentionable");
    return this.returnOrAddToCollector((cordeBot) => {
      return this.operationFactory(
        trace,
        ToSetRoleMentionable,
        cordeBot,
        mentionable,
        roleIdentifier,
      );
    });
  }

  toSetRoleHoist(hoist: boolean, roleIdentifier: string | IRoleIdentifier) {
    const trace = getStackTrace(undefined, true, "toSetRoleHoist");
    return this.returnOrAddToCollector((cordeBot) => {
      return this.operationFactory(trace, ToSetRoleHoist, cordeBot, hoist, roleIdentifier);
    });
  }

  toSetRolePosition(newPosition: number, roleIdentifier: string | IRoleIdentifier) {
    const trace = getStackTrace(undefined, true, "toSetRolePosition");
    return this.returnOrAddToCollector((cordeBot) => {
      return this.operationFactory(trace, ToSetRolePosition, cordeBot, newPosition, roleIdentifier);
    });
  }

  toSetRolePermission(roleIdentifier: string | IRoleIdentifier, ...permissions: RolePermission[]) {
    const trace = getStackTrace(undefined, true, "toSetRolePermission");
    return this.returnOrAddToCollector((cordeBot) => {
      return this.operationFactory(
        trace,
        ToSetRolePermission,
        cordeBot,
        roleIdentifier,
        permissions,
      );
    });
  }
}
