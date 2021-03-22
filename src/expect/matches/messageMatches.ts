import { MessageEmbed } from "discord.js";
import { MessageData, MessageEmbedLike } from "../../types";

/**
 * Defines all functions that can be used
 * to check a bot reaction of a command.
 *
 */
export interface MessageMatches {
  /**
   * Defines the message expected to be returned by a
   * command.
   *
   * @param expect A message returned by a bot after invoke a command
   * @since 1.0
   */
  toReturn(expect: string): void;
  /**
   * Defines the message expected to be returned by a
   * command.
   *
   * @param expect A message returned by a bot after invoke a command
   * @since 1.0
   */
  toReturn(expect: number): void;
  /**
   * Defines the message expected to be returned by a
   * command.
   *
   * @param expect A message returned by a bot after invoke a command
   * @since 1.0
   */
  toReturn(expect: boolean): void;
  /**
   * Defines the message expected to be returned by a
   * command.
   *
   * @param expect A message returned by a bot after invoke a command
   * @since 1.0
   */
  toReturn(expect: bigint): void;
  /**
   * Defines the message expected to be returned by a
   * command.
   *
   * @param expect A message returned by a bot after invoke a command
   * @since 1.0
   *
   * @example
   *
   * ```javascript
   * {
   *  color: 3447003,
   *  author: {
   *    name: "Bot's",
   *    icon_url: "https://i.pinimg.com/originals/3b/97/82/3b9782bdf48463aa0118dabbf4eda6c4.jpg"
   *  },
   *  title: "This is an embed",
   *  url: "http://google.com",
   *  description: "This is a test embed to showcase what they look like and what they can do.",
   *  fields: [{
   *      name: "Fields",
   *      value: "They can have different fields with small headlines."
   *    },
   *    {
   *      name: "Masked links",
   *      value: "You can put [masked links](http://google.com) inside of rich embeds."
   *    },
   *    {
   *      name: "Markdown",
   *      value: "You can put all the *usual* **__Markdown__** inside of them."
   *    }
   *  ],
   *  timestamp: new Date(),
   *  footer: {
   *    icon_url: client.user.avatarURL,
   *    text: "© Example"
   *  }
   * }
   * ```
   *
   * @param expect
   */
  toReturn(expect: MessageEmbedLike): void;

  /**
   * Defines reactions that must be add to command message.
   *
   * @param reaction Single or list of reactions that must be added to an message
   *
   * @see For how to react message -> https://discordjs.guide/popular-topics/reactions.html#reacting-to-messages
   *
   * @example
   *
   *  bot.on('message', async (message) => {
   *    if (command === 'emoji') {
   *       msg.react('😄');
   *    } else if(command === 'emojis') {
   *       Promise.all([msg.react('😄'), msg.react('🍊')]);
   *    }
   *  });
   *
   *  Tests:
   *
   *  expect('emoji').toAddReaction('😄');
   *  expect('emojis').toAddReaction('😄', '🍊');
   *
   * @since 1.0
   */
  toAddReaction(...reaction: string[]): void;

  /**
   * Remove a list of reactions from a message.
   *
   * @param reactions Witch reactions will be removed.
   * @param message Values that will be used to find the message. **do not use all filters**, just one.
   * message ID is the main object used to filter, so, if all filters are filled, only ID will be considered.
   * @since 2.0
   */
  toRemoveReaction(reactions: string[]): void;
  toRemoveReaction(...reactions: string[]): void;
  toRemoveReaction(reactions: string, message: MessageData): void;
  toRemoveReaction(reactions: string[], message: MessageData): void;

  /**
   * Verify if a command pinned a message.
   *
   * @param message Data used for message fetch.
   * @since 2.0
   */
  toPin(messageId: string): void;
  toPin(message: MessageData): void;

  /**
   * Verify if a command unpinned a message.
   *
   * @param message Data used for message fetch.
   * @since 2.0
   */
  toUnPin(messageId: string): void;
  toUnPin(message: MessageData): void;

  /**
   * Verify if a command edited a message.
   *
   * @param message Message to be edited.
   * @param newValue New value for the message.
   * @since 1.0
   */
  toEditMessage(message: MessageData, newValue: string | MessageEmbed): void;
}