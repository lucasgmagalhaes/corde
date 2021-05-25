import {
  Channel,
  Client,
  Collection,
  Guild,
  Message,
  MessageEmbed,
  Role,
  TextChannel,
} from "discord.js";
import { CordeClientError } from "../errors";
import { ICordeBot, IMessageIdentifier, IRoleIdentifier } from "../types";
import { Events } from "./events";

/**
 * Encapsulation of Discord Client with all specific
 * functions for corde test.
 */
export class CordeBot implements ICordeBot {
  readonly events: Events;
  private readonly _prefix: string;
  private readonly _guildId: string;
  private readonly _channelId: string;
  private readonly _testBotId: string;
  private readonly _client: Client;

  private textChannel!: TextChannel;
  private _isReady: boolean;
  /**
   * Starts new instance of Discord client with its events.
   *
   * @param prefix Corde bot prefix.
   * @param guildId Guild id where corde bot is located in.
   * @param channelId Channel id where corde bot is located in.
   * @param waitTimeOut Timeout for message wait.
   * @param testBotId id of testing bot.
   */
  constructor(
    prefix: string,
    guildId: string,
    channelId: string,
    testBotId: string,
    client: Client,
  ) {
    this.events = new Events(client);
    this._client = client;
    this._channelId = channelId;
    this._prefix = prefix;
    this._guildId = guildId;
    this._testBotId = testBotId;
    this.loadClientEvents();
    this._isReady = false;
  }

  get guild() {
    return this.textChannel.guild;
  }

  get roleManager() {
    return this.guild.roles;
  }

  get channel() {
    return this.textChannel;
  }

  get testBotId() {
    return this._testBotId;
  }

  /**
   * Authenticate Corde bot to the installed bot in Discord server.
   *
   * @param token Corde bot token
   *
   * @returns Promise resolve for success connection, or a promise
   * rejection with a formatted message if there was found a error in
   * connection attempt.
   */
  async login(token: string) {
    try {
      return await this._client.login(token);
    } catch (error) {
      return Promise.reject(this.buildLoginErrorMessage(token, error));
    }
  }

  /**
   * Destroy client connection.
   */
  logout() {
    this._client.destroy();
  }

  /**
   * Sends a pure message without prefix it.
   * @param message Data to be send to channel
   */
  async sendMessage(message: string | number | MessageEmbed) {
    return await this.textChannel.send(message);
  }

  /**
   * Send a message to a channel defined in configs.
   *
   * @see Runtime
   *
   * @param message Message without prefix that will be sent to defined server's channel
   * @description The message is concatenated with the stored **prefix** and is sent to the channel.
   *
   * @return Promise rejection if a testing bot does not send any message in the timeout value setted,
   * or a resolve for the promise with the message returned by the testing bot.
   */
  async sendTextMessage(message: string | number | boolean, channelId?: string): Promise<Message> {
    this.validateMessageAndChannel(message);
    const formattedMessage = this._prefix + message;

    if (channelId) {
      const channel = await this.findChannelById(channelId);

      if (!channel) {
        throw new Error(`Channel ${channelId} was not found`);
      }

      if (channel.isText()) {
        const returnedMessage = await channel.send(formattedMessage);
        return returnedMessage;
      }

      throw new Error("Can not send a message to a non text channel");
    }

    const returnedMessage = await this.textChannel.send(formattedMessage);
    return returnedMessage;
  }

  private async findChannelById(channelId: string) {
    const channel = this._client.channels.cache.get(channelId);

    if (channel) {
      return channel;
    }

    return await this._client.channels.fetch(channelId, true);
  }

  /**
   * Checks if corde bot is connected
   */
  isLoggedIn() {
    return !!this._client && !!this._client.readyAt && this._isReady;
  }

  async findMessage(filter: (message: Message) => boolean): Promise<Message | undefined>;
  async findMessage(data: IMessageIdentifier): Promise<Message | undefined>;
  async findMessage(
    data: IMessageIdentifier | ((message: Message) => boolean),
  ): Promise<Message | undefined> {
    const messageIdentifier: IMessageIdentifier = data as IMessageIdentifier;

    if (messageIdentifier && messageIdentifier.content) {
      return this._findMessage((m) => m.content === messageIdentifier.content);
    }
    if (messageIdentifier && messageIdentifier.id) {
      return this._findMessage((m) => m.id === messageIdentifier.id);
    }
    if (data) {
      return this._findMessage(data as (message: Message) => boolean);
    }
    return undefined;
  }

  async fetchRole(id: string): Promise<Role | null> {
    return await this.guild.roles.fetch(id, false, true);
  }

  async fetchRoles() {
    return await this.guild.roles.fetch();
  }

  async hasRole(roleIdentifier: IRoleIdentifier) {
    return !!(await this.findRole(roleIdentifier));
  }

  async findRole(roleIdentifier: IRoleIdentifier) {
    const data = await this.guild.roles.fetch();
    if (roleIdentifier.id) {
      return data.cache.find((r) => r.id === roleIdentifier.id);
    } else if (roleIdentifier.name) {
      return data.cache.find((r) => r.name === roleIdentifier.name);
    }
    return undefined;
  }

  getRoles() {
    return this.guild.roles.cache;
  }

  /**
   * Search for messages based in a filter query.
   */
  private async _findMessage(
    fn: (value: Message, key: string, collection: Collection<string, Message>) => boolean,
  ) {
    const collection = await this.textChannel.messages.fetch();
    if (collection) {
      return collection.find(fn);
    }
    return undefined;
  }

  /**
   * Get a channel based in the id stored in configs.
   *
   * @see Runtime
   */
  private loadChannel() {
    const guild = this.findGuild(this._guildId);
    const channel = this.findChannel(guild, this._channelId);
    this.textChannel = this.convertToTextChannel(channel);
  }

  private loadClientEvents() {
    this.events.onReady(() => {
      this._isReady = true;
      this.loadChannel();
    });
  }

  // Don't use `object` as a type. The `object` type is currently hard to use
  // ([see this issue](https://github.com/microsoft/TypeScript/issues/21732)).
  // Consider using `Record<string, unknown>` instead, as it allows you to more easily inspect and use the keys

  private buildLoginErrorMessage(token: string, error: Record<string, unknown>) {
    return `Error trying to login with token ${token}. \n` + error;
  }

  private validateMessageAndChannel(message: string | number | boolean) {
    if (!message) {
      throw new CordeClientError("No tests were declared");
    }

    if (!this.textChannel) {
      throw new CordeClientError("Channel not found");
    }
  }

  findGuild(guildId: string) {
    if (!guildId) {
      throw new CordeClientError("Guild id can not be undefined. Check your configs");
    }

    if (!this._client.guilds) {
      throw new CordeClientError(
        `corde bot isn't added in a guild. Please add it to the guild: ${guildId}`,
      );
    } else if (!this._client.guilds.cache.has(guildId)) {
      throw new CordeClientError(
        `Guild ${guildId} doesn't belong to corde bot. change the guild id ` +
          " in corde.config or add the bot to a valid guild",
      );
    } else {
      const guild = this._client.guilds.cache.find((_guild) => _guild.id === guildId);

      if (guild) {
        return guild;
      }

      const availableGuildsIds = this._client.guilds.cache.map(
        (guildAvailable) => guildAvailable.id,
      );
      throw new CordeClientError(
        `Could not find the guild ${guildId}.` +
          ` this client has connections with the following guilds: ${availableGuildsIds}`,
      );
    }
  }

  findChannel(guild: Guild, channelId: string) {
    if (!channelId) {
      throw new CordeClientError("channel id can not be undefined");
    }

    if (!guild.channels) {
      throw new CordeClientError(`Guild '${guild.name}' do not have any channel.`);
    } else if (!guild.channels.cache.has(channelId)) {
      throw new CordeClientError(
        `channel ${channelId} doesn't appear to be a channel of guild ${guild.name}`,
      );
    } else {
      const channel = guild.channels.cache.find((ch) => ch.id === channelId);

      if (channel === undefined) {
        throw new CordeClientError("There is no informed channel to start tests");
      }

      return channel;
    }
  }

  private convertToTextChannel(channel: Channel): TextChannel {
    return channel as TextChannel;
  }
}
