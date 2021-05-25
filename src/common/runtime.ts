import { IConfigOptions, ICordeBot, IMockInstance, TestFunctionType } from "../types";
import { Config } from "./config";
import { Client } from "discord.js";
import { CordeBot } from "../core/cordeBot";
import { ConfigError } from "../errors";
import { DEFAULT_TEST_TIMEOUT } from "../consts";
import { logger } from "../environment";

const Environment = {
  isUnityTest: process.env.ENV === "UNITY_TEST",
  isE2eTest: process.env.ENV === "E2E_TEST",
};

/**
 * @internal
 */
export class Runtime {
  get bot() {
    return this._bot;
  }

  get isTestEnv() {
    return this.environment.isE2eTest || this.environment.isUnityTest;
  }

  get environment() {
    return Environment;
  }

  get events() {
    return this.bot.events;
  }

  get configs() {
    return this._configs;
  }

  get cordeBotToken() {
    return this._configs.cordeBotToken;
  }

  get botTestId() {
    return this._configs.botTestId;
  }

  get silent() {
    return this._configs.silent;
  }

  get botToken() {
    return this._configs.botToken;
  }

  get channelId() {
    return this._configs.channelId;
  }

  get guildId() {
    return this._configs.guildId;
  }

  get timeout() {
    return this._configs.timeout ?? DEFAULT_TEST_TIMEOUT;
  }

  get botPrefix() {
    return this._configs.botPrefix;
  }

  get testMatches() {
    return this._configs.testMatches;
  }

  get modulePathIgnorePatterns() {
    return this._configs.modulePathIgnorePatterns;
  }

  constructor() {
    this._configs = new Config();
    this._mocks = [];
  }

  configFilePath!: string;
  files!: string[];

  private readonly _configs: Config;
  private _bot!: ICordeBot;
  private _mocks: Array<IMockInstance<any, any, any>>;

  setConfigs(_configs: Partial<IConfigOptions>, forceUpdate?: boolean) {
    if (!_configs) {
      throw new ConfigError("Invalid configs");
    }

    this._configs.setConfigs(_configs, forceUpdate);
  }

  /**
   * Shortcut for *bot.isLoggedIn*
   */
  isBotLoggedIn() {
    return this.bot && this.bot.isLoggedIn();
  }

  initBotFromConfigs() {
    this._bot = new CordeBot(
      this._configs.botPrefix,
      this._configs.guildId,
      this._configs.channelId,
      this._configs.botTestId,
      new Client(),
    );
  }

  /**
   * Shortcut for *bot.logout*
   */
  logoffBot() {
    if (this._bot) {
      this._bot.logout();
    }
  }

  printLoggerIfNotSilent() {
    if (!this.silent) {
      logger.printStacks();
    }
  }

  async loginBot(token: string) {
    return await this.bot.login(token);
  }

  injectBot(fn: TestFunctionType) {
    return fn(this.bot);
  }

  addMock(mock: IMockInstance<any, any, any>) {
    this._mocks.push(mock);
  }

  resetAllMocks() {
    this._mocks.forEach((mock) => mock.restore());
  }
}
