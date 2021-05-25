import { ExpectTest } from "../expectTest";
import { Role } from "discord.js";
import { IRoleIdentifier, ITestReport } from "../../../types";
import { roleUtils } from "../../roleUtils";
import { typeOf } from "../../../utils";
import { IExpectTestBaseParams } from "../../../types";

/**
 * @internal
 */
export class ToSetRoleHoist extends ExpectTest {
  constructor(params: IExpectTestBaseParams) {
    super({ ...params, testName: "toSetRoleHoist" });
  }

  async action(hoist: boolean, roleIdentifier: string | IRoleIdentifier): Promise<ITestReport> {
    const identifier = roleUtils.getRoleData(roleIdentifier);
    const error = roleUtils.getErrorForUndefinedRoleData(identifier);

    if (error) {
      return this.createFailedTest(error);
    }

    if (hoist == undefined) {
      return this.createReport(
        "expected: hoist option to be true or false\n",
        `received: ${typeOf(hoist)}`,
      );
    }

    if (typeof hoist !== "boolean") {
      return this.createReport(
        "expect: hoist parameter to be of boolean type\n",
        `received: ${typeOf(hoist)}`,
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
      role = await this.cordeBot.events.onceRoleHoistUpdate(identifier, this.timeout, this.guildId);
    } catch {
      if (this.isNot) {
        return this.createPassTest();
      }

      return this.createReport(
        `expected: hoist to be ${hoist}\n`,
        "received: role hoist was not updated",
      );
    }
    if (role.hoist === hoist) {
      this.hasPassed = true;
    }

    this.invertHasPassedIfIsNot();

    if (this.hasPassed) {
      return this.createPassTest();
    }

    return this.createReport(
      `expected: hoist to ${this.isNot ? "not " : ""}be ${hoist}\n`,
      `received: ${role.hoist}`,
    );
  }
}
