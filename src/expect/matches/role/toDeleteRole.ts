import { Role } from "discord.js";
import { IRoleIdentifier, ITestReport } from "../../../types";
import { roleUtils } from "../../roleUtils";
import { IExpectTestBaseParams } from "../../../types";
import { ExpectTest } from "../expectTest";

/**
 * @internal
 */
export class ToDeleteRole extends ExpectTest {
  constructor(params: IExpectTestBaseParams) {
    super({ ...params, testName: "toDeleteRole" });
  }

  async action(roleIdentifier: string | IRoleIdentifier): Promise<ITestReport> {
    const identifier = roleUtils.getRoleData(roleIdentifier);
    const roleOrFailObject = await this.getRoleOrInvalidMessage(identifier);

    if ((roleOrFailObject as ITestReport).message) {
      return roleOrFailObject as ITestReport;
    }

    const role = roleOrFailObject as Role;

    try {
      await this.sendCommandMessage();
    } catch (error) {
      return this.createFailedTest(error.message);
    }

    try {
      await this.cordeBot.events.onceRoleDelete(identifier, this.timeout, this.guildId);
    } catch {
      if (this.isNot) {
        return this.createPassTest();
      }

      return this.createReport(
        `timeout: role ${role.id} wasn't deleted in the expected time (${this.timeout})`,
      );
    }
    const deletedRole = await this.cordeBot.fetchRole(role.id);

    if (!deletedRole || deletedRole.deleted) {
      this.hasPassed = true;
    }

    this.invertHasPassedIfIsNot();

    if (this.hasPassed) {
      return this.createPassTest();
    }

    return this.createReport(`expected: role ${role.id} to ${this.isNot ? "not " : ""}be deleted`);
  }

  private async getRoleOrInvalidMessage(roleIdentifier: IRoleIdentifier) {
    const error = roleUtils.getErrorForUndefinedRoleData(roleIdentifier);

    if (error) {
      return this.createFailedTest(error);
    }

    const role = await this.cordeBot.findRole(roleIdentifier);

    if (!role) {
      return this.createFailedTest(roleUtils.validateRole(role, roleIdentifier));
    }

    if (role.deleted) {
      return this.createFailedTest(
        `expected: role ${role.id} not deleted\n`,
        `received: role was deleted before call the command '${this.command}'`,
      );
    }

    return role;
  }
}
