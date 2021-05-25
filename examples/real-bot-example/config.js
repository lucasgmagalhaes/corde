// Set the varibles for development environment
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

const superSecretDiscordToken = {
  token: process.env.DISCORD_TOKEN,
};

const dbConfig = {
  host: process.env.HOST,
  port: process.env.PORT,
  username: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const projectVersion = require("./package.json").version;

export { projectVersion, superSecretDiscordToken, dbConfig };
