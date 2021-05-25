import * as Discord from "discord.js";
import { getHeroRepository } from "../utils/repositoryHandler";
import { InventoryEquip } from "../entity/inventoryEquip";

/**
 * Inform the situation of the hero in his exploration or trainning
 * @since 0.2
 * @param msg Discord last message related to the command
 */
export async function sell(msg: Discord.Message, itemID: string) {
  try {
    const heroRepository = getHeroRepository();
    const hero = await heroRepository.findbyId(msg.author.id);

    if (hero === null) {
      msg.channel.send("Create a hero before check his `status`");
      return;
    } else if (itemID !== "" && itemID !== null && itemID !== undefined) {
      const inventoryItens = await hero.inventoryItens;

      const itemToSell: InventoryEquip = inventoryItens.find(
        (itemInventory) => itemInventory.id == Number.parseInt(itemID),
      );

      const equiptoSell = await itemToSell.equip;

      if (itemToSell !== undefined) {
        await msg.channel.send(
          "Are you sure that want to sell " +
            equiptoSell.name +
            " for $" +
            equiptoSell.price +
            " ?",
        );

        try {
          const response = await msg.channel.awaitMessages(
            (responseName) => responseName.author.id === msg.author.id,
            {
              max: 1,
              time: 10000,
              errors: ["time"],
            },
          );

          const ans = response.first().content.toLocaleLowerCase().trim();

          if (ans === "yes" || ans === "y") {
            hero.gold += equiptoSell.price;
            const index = inventoryItens.indexOf(itemToSell, 0);

            if (index > -1) {
              inventoryItens.splice(index, 1);
            }

            try {
              await heroRepository.updateHero(hero);
              msg.channel.send("Item sold! Your current gold is $" + hero.gold);
            } catch (error) {
              console.log(error);
              msg.channel.send(error);
            }
          } else {
            msg.channel.send("Hmm. Ok then");
          }
        } catch (error) {
          console.log("User dot not respond sell command. Output: " + error);
        }
      }
    } else {
      msg.channel.send("You do not choose a item to sell");
    }
  } catch (error) {
    msg.channel.send(error);
  }
}
