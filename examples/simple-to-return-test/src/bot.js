/* eslint-disable @typescript-eslint/no-var-requires */
const { Client } = require("discord.js");
const config = require("../corde.config.js");

const bot = new Client();

/**
 * Use this functions before use sendMessage (add it to **corde.beforeStart**)
 */
async function login() {
  const readyPromise = new Promise((resolve) => {
    bot.once("ready", () => {
      resolve();
    });
  });
  await bot.login(config.botToken);
  await readyPromise;
}

bot.on("message", async (message) => {
  try {
    const args = message.content.slice(config.botPrefix.length).trim().split(" ");
    const command = args.shift();
    await handleCommands(message, command, args);
  } catch (error) {
    console.error(error);
    throw new Error("Could not execute operation");
  }
});

/**
 * @param {Message} message
 * @param {string} command
 */
async function handleCommands(message, command) {
  if (command === "ping") {
    await ping(message);
  }
}

/**
 * @param {Message} msg
 * @param {string} msgId
 */
async function ping(msg) {
  await msg.channel.send("pong");
}

exports.login = login;
