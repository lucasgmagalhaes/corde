import { Message, MessageEmbed } from "discord.js";
import { runtime } from "../environment";
import { CordeClientError } from "../errors";

/**
 * Sends a message to the connected textChannel.
 *
 * **This function does not work without a test case**
 *
 * @param message Message to send
 *
 * @example
 *
 * // Works
 * test("test 1", () => {
 *    const message = await sendMessage("msg");
 *    expect(`editMessage ${message.id}`).toEditMessage({ id: message.id }, "newValue");
 * });
 *
 * // Do not Works
 * test("test 1", () => {
 *    const message = await sendMessage("msg");
 * });
 *
 * @throws CordeClienteError - If bot is not connected yet.
 *
 * @returns null if message is empty, null or undefined.
 * Message if **message** is not empty and it was send to Discord.
 *
 * @since 2.0
 */
export function sendMessage(message: string | number | MessageEmbed): Promise<Message> {
  if (!message) {
    throw new Error("Can not send a empty message");
  }

  if (!runtime.isBotLoggedIn) {
    throw new CordeClientError(
      "Can not send a directly message to channel because the client is not connected yet",
    );
  }

  return runtime.bot.sendMessage(message);
}
