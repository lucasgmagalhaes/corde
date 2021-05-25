/**
 *
 * ❤️❤️❤️ Thanks Discord.js https://discordjs.guide ❤️❤️❤️
 * Add bot link: https://discordapp.com/oauth2/authorize?client_id=<Bot_Client_ID>&scope=bot&permissions=0
 *
 */
import * as connections from "../config";
import * as Discord from "discord.js";
import { commandHandler } from "./utils/commandHandler";
import { PREFIX, reactionData } from "./utils/global";
import { reactionHandle } from "./commands/shop";
import { connect } from "../dbconn";

const client = new Discord.Client();

const events = {
  MESSAGE_REACTION_ADD: "messageReactionAdd",
  MESSAGE_REACTION_REMOVE: "messageReactionRemove",
};

// Tell the world that we're ready!!
client.on("ready", () => {
  console.log(`HeroBot is ready! ${client.user.tag} version: ${connections.projectVersion}`);
  client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
});

// Correspond to the receptor of all messages sent by the users in Discord
client.on("message", async (msg) => {
  // Ignoring others bots
  if (msg.author.bot) return;
  // Checking if the command has the prefix
  if (!msg.content.startsWith(PREFIX, 0)) return;

  commandHandler(msg);
});

client.on("guildCreate", (guild) => {
  // This event triggers when the bot joins a guild.
  console.log(
    `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`,
  );
  client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
});

client.on("guildDelete", (guild) => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
});

/**
 * listens for all client events and returns a set amount of data.
 * Response example:
 *
 * {
 *  t: 'MESSAGE_REACTION_ADD',
 *  s: 4,
 *  op: 0,
 *  d: {
 *      user_id: '208330347295932416',
 *      message_id: '396565776955342849',
 *      emoji: {
 *          name: '😄',
 *          id: null,
 *          animated: false
 *       },
 *      channel_id: '396535748360404994'
 *    }
 * }
 */
client.on("raw", async (event) => {
  // This will prevent from trying to build data that isn't relevant to that event.
  if (!events[event.t]) {
    return;
  } else if (reactionData.userId === null) {
    return;
  }
});

// Event that is called when user add a action of bot's message
// this event is used by heroBot to manage the display of data
client.on("messageReactionAdd", (reaction, user) => {
  console.log(`${user.username} reacted with "${reaction.emoji.name}".`);
  reactionHandle(reaction, user);
});

// Event that is called when user removes a action of bot's message
// this event is used by heroBot to manage the display of data
client.on("messageReactionRemove", (reaction, user) => {
  console.log(`${user.username} reacted with "${reaction.emoji.name}".`);
  reactionHandle(reaction, user);
});

connect()
  .then(() => {
    // Creates the connection with Discord using (wisping: a secret token. u.u)
    client.login(connections.superSecretDiscordToken.token);
  })
  .catch((error) => {
    if (error) {
      console.error(error);
    }
  });
