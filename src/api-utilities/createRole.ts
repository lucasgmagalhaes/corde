import { RoleData } from "discord.js";
import { runtime } from "../environment";
import { CordeClientError } from "../errors";
import { CordeRole } from "../structures/cordeRole";

/**
 * Creates a new role to the guild provided in configs.
 *
 * @param roleIdentifier Basic informations about the role.
 * @see https://corde.netlify.app/docs/configurations#guildid
 *
 * @throws CordeClientError if corde has not yet connect it's bot.
 * @returns A promise that return the created role.
 *
 * @since 2.1
 */
export async function createRole(data: RoleData) {
  if (!runtime.isBotLoggedIn()) {
    throw new CordeClientError("Bot is not connected yet. Can not create a role");
  }

  try {
    const createdRole = await runtime.bot.roleManager.create({ data });
    return new CordeRole(createdRole);
  } catch (error) {
    throw Error("Could not create the role. " + error);
  }
}
