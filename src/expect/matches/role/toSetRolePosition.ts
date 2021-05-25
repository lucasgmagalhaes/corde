import { IRoleIdentifier, ITestReport } from "../../../types";
import { typeOf } from "../../../utils";
import { roleUtils } from "../../roleUtils";
import { IExpectTestBaseParams } from "../../../types";
import { ExpectTest } from "../expectTest";

/**
 * @internal
 */
export class ToSetRolePosition extends ExpectTest {
  constructor(params: IExpectTestBaseParams) {
    super({ ...params, testName: "toSetRolePosition" });
  }

  async action(
    newPosition: number,
    roleIdentifier: string | IRoleIdentifier,
  ): Promise<ITestReport> {
    const identifier = roleUtils.getRoleData(roleIdentifier);
    const error = roleUtils.getErrorForUndefinedRoleData(identifier);

    if (error) {
      return this.createFailedTest(error);
    }

    if (typeof newPosition !== "number") {
      return this.createReport(
        "expected: position option to be a number\n",
        `received: ${typeOf(newPosition)}`,
      );
    }

    const oldRole = await this.cordeBot.findRole(identifier);
    const invalidRoleErrorMessage = roleUtils.validateRole(oldRole, identifier);

    if (invalidRoleErrorMessage) {
      return this.createFailedTest(invalidRoleErrorMessage);
    }

    let role = await this.cordeBot.findRole(identifier);

    if (!role) {
      return this.createFailedTest("role not found");
    }

    const lastRole = this.cordeBot
      .getRoles()
      .sort((r1, r2) => r2.position - r1.position)
      .first();

    if (!lastRole) {
      return this.createReport("no roles were found");
    }

    if (newPosition > lastRole.position) {
      return this.createReport(
        `expected: position to be >= 0 and <= ${lastRole.rawPosition} (max value possible)\n`,
        `received: ${newPosition}`,
      );
    }

    try {
      await this.sendCommandMessage();
    } catch (error) {
      return this.createFailedTest(error.message);
    }

    try {
      role = await this.cordeBot.events.onceRolePositionUpdate(
        identifier,
        this.timeout,
        this.guildId,
      );
    } catch {
      if (this.isNot) {
        return this.createPassTest();
      }

      return this.createReport(
        `expected: role position to change to ${newPosition}\n`,
        "received: position didn't change",
      );
    }

    if (role?.position === newPosition) {
      this.hasPassed = true;
    }

    this.invertHasPassedIfIsNot();

    if (this.hasPassed) {
      return this.createPassTest();
    }

    return this.createReport(
      `expected: role position to change to ${newPosition}\n`,
      `received: ${role?.rawPosition}`,
    );
  }
}
