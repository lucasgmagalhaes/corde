import { createHero } from "../commands/create";
import { profile } from "../commands/profile";
import * as Discord from "discord.js";

import { deletehero } from "../commands/delete";
import { reset } from "../commands/reset";
import { xp } from "../commands/xp";

import { gold } from "../commands/gold";
import { explore } from "../commands/explore";
import { PREFIX } from "./global";
import { train } from "../commands/train";
import { status } from "../commands/status";
import { back } from "../commands/back";
import { shop } from "../commands/shop";
import { hp } from "../commands/hp";
import { buy } from "../commands/buy";
import { help } from "../commands/help";
import { inventory } from "../commands/inventory";
import { sell } from "../commands/sell";
import { hello } from "../commands/hello";

/**
 * Receives a message, treating it and sending to the right method
 * @param msg message sent by Discord
 */
export function commandHandler(msg: Discord.Message) {
  const args = msg.content.slice(PREFIX.length).trim().split(/ +/g);

  const command = args[0].toLowerCase();

  if (command === "create" || command === "c") createHero(msg);
  else if (command === "profile" || command === "p") profile(msg);
  else if (command === "delete" || command === "d") deletehero(msg);
  else if (command === "reset" || command === "r") reset(msg);
  else if (command === "buy") buy(msg, args[1]);
  else if (command === "shop") shop(msg, args[1]);
  else if (command === "experience" || command === "exp" || command === "xp") xp(msg);
  else if (command === "gold" || command === "g" || command === "money") gold(msg);
  else if (command === "explore" || command === "e") explore(msg, +args[1]);
  else if (command === "train" || command == "t") train(msg, args[1]);
  else if (command === "status" || command === "s") status(msg);
  else if (command === "back" || command === "b") back(msg);
  else if (command === "hp" || command === "life" || command === "h") hp(msg);
  else if (command === "help") help(msg);
  else if (command === "inventory") inventory(msg);
  else if (command === "sell") sell(msg, args[1]);
  else if (command === "hi" || command === "hello" || command === "greetings") hello(msg);
  else msg.reply(" I didn't understand what do you mean");
}
