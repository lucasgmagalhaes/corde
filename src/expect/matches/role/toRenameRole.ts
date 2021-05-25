import { Role } from "discord.js";
import { IRoleIdentifier, ITestReport } from "../../../types";
import { typeOf } from "../../../utils";
import { roleUtils } from "../../roleUtils";
import { IExpectTestBaseParams } from "../../../types";
import { ExpectTest } from "../expectTest";

/**
 * @internal
 */
export class ToRenameRole extends ExpectTest {
  constructor(params: IExpectTestBaseParams) {
    super({ ...params, testName: "toRenameRole" });
  }

  async action(newName: string, roleIdentifier: IRoleIdentifier | string): Promise<ITestReport> {
    const identifier = roleUtils.getRoleData(roleIdentifier);
    const error = roleUtils.getErrorForUndefinedRoleData(identifier);

    if (error) {
      return this.createFailedTest(error);
    }

    if (typeof newName !== "string" && typeof newName !== "number") {
      return this.createReport(
        "expected: parameter newName must be a string or a number\n",
        `received: ${typeOf(newName)}`,
      );
    }

    if (typeof newName === "string" && newName.trim() === "") {
      return this.createReport(
        "expected: parameter newName must be a valid string\n",
        `received: '${newName}'`,
      );
    }

    const oldRole = await this.cordeBot.findRole(identifier);

    if (!oldRole) {
      return this.createFailedTest(roleUtils.validateRole(oldRole, identifier));
    }

    try {
      await this.sendCommandMessage();
    } catch (error) {
      return this.createFailedTest(error.message);
    }

    let newRole: Role;
    try {
      newRole = await this.cordeBot.events.onceRoleRenamed(identifier, this.timeout, this.guildId);
    } catch {
      if (this.isNot) {
        return this.createPassTest();
      }

      return this.createReport(
        `expected: role '${oldRole.name}' to be renamed to ${newName}\n`,
        "received: name was not changed",
      );
    }

    if (newRole.name === newName) {
      this.hasPassed = true;
    }

    this.invertHasPassedIfIsNot();

    if (this.hasPassed) {
      return this.createPassTest();
    }

    return this.createReport(
      `expected: role ${this.isNot ? "not " : ""}change name to '${newName}'\n`,
      `received: name was not changed (actual: '${newRole.name}')`,
    );
  }
}
