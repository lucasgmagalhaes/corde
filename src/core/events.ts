import {
  Channel,
  Client,
  ClientEvents,
  Collection,
  Guild,
  GuildEmoji,
  GuildMember,
  Message,
  MessageReaction,
  PartialDMChannel,
  PartialGuildMember,
  PartialMessage,
  PartialUser,
  Presence,
  Role,
  Speaking,
  User,
  VoiceState,
} from "discord.js";
import { once } from "events";
import { DEFAULT_TEST_TIMEOUT } from "../consts";
import { IEmoji, IMessageIdentifier, IRoleIdentifier } from "../types";
import { deepEqual, executePromiseWithTimeout } from "../utils";
import { Validator } from "../utils";

export interface EventResume {
  count: number;
  index: number;
  nonce: string | undefined;
}

export interface SearchMessageReactionsOptions {
  emojis?: IEmoji[];
  messageIdentifier?: IMessageIdentifier;
  authorId?: string;
  timeout?: number;
  channelId?: string;
}

// https://gist.github.com/koad/316b265a91d933fd1b62dddfcc3ff584

/**
 * Encapsulation of Discord.js events.
 * @internal
 */
export class Events {
  protected readonly _client: Client;

  constructor(client: Client) {
    this._client = client;
  }

  /**
   * Emitted when the client becomes ready to start working.
   * @param fn Operation to be executed after client becomes ready.
   * @internal
   */
  onReady(fn: () => void): void {
    this._client.on("ready", fn);
  }

  /**
   * Emitted once the client becomes ready to start working.
   * @internal
   */
  async onceReady(): Promise<void> {
    await this._once<void>("ready");
    return;
  }

  /**
   * Emitted when a **bot** removes a emoji from a message.
   * @internal
   */
  onMessageReactionRemoveEmoji(fn: (reaction: MessageReaction) => void): void {
    this._client.on("messageReactionRemoveEmoji", fn);
  }

  /**
   * Emitted once a **bot** removes a emoji from a message.
   * @returns Reaction removed.
   * @internal
   */
  onceMessageReactionRemoveEmoji(): Promise<MessageReaction> {
    return this._once<MessageReaction>("messageReactionRemoveEmoji");
  }

  /**
   * Emitted when a channel is created.
   * @param fn function to receive the event.
   * @internal
   */
  onChannelCreate(fn: (channel: Channel) => void): void {
    this._client.on("channelCreate", fn);
  }

  /**
   * Emitted once a channel is created.
   * @returns Created channel.
   * @internal
   */
  onceChannelCreate(): Promise<Channel> {
    return this._once<Channel>("channelCreate");
  }

  /**
   * Emitted whenever a channel is deleted.
   * @param fn function to receive the deleted channel.
   * @internal
   */
  onChannelDelete(fn: (deletedChannel: Channel) => void): void {
    this._client.on("channelDelete", fn);
  }

  /**
   * Emitted once a channel is deleted.
   * @returns Deleted channel.
   * @internal
   */
  onceChannelDelete(): Promise<Channel> {
    return this._once<Channel>("channelDelete");
  }

  /**
   * Emitted whenever the pins of a channel are updated.
   * Due to the nature of the WebSocket event, not much information can be provided easily here -
   * you need to manually check the pins yourself.
   *
   * @param fn function to receive the channel and the time that it was updated.
   * @internal
   */
  onChannelPinsUpdate(fn: (channel: Channel, updateTime: Date) => void): void {
    this._client.on("channelPinsUpdate", fn);
  }

  /**
   * Emitted once the pins of a channel are updated.
   * Due to the nature of the WebSocket event, not much information can be provided easily here -
   * you need to manually check the pins yourself.
   *
   * @returns `Channel` and `date` of it's change.
   * @internal
   */
  async onceChannelPinsUpdate(): Promise<[Channel, Date]> {
    return this._once<[Channel, Date]>("channelPinsUpdate");
  }

  /**
   * Emitted whenever a channel is updated - e.g. name change, topic change.
   * @param fn function to receive the channel change
   * @internal
   */
  onChannelUpdate(fn: (oldChannel: Channel, newChannel: Channel) => void) {
    this._client.on("channelUpdate", fn);
  }

  /**
   * Emitted once a channel is updated - e.g. name change, topic change.
   * @returns `Old channel` and `new value` of the channel.
   * @internal
   */
  async onceChannelUpdate(): Promise<[Channel, Channel]> {
    return this._once<[Channel, Channel]>("channelUpdate");
  }

  /**
   * Emitted for general debugging information.
   * @param fn Function to handle debug info.
   * @internal
   */
  onDebug(fn: (arg: string) => void) {
    this._client.on("debug", fn);
  }

  /**
   * Emitted once for general debugging information.
   * @internal
   */
  async onceDebug(): Promise<string> {
    return await this._once<string>("debug");
  }

  /**
   * Emitted whenever a guild role is deleted.
   * @param fn function to receive the deleted role.
   * @internal
   */
  onRoleDelete(fn: (role: Role) => void): void {
    this._client.on("roleDelete", fn);
  }

  /**
   * Emitted once a guild role is deleted.
   * If `roleIdentifier` is informed, returns the deleted role that
   * match with `roleIdentifier` value, if not, returns the first role deleted.
   *
   * Waits for a determined timeout, rejecting this async function if reaches
   * the timeout value.
   *
   * @param roleIdentifier Identifiers of the role.
   * @param timeout Time that this functions should wait for a response.
   * @returns Deleted role.
   * @internal
   */
  onceRoleDelete(
    roleIdentifier?: IRoleIdentifier,
    timeout?: number,
    guildId?: string,
  ): Promise<Role> {
    const validator = new Validator<[Role]>();

    if (roleIdentifier) {
      validator.add((role) => this.roleMatchRoleData(roleIdentifier, role));
    }

    if (guildId) {
      validator.add((role) => role.guild.id === guildId);
    }

    return executePromiseWithTimeout((resolve) => {
      this.onRoleDelete((deletedRole) => {
        if (validator.isValid(deletedRole)) {
          resolve(deletedRole);
        }
      });
    }, timeout);
  }

  /**
   * Emitted whenever the client's WebSocket disconnects and will no longer attempt to reconnect.
   * @param fn function to receive the event.
   * @internal
   */
  onDisconnect(fn: (closeEvent: CloseEvent, code: number) => void): void {
    this._client.on("disconnect", fn);
  }

  /**
   * Emitted once the client's WebSocket disconnects and will no longer attempt to reconnect.
   * @returns Close event.
   * @internal
   */
  onceDisconnect(): Promise<[CloseEvent, number]> {
    return this._once<[CloseEvent, number]>("disconnect");
  }

  /**
   * Emitted whenever a custom emoji is created in a guild.
   * @param fn function to receive the created emoji.
   * @internal
   */
  onEmojiCreate(fn: (createdEmoji: GuildEmoji) => void): void {
    this._client.on("emojiCreate", fn);
  }

  /**
   * Emitted once a custom emoji is created in a guild.
   * @returns Created emoji.
   * @internal
   */
  onceEmojiCreate(): Promise<GuildEmoji> {
    return this._once<GuildEmoji>("emojiCreate");
  }

  /**
   * Emitted whenever a custom guild emoji is deleted.
   * @param fn function to receive the deleted emoji.
   * @internal
   */
  onEmojiDelete(fn: (emojiDeleted: GuildEmoji) => void): void {
    this._client.on("emojiDelete", fn);
  }

  /**
   * Emitted once a custom guild emoji is deleted.
   * @returns The emoji that was deleted.
   * @internal
   */
  onceEmojiDelete(): Promise<GuildEmoji> {
    return this._once<GuildEmoji>("emojiDelete");
  }

  /**
   * Emitted whenever a custom guild emoji is updated.
   * @param fn function to receice the old and the new value of the emoji.
   * @internal
   */
  onEmojiUpdate(fn: (oldEmoji: GuildEmoji, newEmoji: GuildEmoji) => void): void {
    this._client.on("emojiUpdate", fn);
  }

  /**
   * Emitted once a custom guild emoji is updated.
   * @returns `Old` and `new` role value.
   * @internal
   */
  onceEmojiUpdate(): Promise<[GuildEmoji, GuildEmoji]> {
    return this._once<[GuildEmoji, GuildEmoji]>("emojiUpdate");
  }

  /**
   * Emitted whenever the client's WebSocket encounters a connection error.
   * @param fn function to receive the error.
   * @internal
   */
  onError(fn: (error: Error) => void): void {
    this._client.on("error", fn);
  }

  /**
   * Emitted once the client's WebSocket encounters a connection error.
   * @return Found error.
   * @internal
   */
  onceError(): Promise<Error> {
    return this._once<Error>("error");
  }

  /**
   * Emitted whenever a member is banned from a guild.
   * @param fn function to receive the guild where the user was removed from,
   * and the user itself.
   * @internal
   */
  onGuildBan(fn: (guild: Guild, user: User) => void) {
    this._client.on("guildBanAdd", fn);
  }

  /**
   * Emitted once a member is banned from a guild.
   * @returns `guild` where the user was banned from, and the `user` itself
   * @internal
   */
  onceGuildBan() {
    return this._once<[Guild, User]>("guildBanAdd");
  }

  /**
   * Emitted whenever a member is unbanned from a guild.
   * @param fn function to receive the guild that the user was removed
   * from ban, and the user.
   * @internal
   */
  onGuildBanRemove(fn: (guild: Guild, user: User) => void) {
    this._client.on("guildBanRemove", fn);
  }

  /**
   * Emitted once a member is unbanned from a guild.
   * @returns the `guild` that the user was removed
   * from ban, and the `user`.
   * @internal
   */
  onceGuildBanRemove() {
    return this._once<[Guild, User]>("guildBanRemove");
  }

  /**
   * Emitted whenever the client joins a guild.
   * @param fn function to receive the created guild.
   * @internal
   */
  onGuildCreate(fn: (createdGuild: Guild) => void) {
    this._client.on("guildCreate", fn);
  }

  /**
   * Emitted once the client joins a guild.
   * @returns Created guild.
   * @internal
   */
  onceGuildCreate() {
    return this._once<Guild>("guildCreate");
  }

  /**
   * Emitted whenever a guild is deleted/left.
   * @param fn function to receive the deleted guild.
   * @internal
   */
  onGuildDelete(fn: (deletedGuild: Guild) => void) {
    this._client.on("guildDelete", fn);
  }

  /**
   * Emitted once a guild is deleted/left.
   * @returns Deleted guild.
   * @internal
   */
  onceGuildDelete() {
    return this._once<Guild>("guildDelete");
  }

  /**
   * Emitted whenever a user joins a guild.
   * @param fn function to receive the member who was added to guild.
   * @internal
   */
  onGuildMemberAdd(fn: (member: GuildMember) => void) {
    this._client.on("guildMemberAdd", fn);
  }

  /**
   * Emitted once a user joins a guild.
   * @returns Member who was added to guild.
   * @internal
   */
  onceGuildMemberAdd() {
    return this._once<GuildMember>("guildMemberAdd");
  }

  /**
   * Emitted whenever a member becomes available in a large guild.
   * @param fn function to receive the guild who is available.
   * @internal
   */
  onGuildMemberAvailable(fn: (member: GuildMember | PartialGuildMember) => void) {
    this._client.on("guildMemberAvailable", fn);
  }

  /**
   * Emitted once a member becomes available in a large guild.
   * @returns Guild who is available.
   * @internal
   */
  onceGuildMemberAvailable() {
    return this._once<GuildMember | PartialGuildMember>("guildMemberAvailable");
  }

  /**
   * Emitted whenever a member leaves a guild, or is kicked.
   * @param fn function to receive the member of guild who kicked.
   * @internal
   */
  onGuildMemberRemove(fn: (member: GuildMember | PartialGuildMember) => void) {
    this._client.on("guildMemberRemove", fn);
  }

  /**
   * Emitted once a member leaves a guild, or is kicked.
   * @returns Member of guild who kicked.
   * @internal
   */
  onceGuildMemberRemove() {
    return this._once<GuildMember | PartialGuildMember>("guildMemberRemove");
  }

  /**
   * Emitted whenever a chunk of guild members is received (all members come from the same guild).
   * @param fn function to receive the collection of members that the guild received.
   * @internal
   */
  onGuildMemberChunk(
    fn: (members: Collection<string, GuildMember>, guild: Guild, eventResume: EventResume) => void,
  ) {
    this._client.on("guildMembersChunk", fn);
  }

  /**
   * Emitted once a chunk of guild members is received (all members come from the same guild).
   * @returns The collection of members that the guild received.
   * @internal
   */
  onceGuildMemberChunk() {
    return this._once<[Collection<string, GuildMember>, Guild, EventResume]>("guildMembersChunk");
  }

  /**
   * Emitted whenever a guild member starts/stops speaking.
   * @param fn function to receive the guild's member who is speaking.
   * @internal
   */
  onGuildMemberSpeaking(
    fn: (member: GuildMember | PartialGuildMember, speaking: Readonly<Speaking>) => void,
  ): void {
    this._client.on("guildMemberSpeaking", fn);
  }

  /**
   * Emitted once a guild member starts/stops speaking.
   * @returns The guild's member who is speaking.
   * @internal
   */
  onceGuildMemberSpeaking() {
    return this._once<[GuildMember | PartialGuildMember, Readonly<Speaking>]>(
      "guildMemberSpeaking",
    );
  }

  /**
   * Emitted whenever a guild member changes - i.e. new role, removed role, nickname.
   * @param fn function to receive the old and the new value of the guild member.
   * @internal
   */
  onGuildMemberUpdate(
    fn: (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) => void,
  ) {
    this._client.on("guildMemberUpdate", fn);
  }

  /**
   * Emitted once a guild member changes - i.e. new role, removed role, nickname.
   * @returns Old and the new value of the guild member.
   * @internal
   */
  onceGuildMemberUpdate() {
    return this._once<[GuildMember | PartialGuildMember, GuildMember]>("guildMemberUpdate");
  }

  /**
   * Emitted whenever a guild becomes unavailable, likely due to a server outage.
   * @param fn function to receive the unvailable guild.
   * @internal
   */
  onGuildUnavailable(fn: (guild: Guild) => void) {
    this._client.on("guildUnavailable", fn);
  }

  /**
   * Emitted once a guild becomes unavailable, likely due to a server outage.
   * @returns Unvailable guild.
   * @internal
   */
  onceGuildUnavailable() {
    return this._once<Guild>("guildUnavailable");
  }

  /**
   * Emitted whenever a guild is updated - e.g. name change.
   * @param fn function to receive the old and new value of the updated guild.
   * @internal
   */
  onGuildUpdate(fn: (oldGuild: Guild, newGuild: Guild) => void) {
    this._client.on("guildUpdate", fn);
  }

  /**
   * Emitted once a guild is updated - e.g. name change.
   * @returns The old and new value of the updated guild.
   * @internal
   */
  onceGuildUpdate() {
    return this._once<[Guild, Guild]>("guildUpdate");
  }

  /**
   * Emitted whenever a message is created.
   * @param fn function to receive the created message.
   * @internal
   */
  onMessage(fn: (message: Message) => void) {
    this._client.on("message", fn);
  }

  /**
   * Emitted once a message is created.
   * @returns Created message.
   * @internal
   */
  onceMessage(authorId?: string, channelId?: string | null, timeout?: number) {
    const validator = new Validator<[Message]>();

    if (authorId) {
      validator.add((mgs) => mgs.author.id === authorId);
    }

    if (channelId) {
      validator.add((mgs) => mgs.channel.id === channelId);
    }

    return executePromiseWithTimeout<Message>((resolve) => {
      this.onMessage((message) => {
        if (validator.isValid(message)) {
          resolve(message);
        }
      });
    }, timeout);
  }

  /**
   * Emitted whenever a message is deleted.
   * @param fn function to receive the deleted message.
   * @internal
   */
  onMessageDelete(fn: (deletedMessage: Message | PartialMessage) => void) {
    this._client.on("messageDelete", fn);
  }

  /**
   * Emitted once a message is deleted.
   * @returns Deleted message.
   * @internal
   */
  onceMessageDelete() {
    return this._once<Message | PartialMessage>("messageDelete");
  }

  /**
   * Emitted whenever messages are deleted in bulk.
   * @param fn function to receive the collection of messages that
   * was deleted.
   * @internal
   */
  onMessageDeleteBulk(fn: (deletedMessages: Collection<string, Message | PartialMessage>) => void) {
    this._client.on("messageDeleteBulk", fn);
  }

  /**
   * Emitted once messages are deleted in bulk.
   * @returns Collection of messages that was deleted.
   * @internal
   */
  onceMessageDeleteBulk() {
    return this._once<Collection<string, Message | PartialMessage>>("messageDeleteBulk");
  }

  /**
   * Emitted whenever a reaction is added to a message.
   * @param fn function to receive the added reaction and it's author.
   * @internal
   */
  onMessageReactionAdd(fn: (addedReaction: MessageReaction, author: User | PartialUser) => void) {
    this._client.on("messageReactionAdd", fn);
  }

  /**
   * Emitted once a reaction is added to a message.
   * @returns Added reaction and it's author.
   * @internal
   */
  onceMessageReactionAdd() {
    return this._once<[MessageReaction, User | PartialUser]>("messageReactionAdd");
  }

  /**
   * @param filter
   * @returns A list of relation of reactions added and the author.
   * @internal
   */
  onceMessageReactionsAdd(filter?: SearchMessageReactionsOptions) {
    return this._onceMessageReactionUpdate("onMessageReactionAdd", filter);
  }

  /**
   * @param filter
   * @returns A list of relation of reactions removed and the author.
   * @internal
   */
  onceMessageReactionsRemove(filter?: SearchMessageReactionsOptions) {
    return this._onceMessageReactionUpdate("onMessageReactionRemoveEmoji", filter);
  }

  private _onceMessageReactionUpdate(
    event: "onMessageReactionAdd" | "onMessageReactionRemoveEmoji",
    filter?: SearchMessageReactionsOptions,
  ) {
    const { emojis, messageIdentifier, authorId, timeout, channelId } = filter ?? {};

    const validator = new Validator<[MessageReaction, User | PartialUser | void]>();

    if (emojis) {
      validator.add((reaction) =>
        emojis.some((e) => e.id === reaction.emoji.id || e.name === reaction.emoji.name),
      );
    }

    if (channelId) {
      validator.add((reaction) => reaction.message.channel.id === channelId);
    }

    if (messageIdentifier) {
      validator.add(
        ({ message }) =>
          message.id === messageIdentifier.id || message.content === messageIdentifier.content,
      );
    }

    if (authorId) {
      validator.add((_, author) => !author || author.id === authorId);
    }
    const response: [MessageReaction, User | PartialUser | void][] = [];
    return executePromiseWithTimeout<[MessageReaction, User | PartialUser | void][]>(
      (resolve) => {
        this[event]((reaction: MessageReaction, author: User | PartialUser | void) => {
          if (validator.isValid(reaction, author)) {
            response.push([reaction, author]);
          }

          if (!emojis && !authorId && !messageIdentifier) {
            resolve(response);
          }

          if (response.length === emojis?.length) {
            resolve(response);
          }
        });
      },
      timeout,
      response,
    );
  }

  /**
   * Emitted whenever a **user** remove a reaction from a message
   * @param fn function to receive the removed reaction and the author
   * of the remotion.
   * @internal
   */
  onMessageReactionRemove(
    fn: (removedReaction: MessageReaction, author: User | PartialUser) => void,
  ) {
    this._client.on("messageReactionRemove", fn);
  }

  /**
   * Emitted once a reaction is removed from a message.
   * @returns Removed reaction and the author of the remotion.
   * @internal
   */
  onceMessageReactionRemove() {
    return this._once<[MessageReaction, User | PartialUser]>("messageReactionRemove");
  }

  /**
   * Emitted whenever all reactions are removed from a message.
   * @param fn function to receive the message who had it's reactions
   * removed.
   * @internal
   */
  onMessageReactionRemoveAll(fn: (message: Message | PartialMessage) => void) {
    this._client.on("messageReactionRemoveAll", fn);
  }

  /**
   * Emitted whenever all reactions are removed from a message.
   * @param fn Message who had it's reactions removed.
   * @internal
   */
  onceMessageReactionRemoveAll() {
    return this._once<Message | PartialMessage>("messageReactionRemoveAll");
  }

  /**
   * Emitted whenever a message is updated - e.g. embed or content change.
   * @param fn function to receive the old and new value of a message.
   * @internal
   */
  onMessageUpdate(
    fn: (oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) => void,
  ) {
    this._client.on("messageUpdate", fn);
  }

  /**
   * Emitted once a message is updated - e.g. embed or content change.
   * @returns `Old` and `new` value of a message.
   * @internal
   */
  onceMessageUpdate() {
    return this._once<[Message | PartialMessage, Message | PartialMessage]>("messageUpdate");
  }

  /**
   * Emitted once a message is pinned
   *
   * @param messageIdentifier IIdentifier of the message
   * @param timeout timeout to wait
   * @returns The pinned message
   * @internal
   */
  onceMessagePinned(messageIdentifier?: IMessageIdentifier, timeout?: number, channelId?: string) {
    return this._onceMessageSetPinneble(
      (oldMessage, newMessage) => !(oldMessage.pinned as boolean) && (newMessage.pinned as boolean),
      messageIdentifier,
      timeout,
      channelId,
    );
  }

  /**
   * Emitted once a message is unPinned
   *
   * @param messageIdentifier IIdentifier of the message
   * @param timeout timeout to wait
   * @returns The pinned message
   * @internal
   */
  onceMessageUnPinned(
    messageIdentifier?: IMessageIdentifier,
    timeout?: number,
    channelId?: string,
  ) {
    return this._onceMessageSetPinneble(
      (oldMessage, newMessage) => (oldMessage.pinned as boolean) && !(newMessage.pinned as boolean),
      messageIdentifier,
      timeout,
      channelId,
    );
  }

  private _onceMessageSetPinneble(
    validation: (
      oldMessage: Message | PartialMessage,
      newMessage: Message | PartialMessage,
    ) => boolean,
    messageIdentifier?: IMessageIdentifier,
    timeout?: number,
    channelId?: string,
  ) {
    const validator = new Validator<[Message | PartialMessage, Message | PartialMessage]>();
    validator.add(validation);

    if (messageIdentifier) {
      validator.add(
        (oldMessage) =>
          oldMessage.id === messageIdentifier.id ||
          oldMessage.content === messageIdentifier.content,
      );
    }

    if (channelId) {
      validator.add((message) => message.channel.id === channelId);
    }

    return executePromiseWithTimeout<Message | PartialMessage>((resolve) => {
      this.onMessageUpdate((oldMessage, newMessage) => {
        if (validator.isValid(oldMessage, newMessage)) {
          resolve(newMessage);
        }
      });
    }, timeout);
  }

  /**
   * Emitted once a message with `id` x or `content` y, or its embed message has changed.
   *
   * @param messageIdentifier IIdentifier of the message
   * @param timeout time to wait for change
   * @returns A message who had his content changed
   * @internal
   */
  onceMessageContentOrEmbedChange(
    messageIdentifier?: IMessageIdentifier,
    timeout?: number,
    channelId?: string,
  ) {
    const validator = new Validator<[Message | PartialMessage, Message | PartialMessage]>();
    validator.add(
      (oldMessage, newMessage) =>
        oldMessage.content != newMessage.content ||
        this.messagesHasDifferentsEmbeds(oldMessage, newMessage),
    );

    if (messageIdentifier) {
      validator.add(
        (oldMessage) =>
          oldMessage.id === messageIdentifier.id ||
          oldMessage.content === messageIdentifier.content,
      );
    }

    if (channelId) {
      validator.add((message) => message.channel.id === channelId);
    }

    return executePromiseWithTimeout<Message | PartialMessage>((resolve) => {
      this.onMessageUpdate((oldMessage, newMessage) => {
        if (validator.isValid(oldMessage, newMessage)) {
          resolve(newMessage);
        }
      });
    }, timeout);
  }

  private messagesHasDifferentsEmbeds(
    oldMessage: Message | PartialMessage,
    newMessage: Message | PartialMessage,
  ) {
    return !deepEqual(oldMessage.embeds, newMessage.embeds);
  }

  /**
   * Emitted whenever a guild member's presence changes, or they change one of their details.
   * @param fn function to receive the old and new presence values.
   * @internal
   */
  onPresenceUpdate(fn: (oldMember: Presence | undefined, newMember: Presence) => void) {
    this._client.on("presenceUpdate", fn);
  }

  /**
   * Emitted once a guild member's presence changes, or they change one of their details.
   * @returns Old and new presence values.
   * @internal
   */
  oncePresenceUpdate() {
    return this._once<[Presence, Presence]>("presenceUpdate");
  }

  /**
   * Emitted whenever a role is created.
   * @param fn function to receive the created role.
   * @internal
   */
  onRoleCreate(fn: (createdRole: Role) => void) {
    this._client.on("roleCreate", fn);
  }

  /**
   * Emitted once a role is created.
   * @returns Created role.
   * @internal
   */
  onceRoleCreate() {
    return this._once<Role>("roleCreate");
  }

  /**
   * Emitted whenever a guild role is updated.
   * @param fn function to receive the old and the new role value.
   * @internal
   */
  onRoleUpdate(fn: (oldRole: Role, newRole: Role) => void) {
    this._client.on("roleUpdate", fn);
  }

  /**
   * Emitted once a guild role is updated.
   * @returns `old` and the `new` role value.
   * @internal
   */
  onceRoleUpdate() {
    return this._once<[Role, Role]>("roleUpdate");
  }

  /**
   * @internal
   */
  onceRoleRenamed(roleIdentifier?: IRoleIdentifier, timeout?: number, guildId?: string) {
    return this._onRoleUpdateWithTimeout(
      (oldRole, newRole) => oldRole.name !== newRole.name,
      timeout,
      roleIdentifier,
      guildId,
    );
  }

  /**
   * @internal
   */
  onceRolePositionUpdate(roleIdentifier?: IRoleIdentifier, timeout?: number, guildId?: string) {
    return this._onRoleUpdateWithTimeout(
      (oldRole, newRole) => oldRole.rawPosition !== newRole.rawPosition,
      timeout,
      roleIdentifier,
      guildId,
    );
  }

  /**
   * @internal
   */
  onceRoleUpdateColor(roleIdentifier?: IRoleIdentifier, timeout?: number, guildId?: string) {
    return this._onRoleUpdateWithTimeout(
      (oldRole, newRole) => oldRole.color !== newRole.color,
      timeout,
      roleIdentifier,
      guildId,
    );
  }

  /**
   * @internal
   */
  onceRoleHoistUpdate(roleIdentifier?: IRoleIdentifier, timeout?: number, guildId?: string) {
    return this._onRoleUpdateWithTimeout(
      (oldRole, newRole) => oldRole.hoist !== newRole.hoist,
      timeout,
      roleIdentifier,
      guildId,
    );
  }

  /**
   * @internal
   */
  onceRoleMentionableUpdate(roleIdentifier?: IRoleIdentifier, timeout?: number, guildId?: string) {
    return this._onRoleUpdateWithTimeout(
      (oldRole, newRole) => oldRole.mentionable !== newRole.mentionable,
      timeout,
      roleIdentifier,
      guildId,
    );
  }

  /**
   * Waits for changes in permission of a specific role.
   * @param roleIdentifier `id` or `name` to identify the role.
   * @returns Specified role that had his permissions updated.
   * @internal
   */
  onceRolePermissionUpdate(
    roleIdentifier: IRoleIdentifier,
    timeout = DEFAULT_TEST_TIMEOUT,
    guildId?: string,
  ) {
    const validator = new Validator<[Role, Role]>();

    validator.add((_, newRole) => this.roleMatchRoleData(roleIdentifier, newRole));

    if (guildId) {
      validator.add((newRole) => newRole.guild.id === guildId);
    }

    return executePromiseWithTimeout<Role>((resolve) => {
      this.onRoleUpdate((oldRole, newRole) => {
        if (validator.isValid(oldRole, newRole)) {
          resolve(newRole);
        }
      });
    }, timeout);
  }

  private roleMatchRoleData(roleIdentifier: IRoleIdentifier | undefined, role: Role) {
    return role.id === roleIdentifier?.id || role.name === roleIdentifier?.name;
  }

  private rolesPermissionsMatch(oldRole: Role, newRole: Role) {
    return oldRole.permissions.equals(newRole.permissions);
  }

  /**
   * Emitted whenever a user starts typing in a channel.
   * @param fn function to receive the channel (where) and the user (who)
   * is typing.
   * @internal
   */
  onTypingStart(fn: (channel: Channel | PartialDMChannel, user: User | PartialUser) => void) {
    this._client.on("typingStart", fn);
  }

  /**
   * Emitted once a user starts typing in a channel.
   * @returns `Channel` (where) and the `user` (who) is typing.
   * @internal
   */
  onceTypingStart() {
    return this._once<[Channel | PartialDMChannel, User | PartialUser]>("typingStart");
  }

  /**
   * Emitted whenever a user's details (e.g. username) are changed.
   * @param fn function to receive the old and the new value of the user.
   * @internal
   */
  onUserUpdate(fn: (oldUser: User | PartialUser, newUser: User) => void) {
    this._client.on("userUpdate", fn);
  }

  /**
   * Emitted once a user's details (e.g. username) are changed.
   * @returns `Old` and the `new` value of the user.
   * @internal
   */
  onceUserUpdate() {
    return this._once<[User | PartialUser, User]>("userUpdate");
  }

  /**
   * Emitted whenever a user changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
   * @param fn function to receive the old and the new voiceState value.
   * @internal
   */
  onVoiceStateUpdate(fn: (oldMember: VoiceState, newMember: VoiceState) => void) {
    this._client.on("voiceStateUpdate", fn);
  }

  /**
   * Emitted once a user changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
   * @returns `Old` and the `new` voiceState value.
   * @internal
   */
  onceVoiceStateUpdate() {
    return this._once<[VoiceState, VoiceState]>("voiceStateUpdate");
  }

  /**
   * Execute an event `once` returning it's response.
   * @param event event's name.
   * @internal
   */
  private async _once<T extends any>(event: keyof ClientEvents): Promise<T> {
    const response = await once(this._client, event);

    if (response.length === 1) {
      return response[0];
    }
    return response as unknown as T;
  }

  private _onRoleUpdateWithTimeout(
    comparable: (oldRole: Role, newRole: Role) => boolean,
    timeout?: number,
    roleIdentifier?: IRoleIdentifier,
    guildId?: string,
  ) {
    const validator = new Validator<[Role, Role]>();

    validator.add((oldRole, newRole) => comparable(oldRole, newRole));

    if (roleIdentifier) {
      validator.add((_, newRole) => this.roleMatchRoleData(roleIdentifier, newRole));
    }

    if (guildId) {
      validator.add((role) => role.guild.id === guildId);
    }

    return executePromiseWithTimeout<Role>((resolve) => {
      this.onRoleUpdate((oldRole, newRole) => {
        if (validator.isValid(oldRole, newRole)) {
          resolve(newRole);
        }
      });
    }, timeout);
  }
}
