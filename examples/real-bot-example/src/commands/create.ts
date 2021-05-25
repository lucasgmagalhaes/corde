import * as Discord from "discord.js";
import { getHeroRepository } from "../utils/repositoryHandler";
import { HeroRepository } from "../repositories/heroRepository";
import { EmojiPeople } from "../enums/emojis";

/**
 * Create a new user selecting a name and a class for him.
 * @since 0.1
 * @param msg Discord last message related to the command
 */
export async function createHero(msg: Discord.Message) {
  let heroRepository: HeroRepository;

  try {
    heroRepository = getHeroRepository();
  } catch (error) {
    msg.channel.send(error);
    return;
  }

  // First check if the user already have an hero
  const hero = await heroRepository.findbyId(msg.author.id);

  if (hero) {
    msg.channel.send("You already have a hero created called `" + hero.name + "`");
    return;
  }

  // If haven't, ask for hero's name
  await msg.channel.send("What is your hero name ?");

  // The user has 10 seconds to answer before creation procedure be canceled
  const getName = await msg.channel.awaitMessages(
    (responseName) => responseName.author.id === msg.author.id,
    {
      max: 1,
      time: 10000,
      errors: ["time"],
    },
  );

  const heroName = getName.first().content;

  if (heroName === undefined || heroName.trim() === "") {
    msg.channel.send(
      "You can not create a hero without name " + EmojiPeople["😰"] + " I know that you exists",
    );
    return;
  }

  try {
    await heroRepository.createhero(heroName, Number.parseInt(msg.author.id));
    msg.channel.send("Welcome to the game " + heroName + "!");
  } catch (error) {
    console.log("Fail at hero creation. Error: " + error);
    msg.channel.send("Wasn't possible to create your hero");
  }
}
