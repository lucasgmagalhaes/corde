import * as Discord from "discord.js";
import { PREFIX } from "../utils/global";
import { getHeroRepository } from "../utils/repositoryHandler";
import { HeroRepository } from "../repositories/heroRepository";

/**
 * Removes a user's hero
 * @since 0.1
 * @param msg Discord last message related to the command
 */
export async function deletehero(msg: Discord.Message) {
  let heroRepository: HeroRepository;
  try {
    heroRepository = getHeroRepository();
  } catch (error) {
    msg.channel.send(error);
    return;
  }

  const hero = await heroRepository
    .findbyId(msg.author.id)
    .catch((error) => msg.channel.send(error));

  if (hero === null) {
    msg.channel.send("You can not delete a hero being that you haven't one");
  } else {
    await msg.channel.send("Are you sure that want to delete your amazing character ?");

    const answer = await msg.channel.awaitMessages((answer) => msg.author.id === answer.author.id, {
      max: 1,
      time: 10000,
      errors: ["time"],
    });

    const ans = answer.first().content;

    if (ans.toLowerCase() === "yes" || ans.toLowerCase() === "y") {
      const userId = msg.author.id;

      try {
        await heroRepository.removeById(Number.parseInt(userId));
        msg.channel.send(
          `hero was removed with success. When you be ready to start again, tip ${PREFIX}create to make a new character`,
        );
      } catch (error) {
        msg.channel.send(error);
      }
    } else if (ans.toLowerCase() === "no" || ans.toLowerCase() === "n") {
      msg.channel.send("We're so happy that you don't give up :)");
    }
  }
}
