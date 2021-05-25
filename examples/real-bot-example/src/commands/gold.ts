import * as Discord from "discord.js";
import { getHeroRepository } from "../utils/repositoryHandler";

/**
 * Shows hero's total amount of gold
 * @since 0.1
 * @param msg Discord last message related to the command
 */
export async function gold(msg: Discord.Message) {
  try {
    const heroRepository = getHeroRepository();
    const hero = await heroRepository.findbyId(msg.author.id);

    if (hero !== null) {
      msg.channel.send("Your current gold is $" + hero.gold);
    }
  } catch (error) {
    msg.channel.send(error);
  }
}
