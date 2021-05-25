import { IRoleIdentifier } from "../types";
import { Role } from "discord.js";
import { CordeClientError } from "../errors";
import { CordeRole } from "../structures/cordeRole";
import { runtime } from "../environment";

/**
 * Finds a role in config guild's cache, basing on it's **id**
 *
 * @param id Id of the role.
 * @throws CordeClientError if corde's bot is not connected.
 * @returns Role that matches the provided **id** or **name**
 */
export function getRole(id: string): CordeRole | undefined;
/**
 * Finds a role in config guild's cache, basing on it's **id** or **name**.
 *
 * @param data Data of the role. It can be it's **name** or **id**.
 *
 * if both informations be provided, and they are from two differents
 * roles, the result will correspond to the role that matchs with the parameter
 * **id**.
 *
 * @throws CordeClientError if corde's bot is not connected.
 * @returns Role that matches the provided **id** or **name**
 */
export function getRole(data: IRoleIdentifier): CordeRole | undefined;
export function getRole(data: string | IRoleIdentifier) {
  if (!runtime.isBotLoggedIn()) {
    throw new CordeClientError("Bot is not connected yet. No role can be searched");
  }

  const _role = _getRole(data);
  if (_role) {
    return convertToCordeRole(_role);
  }
  return undefined;
}

function _getRole(data: string | IRoleIdentifier) {
  if (typeof data === "string") {
    return runtime.bot.getRoles().find((r) => r.id === data);
  }
  return runtime.bot.getRoles().find((r) => r.id === data.id || r.name === data.name);
}

function convertToCordeRole(role: Role) {
  if (role) {
    return new CordeRole(role);
  }
  return undefined;
}
