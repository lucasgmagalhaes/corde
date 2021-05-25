import * as Discord from "discord.js";

/**
 * Shows hero's total amount of life
 * @since 0.1
 * @param msg Discord last message related to the command
 */
export function help(msg: Discord.Message) {
  const textChannel = msg.channel as Discord.TextChannel;
  textChannel.send({
    embed: {
      color: 3447003,
      fields: [
        {
          name: "create",
          value: "Invoke hero creation where you define your class and name",
        },
        {
          name: "delete",
          value: "Removes your hero",
        },
        {
          name: "back",
          value: "Returns your hero from exploration or training",
        },
        {
          name: "buy",
          value: "Buy a equip from shop. You must call the `shop` first",
        },
        {
          name: "explore",
          value: "Send your hero to kill monsters. There you gain `xp` and `gold`",
        },
        {
          name: "gold",
          value: "Tells you the amount of gold your hero has",
        },
        {
          name: "hp",
          value: "Tells you the amount of Hp your hero has",
        },
        {
          name: "profile",
          value: "Shows hero's profile",
        },
        {
          name: "reset",
          value: "Restore all progress made by the hero as if you started the game right now",
        },
        {
          name: "shop",
          value: "Shows items to buy Sword / Shields",
        },
        {
          name: "status",
          value: "Informn how hero is going on explorarion / training",
        },
        {
          name: "train",
          value: "Send hero to train damage / shield",
        },
        {
          name: "xp",
          value: "Shows hero's xp",
        },
      ],
    },
  });
}
