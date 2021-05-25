import chalk from "chalk";
import { ColorResolvable, Role } from "discord.js";
import { IRoleIdentifier, ITestReport } from "../../../types";
import { resolveColor, rgba, typeOf } from "../../../utils";
import { roleUtils } from "../../roleUtils";
import { IExpectTestBaseParams } from "../../../types";
import { ExpectTest } from "../expectTest";

/**
 * @internal
 */
export class ToSetRoleColor extends ExpectTest {
  constructor(params: IExpectTestBaseParams) {
    super({ ...params, testName: "toSetRoleColor" });
  }

  async action(
    color: ColorResolvable,
    roleIdentifier: string | IRoleIdentifier,
  ): Promise<ITestReport> {
    const identifier = roleUtils.getRoleData(roleIdentifier);
    const error = roleUtils.getErrorForUndefinedRoleData(identifier);

    if (error) {
      return this.createFailedTest(error);
    }

    if (!color) {
      return this.createReport(`toSetRoleColor: invalid color informed - '${typeOf(color)}'`);
    }

    const oldRole = await this.cordeBot.findRole(identifier);

    if (!oldRole) {
      return this.createFailedTest(roleUtils.validateRole(oldRole, identifier));
    }

    const numberColor = resolveColor(color);

    try {
      await this.sendCommandMessage();
    } catch (error) {
      return this.createFailedTest(error.message);
    }

    let role: Role;

    try {
      role = await this.cordeBot.events.onceRoleUpdateColor(identifier, this.timeout, this.guildId);
    } catch {
      if (this.isNot) {
        return this.createPassTest();
      }

      const resolvedExpectedColor = resolveColor(oldRole.color);
      const fromLabelColor = createChalkLabelFromColor(resolvedExpectedColor);
      const toLabelColor = createChalkLabelFromColor(numberColor);
      return this.createReport(
        `expected: change role color from ${fromLabelColor(
          resolvedExpectedColor,
        )} to ${toLabelColor(numberColor)}\n`,
        "received: the color was not changed",
      );
    }

    if (role.color === numberColor) {
      this.hasPassed = true;
    }

    this.invertHasPassedIfIsNot();

    if (this.hasPassed) {
      return this.createPassTest();
    }

    const fromLabel = createChalkLabelFromColor(oldRole.color);
    const toLabel = createChalkLabelFromColor(numberColor);
    return this.createReport(
      `expected: ${this.isNot ? "not " : ""}change role color from ${fromLabel(
        oldRole.color,
      )} to ${toLabel(numberColor)}\n`,
      `received: ${role.color}`,
    );
  }
}

function createChalkLabelFromColor(color: number) {
  const [r, g, b] = rgba(color);
  return chalk.rgb(r, g, b);
}
