import * as Discord from "discord.js";
import { createHero } from "../commands/create";

/**
 * Informs to user that his has no hero created yet and redirect
 * him to hero creation if he wants
 */
export class HeroNotExists extends Error {
  constructor(errorMessage: string, optionToCreateHero: boolean, discordMessage: Discord.Message) {
    super();
    if (optionToCreateHero) {
      discordMessage.channel.send(errorMessage).then(() => {
        discordMessage.channel
          .awaitMessages((answer) => discordMessage.author.id === answer.author.id, {
            max: 1,
            time: 10000,
            errors: ["time"],
          })
          .then((ans) => {
            const response = ans.first().content.trim().toLowerCase();
            // Redirect user to hero creation function
            if (response === "y" || response === "yes") {
              createHero(discordMessage);
            }
          });
      });
    } else {
      discordMessage.channel.send(errorMessage);
    }
  }
}
