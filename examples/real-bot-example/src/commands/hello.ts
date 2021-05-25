import * as Discord from "discord.js";
import { randomNumber } from "../utils/random";

/**
 * Greets the user
 * @since 0.2
 * @param msg Discord last message related to the command
 */
export function hello(msg: Discord.Message) {
  const simpleGreetins: string[] = ["Hello", "Hi!!", "Hi there", "Hey Ooh", "Hey"];

  const greetingTimeMorning: string[] = [
    "Good Morning!",
    "Morning, sun shine",
    "Hi man. It's a wonderfull morning to hunt some monsters. Don't you think ?",
    "Hello my friend. Take some breakfast and let's kill some monsters",
  ];

  const greetingTimeAfternoon: string[] = [
    "Good afternoon!",
    "Good afternoon young master",
    "Happy afternoon",
  ];

  const greetingTimeNight: string[] = ["Good evining", "What a beautifull night, hum ?"];

  const greetingTimeDawn: string[] = ["Hello my young. What are you doing up so late ?"];

  // if will be a simples greet or a specific one
  const greet = randomNumber(1, 2);

  if (greet === 1) {
    msg.channel.send(simpleGreetins[randomNumber(0, simpleGreetins.length - 1)]);
  } // Morning
  else {
    const messageCreatedHour = new Date(msg.createdTimestamp).getHours();

    if (messageCreatedHour >= 6 && messageCreatedHour <= 12) {
      msg.channel.send(greetingTimeMorning[randomNumber(0, greetingTimeMorning.length - 1)]);
    } // Afternoon
    else if (messageCreatedHour >= 13 && messageCreatedHour <= 17) {
      msg.channel.send(greetingTimeAfternoon[randomNumber(0, greetingTimeAfternoon.length - 1)]);
    } // Night
    else if (messageCreatedHour >= 18 && messageCreatedHour <= 23) {
      msg.channel.send(greetingTimeNight[randomNumber(0, greetingTimeNight.length - 1)]);
    } // Dawn
    else if (messageCreatedHour >= 0 && messageCreatedHour <= 5) {
      msg.channel.send(greetingTimeDawn[randomNumber(0, greetingTimeDawn.length - 1)]);
    }
  }
}
