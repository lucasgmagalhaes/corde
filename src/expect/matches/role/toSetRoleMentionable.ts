import { Role } from "discord.js";
import { IRoleIdentifier, ITestReport } from "../../../types";
import { typeOf } from "../../../utils";
import { roleUtils } from "../../roleUtils";
import { IExpectTestBaseParams } from "../../../types";
import { ExpectTest } from "../expectTest";

/**
 * @internal
 */
export class ToSetRoleMentionable extends ExpectTest {
  constructor(params: IExpectTestBaseParams) {
    super({ ...params, testName: "toSetRoleMentionable" });
  }

  async action(
    mentionable: boolean,
    roleIdentifier: string | IRoleIdentifier,
  ): Promise<ITestReport> {
    const identifier = roleUtils.getRoleData(roleIdentifier);
    const error = roleUtils.getErrorForUndefinedRoleData(identifier);

    if (error) {
      return this.createFailedTest(error);
    }

    if (mentionable == undefined) {
      return this.createReport(
        "expected: mentionable option to be true or false\n",
        `received: ${typeOf(mentionable)}`,
      );
    }

    if (typeof mentionable !== "boolean") {
      return this.createReport(
        "expected: mentionable parameter to be of boolean type\n",
        `received: ${typeOf(mentionable)}`,
      );
    }

    const oldRole = await this.cordeBot.findRole(identifier);
    const invalidRoleErrorMessage = roleUtils.validateRole(oldRole, identifier);

    if (invalidRoleErrorMessage) {
      return this.createFailedTest(invalidRoleErrorMessage);
    }

    try {
      await this.sendCommandMessage();
    } catch (error) {
      return this.createFailedTest(error.message);
    }

    let role: Role;
    try {
      role = await this.cordeBot.events.onceRoleMentionableUpdate(
        identifier,
        this.timeout,
        this.guildId,
      );
    } catch {
      if (this.isNot) {
        return this.createPassTest();
      }

      return this.createReport(
        `expected: mentionable to be ${mentionable}\n`,
        "received: role mentionable was not updated",
      );
    }
    if (role.mentionable === mentionable) {
      this.hasPassed = true;
    }

    this.invertHasPassedIfIsNot();

    if (this.hasPassed) {
      return this.createPassTest();
    }

    return this.createReport(
      `expected: mentionable to ${this.isNot ? "not " : ""}be ${mentionable}\n`,
      `received: ${role.mentionable}`,
    );
  }
}
