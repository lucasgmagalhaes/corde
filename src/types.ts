import {
  BitField,
  Collection,
  Guild,
  GuildChannel,
  Message,
  MessageEmbed,
  Role,
  RoleManager,
  TextChannel,
} from "discord.js";
import { Colors, ColorsHex, RolePermission } from "./utils";
import { EmbedFieldData } from "discord.js";
import { Stream } from "stream";
import { Events } from "./core/events";

export interface ITestReport {
  pass: boolean;
  testName: string;
  message?: string;
  trace?: string;
}

export interface IAuthor {
  icon_url: string;
  name: string;
  url: string;
}

export interface IField {
  name: string;
  inline: boolean;
  value: string;
}

export interface IImage {
  url: string;
}

export interface IThumbnail {
  url: string;
}

export interface IEmoji {
  id?: string;
  name?: string;
}

export interface IMinifiedEmbedMessage {
  author: IAuthor;
  color: number;
  description: string;
  fields: IField[];
  footer?: any;
  image: IImage;
  thumbnail: IThumbnail;
  timestamp?: any;
  title: string;
  type: string;
  url: string;
}

export interface IMessageIdentifier {
  /**
   * Text of a message, use it to find a message if you don't know
   * it's **id**.
   *
   * If there is more than one message with the same content,
   * Corde will handle the latest message sent.
   *
   * ps: To avoid possible inconsistencies, recommend using **id** for message search.
   */
  content?: string;
  /**
   * IIdentifier of the message
   */
  id?: string;
}

export interface IIdentifier {
  id?: string;
}

export interface IRoleIdentifier extends IIdentifier {
  name?: string;
}

/**
 * Contract with necessary functions of Discord.js Client
 */
export interface ICordeBot {
  readonly events: Events;
  readonly guild: Guild;
  readonly roleManager: RoleManager;
  readonly channel: TextChannel;
  readonly testBotId: string;
  /**
   * Authenticate Corde bot to the installed bot in the Discord server.
   *
   * @param token Corde bot token
   *
   * @returns Promise resolve for success connection, or a promise
   * rejection with a formatted message if there was found an error in
   * connection attempt.
   */
  login(token: string): Promise<string>;
  /**
   * Destroy client connection.
   */
  logout(): void;
  /**
   * Sends a pure message without prefix it.
   * @param message Data to be sent to channel
   */
  sendMessage(message: string | number | MessageEmbed): Promise<Message>;
  /**
   * Send a message to a channel defined in configs.
   *
   * @see Runtime
   *
   * @param message Message without prefix that will be sent to defined server's channel
   * @description The message is concatenated with the stored **prefix** and is sent to the channel.
   *
   * @return Promise rejection if a testing bot does not send any message in the timeout value set,
   * or resolve for the promise with the message returned by the testing bot.
   */
  sendTextMessage(message: string | number | boolean, channelId?: string): Promise<Message>;
  /**
   * Checks if corde bot is connected
   */
  isLoggedIn(): boolean;
  findMessage(filter: (message: Message) => boolean): Promise<Message | undefined>;
  findMessage(data: IMessageIdentifier): Promise<Message | undefined>;
  findMessage(
    data: IMessageIdentifier | ((message: Message) => boolean),
  ): Promise<Message | undefined>;
  fetchRoles(): Promise<RoleManager | null>;
  fetchRole(id: string): Promise<Role | null>;
  hasRole(roleIdentifier: IRoleIdentifier): Promise<boolean>;
  findRole(roleIdentifier: IRoleIdentifier): Promise<Role | undefined>;
  getRoles(): Collection<string, Role>;
  findGuild(guildId: string): Guild;
  findChannel(guild: Guild, channelId: string): GuildChannel;
}

export type VoidLikeFunction = (() => void) | (() => PromiseLike<void>) | (() => Promise<void>);
export type TestFunctionType = (cordeBot: ICordeBot) => Promise<ITestReport>;
export type MessageType = "text" | "embed";
export type MessageOutputType = Message | IMinifiedEmbedMessage;
export type MessageExpectationType = string | MessageEmbed;
export type GenericFunction = (...args: any[]) => any;
export type Primitive = number | string | boolean;
export type ResolveFunction<TResult> = (value: TResult) => void;
export type RejectFunction = (reason?: any) => void;
export type EmojisType = string[] | IEmoji[] | (string | IEmoji)[];

/**
 * Get all function `T` parameters as they may be
 * optional.
 */
export type ParametersAsOptional<T extends GenericFunction> = Parameters<T> | void[];

/**
 * Available types of config files
 */
export type ConfigFileType = "js" | "json" | "ts";

/**
 * Represents **command** structure
 */
export interface IAssertionProps {
  commandName: string;
  expectation: MessageExpectationType;
  usingTrueStatement: boolean;
  output?: MessageOutputType;
  MessageType: MessageType;
}

/**
 * Represents **test** structure
 */
export interface ITest {
  name?: string | number | boolean;
  subTests?: ITest[];
  testsFunctions: TestFunctionType[];
  testsReports?: ITestReport[];
}

/**
 * Represents **group** structure
 */
export interface IGroup {
  name?: string | number | boolean;
  subGroups?: IGroup[];
  tests: ITest[];
}

/**
 * Contain all test cases | groups of a test file.
 */
export interface ITestFile {
  path: string;
  groups: IGroup[];
  isEmpty: boolean;
}

export interface IBaseRole {
  name?: string;
  color?: ColorResolvable | Colors;
  isHoist?: boolean;
  position?: number;
  permissions?: RolePermission;
  isMentionable?: boolean;
}

export interface ICliConfigOptions extends IConfigOptions {
  config: string;
  files: string;
}

/**
 * Contains a set of properties needed for execution of corde
 */
export interface IConfigOptions {
  /**
   * Fake bot used to test the real one
   */
  cordeBotToken: string;
  /**
   * User's bot that will be tested
   */
  botTestId: string;
  /**
   * User's bot token that will run.
   */
  botToken: string;
  /**
   * Channel where tests will run
   */
  channelId: string;
  /**
   * Guild where tests will run
   */
  guildId: string;
  /**
   * Defines max amount of time that a command can run
   */
  timeout?: number;
  /**
   * Defines how to identify bot calls
   */
  botPrefix: string;
  /**
   * Path for case tests. Use this from the base directory of the application
   */
  testMatches: string[];
  /**
   * Defines if external console prints should be displayed
   */
  silent: boolean;
  /**
   * Definition of all paterns to ignore in tests search
   */
  modulePathIgnorePatterns?: string[];
}

export interface IJSONFile {
  $schema: string;
}

/**
 * Object contract used to identify messages in message edition tests.
 */
export interface IMessageEditedIdentifier {
  /**
   * IIdentifier of the message
   */
  id?: string;
  /**
   * Old content of the message to identify it.
   */
  oldContent?: string;
}

export interface ISemiRunnerReport {
  totalTests: number;
  totalEmptyTests: number;
  totalEmptyTestFiles: number;
  totalTestFiles: number;
  totalTestsPassed: number;
  totalTestsFailed: number;
  totalTestFilesPassed: number;
  totalTestFilesFailed: number;
}

export interface IRunnerReport extends ISemiRunnerReport {
  testTimer: string;
}

export interface IMessageEmbedAuthor {
  name?: string;
  url?: string;
  iconURL?: string;
}

export interface IMessageEmbedFooter {
  /**
   * footer text
   */
  text?: string;
  /**
   * URL of footer icon (only supports HTTP(s) and attachments)
   */
  iconURL?: string;
}

export interface IMessageEmbedImage {
  /**
   * source URL of the image (only supports HTTP(s) and attachments)
   */
  url: string;
  /**
   * Height of the image
   */
  height?: number;
  /**
   * width of the image
   */
  width?: number;
}

export interface IMessageEmbedThumbnail {
  /**
   * Url of the thumbnail
   */
  url: string;
  /**
   * Height of the thumbnail
   */
  height?: number;
  /**
   * width of the thumbnail
   */
  width?: number;
}

export interface IFile {
  /**
   * Buffer, URL, or stream of the file.
   *
   * @see https://nodejs.org/api/stream.html
   * @see https://nodejs.org/api/buffer.html
   */
  attachment: Buffer | string | Stream;
  /**
   * Name of the file
   */
  name: string;
}

/**
 * Main and optional information about an embedded message.
 */
export interface IMessageEmbed {
  /**
   * author name **or** information
   */
  author?: IMessageEmbedAuthor | string;
  /**
   * color code of the embed
   */
  color?: ColorResolvable;
  /**
   * description of embed
   */
  description?: string;
  /**
   * fields information. An array of embed field objects
   */
  fields?: EmbedFieldData[];
  /**
   * files URLs **or** information of the embed.
   */
  files?: (IFile | string)[];
  /**
   * Footer url **or** information
   */
  footer?: IMessageEmbedFooter | string;
  /**
   * IImage URL **or** information
   */
  image?: IMessageEmbedImage | string;
  /**
   * Source url of thumbnail (only supports HTTP(s) and attachments)
   */
  thumbnailUrl?: string;
  /**
   * Timestamp of embed content **or** a Date object
   */
  timestamp?: number | Date;
  /**
   * Title of embed
   */
  title?: string;
  /**
   * Url of embed
   */
  url?: string;
}

export type Base64Resolvable = Buffer | string;

export type VerificationLevelType = "NONE" | "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";

/**
 * @see https://discord.com/developers/docs/resources/guild#guild-object-verification-level
 */
export enum VerificationLevel {
  /**
   * Unrestricted
   */
  NONE = "NONE",
  /**
   * Must have verified email on account
   */
  LOW = "LOW",
  /**
   * Must be registered on Discord for longer than 5 minutes
   */
  MEDIUM = "MEDIUM",
  /**
   * Must be a member of the server for longer than 10 minutes
   */
  HIGH = "HIGH",
  /**
   * Must have a verified phone number
   */
  VERY_HIGH = "VERY_HIGH",
}

export type ColorResolvable =
  | "DEFAULT"
  | "WHITE"
  | "AQUA"
  | "GREEN"
  | "BLUE"
  | "YELLOW"
  | "PURPLE"
  | "LUMINOUS_VIVID_PINK"
  | "GOLD"
  | "ORANGE"
  | "RED"
  | "GREY"
  | "DARKER_GREY"
  | "NAVY"
  | "DARK_AQUA"
  | "DARK_GREEN"
  | "DARK_BLUE"
  | "DARK_PURPLE"
  | "DARK_VIVID_PINK"
  | "DARK_GOLD"
  | "DARK_ORANGE"
  | "DARK_RED"
  | "DARK_GREY"
  | "LIGHT_GREY"
  | "DARK_NAVY"
  | "BLURPLE"
  | "GREYPLE"
  | "DARK_BUT_NOT_BLACK"
  | "NOT_QUITE_BLACK"
  | "RANDOM"
  | [number, number, number]
  | number
  | ColorsHex
  | Colors
  | string;

export type ImageSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;
export type AllowedImageFormat = "webp" | "png" | "jpg" | "jpeg" | "gif";

/**
 * @see https://discord.com/developers/docs/resources/guild#guild-object-guild-features
 */
export type GuildFeaturesType =
  | "ANIMATED_ICON"
  | "BANNER"
  | "COMMERCE"
  | "COMMUNITY"
  | "DISCOVERABLE"
  | "FEATURABLE"
  | "INVITE_SPLASH"
  | "NEWS"
  | "PARTNERED"
  | "RELAY_ENABLED"
  | "VANITY_URL"
  | "VERIFIED"
  | "VIP_REGIONS"
  | "WELCOME_SCREEN_ENABLED";

/**
 * Defines Guild's features
 *
 * @see https://discord.com/developers/docs/resources/guild#guild-object-guild-features
 */
export enum GuildFeatures {
  /**
   * Guild has access to set an invite splash background
   */
  INVITE_SPLASH = "INVITE_SPLASH",
  /**
   * Guild has access to set 384kbps bitrate in voice (previously VIP voice servers)
   */
  VIP_REGIONS = "VIP_REGIONS",
  /**
   * Guild has access to set a vanity URL
   */
  VANITY_URL = "VANITY_URL",
  /**
   * Guild is verified
   */
  VERIFIED = "VERIFIED",
  /**
   * Guild is partnered
   */
  PARTNERED = "PARTNERED",
  /**
   * Guild can enable welcome screen, Membership Screening, and discovery, and receives community updates
   */
  COMMUNITY = "COMMUNITY",
  /**
   * Guild has access to use commerce features (i.e. create store channels)
   */
  COMMERCE = "COMMERCE",
  /**
   * Guild has access to create news channels
   */
  NEWS = "NEWS",
  /**
   * Guild can be discovered in the directory
   */
  DISCOVERABLE = "DISCOVERABLE",
  /**
   * Guild can be featured in the directory
   */
  FEATURABLE = "FEATURABLE",
  /**
   * Guild has access to set an animated guild icon
   */
  ANIMATED_ICON = "ANIMATED_ICON",
  /**
   * Guild has access to set a guild banner image
   */
  BANNER = "BANNER",
  /**
   * Guild has enabled the welcome screen
   */
  WELCOME_SCREEN_ENABLED = "WELCOME_SCREEN_ENABLED",
  /**
   * Guild has enabled [Membership Screening](https://discord.com/developers/docs/resources/guild#membership-screening-object)
   */
  MEMBER_VERIFICATION_GATE_ENABLED = "MEMBER_VERIFICATION_GATE_ENABLED",
  /**
   * Guild can be previewed before joining via Membership Screening or the directory
   */
  PREVIEW_ENABLED = "PREVIEW_ENABLED",
}

export type RecursiveReadonlyArray<T> = ReadonlyArray<T | RecursiveReadonlyArray<T>>;
export type SystemChannelFlagsString = "WELCOME_MESSAGE_DISABLED" | "BOOST_MESSAGE_DISABLED";
export type SystemChannelFlagsResolvable = BitFieldResolvable<SystemChannelFlagsString>;

export type BitFieldResolvable<T extends string> =
  | RecursiveReadonlyArray<T | number | Readonly<BitField<T>>>
  | T
  | number
  | Readonly<BitField<T>>;

export interface IImageURLOptions {
  format?: AllowedImageFormat;
  size?: ImageSize;
}

/**
 * System channel flags of Discord
 *
 * @see https://discord.com/developers/docs/resources/guild#guild-object-system-channel-flags
 */
export enum SystemChannelFlag {
  /**
   * Suppress member join notifications
   */
  SUPPRESS_JOIN_NOTIFICATIONS = "SUPPRESS_JOIN_NOTIFICATIONS",
  /**
   * Suppress server boost notifications
   */
  SUPPRESS_PREMIUM_SUBSCRIPTIONS = "SUPPRESS_PREMIUM_SUBSCRIPTIONS",
}

export type Locale =
  | "af-ZA"
  | "am-ET"
  | "ar-AE"
  | "ar-BH"
  | "ar-DZ"
  | "ar-EG"
  | "ar-IQ"
  | "ar-JO"
  | "ar-KW"
  | "ar-LB"
  | "ar-LY"
  | "ar-MA"
  | "arn-CL"
  | "ar-OM"
  | "ar-QA"
  | "ar-SA"
  | "ar-SY"
  | "ar-TN"
  | "ar-YE"
  | "as-IN"
  | "az-Cyrl-AZ"
  | "az-Latn-AZ"
  | "ba-RU"
  | "be-BY"
  | "bg-BG"
  | "bn-BD"
  | "bn-IN"
  | "bo-CN"
  | "br-FR"
  | "bs-Cyrl-BA"
  | "bs-Latn-BA"
  | "ca-ES"
  | "co-FR"
  | "cs-CZ"
  | "cy-GB"
  | "da-DK"
  | "de-AT"
  | "de-CH"
  | "de-DE"
  | "de-LI"
  | "de-LU"
  | "dsb-DE"
  | "dv-MV"
  | "el-GR"
  | "en-029"
  | "en-AU"
  | "en-BZ"
  | "en-CA"
  | "en-GB"
  | "en-IE"
  | "en-IN"
  | "en-JM"
  | "en-MY"
  | "en-NZ"
  | "en-PH"
  | "en-SG"
  | "en-TT"
  | "en-US"
  | "en-ZA"
  | "en-ZW"
  | "es-AR"
  | "es-BO"
  | "es-CL"
  | "es-CO"
  | "es-CR"
  | "es-DO"
  | "es-EC"
  | "es-ES"
  | "es-GT"
  | "es-HN"
  | "es-MX"
  | "es-NI"
  | "es-PA"
  | "es-PE"
  | "es-PR"
  | "es-PY"
  | "es-SV"
  | "es-US"
  | "es-UY"
  | "es-VE"
  | "et-EE"
  | "eu-ES"
  | "fa-IR"
  | "fi-FI"
  | "fil-PH"
  | "fo-FO"
  | "fr-BE"
  | "fr-CA"
  | "fr-CH"
  | "fr-FR"
  | "fr-LU"
  | "fr-MC"
  | "fy-NL"
  | "ga-IE"
  | "gd-GB"
  | "gl-ES"
  | "gsw-FR"
  | "gu-IN"
  | "ha-Latn-NG"
  | "he-IL"
  | "hi-IN"
  | "hr-BA"
  | "hr-HR"
  | "hsb-DE"
  | "hu-HU"
  | "hy-AM"
  | "id-ID"
  | "ig-NG"
  | "ii-CN"
  | "is-IS"
  | "it-CH"
  | "it-IT"
  | "iu-Cans-CA"
  | "iu-Latn-CA"
  | "ja-JP"
  | "ka-GE"
  | "kk-KZ"
  | "kl-GL"
  | "km-KH"
  | "kn-IN"
  | "kok-IN"
  | "ko-KR"
  | "ky-KG"
  | "lb-LU"
  | "lo-LA"
  | "lt-LT"
  | "lv-LV"
  | "mi-NZ"
  | "mk-MK"
  | "ml-IN"
  | "mn-MN"
  | "mn-Mong-CN"
  | "moh-CA"
  | "mr-IN"
  | "ms-BN"
  | "ms-MY"
  | "mt-MT"
  | "nb-NO"
  | "ne-NP"
  | "nl-BE"
  | "nl-NL"
  | "nn-NO"
  | "nso-ZA"
  | "oc-FR"
  | "or-IN"
  | "pa-IN"
  | "pl-PL"
  | "prs-AF"
  | "ps-AF"
  | "pt-BR"
  | "pt-PT"
  | "qut-GT"
  | "quz-BO"
  | "quz-EC"
  | "quz-PE"
  | "rm-CH"
  | "ro-RO"
  | "ru-RU"
  | "rw-RW"
  | "sah-RU"
  | "sa-IN"
  | "se-FI"
  | "se-NO"
  | "se-SE"
  | "si-LK"
  | "sk-SK"
  | "sl-SI"
  | "sma-NO"
  | "sma-SE"
  | "smj-NO"
  | "smj-SE"
  | "smn-FI"
  | "sms-FI"
  | "sq-AL"
  | "sr-Cyrl-BA"
  | "sr-Cyrl-CS"
  | "sr-Cyrl-ME"
  | "sr-Cyrl-RS"
  | "sr-Latn-BA"
  | "sr-Latn-CS"
  | "sr-Latn-ME"
  | "sr-Latn-RS"
  | "sv-FI"
  | "sv-SE"
  | "sw-KE"
  | "syr-SY"
  | "ta-IN"
  | "te-IN"
  | "tg-Cyrl-TJ"
  | "th-TH"
  | "tk-TM"
  | "tn-ZA"
  | "tr-TR"
  | "tt-RU"
  | "tzm-Latn-DZ"
  | "ug-CN"
  | "uk-UA"
  | "ur-PK"
  | "uz-Cyrl-UZ"
  | "uz-Latn-UZ"
  | "vi-VN"
  | "wo-SN"
  | "xh-ZA"
  | "yo-NG"
  | "zh-CN"
  | "zh-HK"
  | "zh-MO"
  | "zh-SG"
  | "zh-TW"
  | "zu-ZA";

export interface IExpectTestBaseParams {
  cordeBot: ICordeBot;
  command: string | number | boolean;
  isNot: boolean;
  timeout: number;
  isCascade: boolean;
  guildId?: string;
  channelId: string;
  channelIdToSendCommand?: string;
}
export interface IExpectTestParams extends IExpectTestBaseParams {
  testName: string;
}

export type MayReturnMatch = IMatches<any> | void;

/**
 * Defines all functions that can be used
 * to check a bot reaction of a command.
 *
 */
export interface IMessageMatches<TReturn extends MayReturnMatch> {
  /**
   * Defines the message expected to be returned by a
   * command.
   *
   * @param expect A message returned by a bot after invoking a command
   *
   * @since 1.0
   */
  toReturn(expect: boolean | number | string | IMessageEmbed): TReturn;
  /**
   * Defines [reactions](https://discordjs.guide/popular-topics/reactions.html#reacting-to-messages)
   * that must be added to the command message.
   *
   * @param emojis Single or list of reactions that must be added to a message.
   * It can be **emojis** or [custom emojis](https://support.discord.com/hc/en-us/articles/360036479811-Custom-Emojis).
   * @param messageIdentifier Id or object with the id or content of the message.
   *
   * @since 1.0
   */
  toAddReaction(
    emojis: string[] | IEmoji[] | (string | IEmoji)[],
    messageIdentifier?: string | IMessageIdentifier,
  ): TReturn;

  /**
   * Check if a command removes a list of reactions from the last message sent
   * by someone who is not the testing bot or corde's bot.
   *
   * @param emojis Reactions to check if were removed. And/or reactions like (reactions that are customized).
   * @param messageIdentifier Id or object with the id or content of the message.
   *
   * @since 2.0
   */
  toRemoveReaction(
    emojis: string[] | IEmoji[] | (string | IEmoji)[],
    messageIdentifier?: string | IMessageIdentifier,
  ): TReturn;

  /**
   * Verify if a command pinned a message.
   *
   * @param messageId Id of the message
   *
   * @since 2.0
   */
  toPin(messageId: string): TReturn;
  /**
   * Verify if a command pinned a message.
   *
   * @param messageIdentifier Object with **id** or **content** of the message.
   *
   * @since 2.0
   */
  toPin(messageIdentifier: IMessageIdentifier): TReturn;

  /**
   * Verify if a command unpinned a message.
   *
   * @param messageId Id of the message
   * @param channelId Alternative channel that corde must check where the message will be pinned
   *
   * @since 2.0
   */
  toUnPin(messageId: string): TReturn;
  /**
   * Verify if a command unpinned a message.
   *
   * @param message Object with **id** or **content** of the message.
   *
   * @since 2.0
   */
  toUnPin(messageIdentifier: IMessageIdentifier): TReturn;

  /**
   * Verify if a command edited a message.
   *
   * @param newValue New value for the message.
   * @param messageIdentifier Data object with the **id** or **oldContent** of the message.
   *
   * @since 1.0
   */
  toEditMessage(
    newValue: string | number | boolean | IMessageEmbed,
    messageIdentifier?: string | IMessageEditedIdentifier,
  ): TReturn;
}

/**
 * Tests for a **Role** structure.
 */
export interface IRoleMatches<TReturn extends MayReturnMatch> {
  /**
   * Check if a command changed a role color.
   *
   * @param color The new color for the role.
   * @param roleId Id of the role.
   *
   * @since 2.0
   */
  toSetRoleColor(color: ColorResolvable, roleId: string): TReturn;
  /**
   * Check if a command changed a role color.
   *
   * @param color The new color for the role.
   * @param roleIdentifier Object with the **id** or the **name** of the role.
   *
   * @since 2.0
   */
  toSetRoleColor(color: ColorResolvable, roleIdentifier: IRoleIdentifier): TReturn;
  /**
   * Check if a command changed a role color.
   *
   * @param color Color enum in hexadecimal format.
   * @param roleId Object with the **id** or the **name** of the role.
   *
   * @since 2.0
   */
  toSetRoleColor(color: Colors, roleId: string): TReturn;
  /**
   * Check if a command changed a role color.
   *
   * @param color Color enum in hexadecimal format.
   * @param roleIdentifier Object with the **id** or the **name** of the role.
   *
   * @since 2.0
   */
  toSetRoleColor(color: Colors, roleIdentifier: IRoleIdentifier): TReturn;

  /**
   * Check if a command deletes a role.
   * @param roleId Id of the role.
   * @since 2.0
   */
  toDeleteRole(roleId: string): TReturn;

  /**
   * Check if a command deletes a role.
   * @param roleIdentifier Object with **id** or **name** of the role
   * @since 2.0
   */
  toDeleteRole(roleIdentifier: IRoleIdentifier): TReturn;

  /**
   * Check if a command defines a role as mentionable.
   *
   * @param mentionable If the role can or can not be mentionable.
   * @param roleId Id of the role.
   *
   * @since 2.0
   */
  toSetRoleMentionable(mentionable: boolean, roleId: string): TReturn;
  /**
   * Check if a command defines a role as mentionable.
   *
   * @param mentionable If the role can or can not be mentionable.
   * @param roleIdentifier Object with **id** or **name** of the role.
   *
   * @since 2.0
   */
  toSetRoleMentionable(mentionable: boolean, roleIdentifier: IRoleIdentifier): TReturn;

  /**
   * Check if a commend defines a role as a hoist.
   *
   * @param hoist if this role is pinned in the user listing.
   * @param roleId Id of the role.
   *
   * @description Discord provides two methods of displaying roles; hoisted and standard.
   * The role hierarchy is visibly clear to server members; roles are sorted and displayed
   * based on which role is higher in the role management menu.
   *
   * However, in a standard configuration, users are sorted alphabetically, meaning someone
   * with the highest role will be sorted wherever their name exists in the alphabet.
   *
   * Source from [discord support](https://support.discord.com/hc/en-us/community/posts/360060076751-Un-hoisted-Role-Hierarchy).
   * @see https://discord.com/developers/docs/topics/permissions
   * @since 2.0
   */
  toSetRoleHoist(hoist: boolean, roleId: string): TReturn;
  /**
   * Check if a commend defines a role as a hoist.
   *
   * @param hoist if this role is pinned in the user listing.
   * @param roleIdentifier Object with **id** or **name** of the role.
   *
   * @description Discord provides two methods of displaying roles; hoisted and standard.
   * The role hierarchy is visibly clear to server members; roles are sorted and displayed
   * based on which role is higher in the role management menu.
   *
   * However, in a standard configuration, users are sorted alphabetically, meaning someone
   * with the highest role will be sorted wherever their name exists in the alphabet.
   *
   * Source from [discord support](https://support.discord.com/hc/en-us/community/posts/360060076751-Un-hoisted-Role-Hierarchy).
   * @see https://discord.com/developers/docs/topics/permissions
   * @since 2.0
   */
  toSetRoleHoist(hoist: boolean, roleIdentifier: IRoleIdentifier): TReturn;

  /**
   * Check if a command renames a role.
   *
   * @param newName new name of the role
   * @param roleId Id of the role.
   *
   * @since 2.0
   */
  toRenameRole(newName: string, roleId: string): TReturn;
  /**
   * Check if a command renames a role.
   *
   * @param newName new name of the role
   * @param roleIdentifier Object with **id** or **name** of the role
   *
   * @since 2.0
   */
  toRenameRole(newName: string, roleIdentifier: IRoleIdentifier): TReturn;

  /**
   * Check if a command changes a role's position.
   *
   * @param newPosition The new position of the role.
   * @param roleId Id of the role.
   *
   * @description Role's maximum value depends on the number of roles the guild Have.
   * So, if there are only 3 roles (including the default *everyone*), the maximum
   * position that a role can have is 2 (The count begins with 0, So: 0, 1, 2).
   *
   * @see https://discord.com/developers/docs/topics/permissions
   * @since 2.0
   */
  toSetRolePosition(newPosition: number, roleId: string): TReturn;
  /**
   * Check if a command changes a role's position.
   *
   * @param newPosition The new position of the role.
   * @param roleIdentifier Object with **id** or **name** of the role.
   *
   *
   * @description Role's maximum value depends on the number of roles the guild has.
   * So, if there are only 3 roles (including the default *everyone*), the maximum
   * position that a role can have is 2 (The count begins with 0, So: 0, 1, 2).
   *
   * @see https://discord.com/developers/docs/topics/permissions
   * @since 2.0
   */
  toSetRolePosition(newPosition: number, roleIdentifier: IRoleIdentifier): TReturn;

  /**
   * Check if a command change the
   * [permissions](https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags)
   * of a role.
   *
   * @param roleId Id of the role.
   * @param permissions List of permissions allowed by Discord.
   *
   * @see https://discord.com/developers/docs/topics/permissions#permissions
   * @since 2.0
   */
  toSetRolePermission(roleId: string, ...permissions: RolePermission[]): TReturn;
  /**
   * Check if a command change the
   * [permissions](https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags)
   * of a role.
   *
   * @param roleIdentifier Object with **id** or **name** of the role.
   * @param permissions List of permissions allowed by Discord.
   *
   * @see https://discord.com/developers/docs/topics/permissions#permissions
   * @since 2.0
   */
  toSetRolePermission(roleIdentifier: IRoleIdentifier, ...permissions: RolePermission[]): TReturn;
}

export interface IMacherContructorArgs {
  commandName: unknown;
  isNot?: boolean;
  channelIdToSendCommand?: string;
  channelId?: string;
  guildId?: string;
  isCascade?: boolean;
}

/**
 * Defines all functions that can be used
 * to check a bot reaction of a command.
 */
export type IMatches<TReturn extends MayReturnMatch> = IMessageMatches<TReturn> &
  IRoleMatches<TReturn>;

/**
 * Defines the initial value of expectations from
 * **command** function. It includes all matches and
 * the *not* statement. Which will deny the executed match
 */
export interface IIsNot<TMatchesResponse extends any, TResponse2 = void> {
  /**
   * Defines that command should **not** do something.
   * Use this if you can not precise what response a command will throw,
   * But know what it **can not** throw.
   */
  not: TMatchesResponse & TResponse2;
}

// We intentionally hide the real type of parameters are passed to todoInCasdade,
// to hide the implementation from the user.
export interface IToHaveResult {
  /**
   * Execute multiple assertions based on a single command.
   *
   * @example
   *
   * expect("command").toHaveResult(
   *  expect.toReturn("hello1"),
   *  expect.toReturn("hello2", "123124124")
   * );
   *
   * @param tests
   */
  toHaveResult(...tests: any[]): void;
}

export type InChannelMatches<TReturn extends MayReturnMatch> = IIsNot<IMessageMatches<TReturn>> &
  IMessageMatches<TReturn>;

export type InGuildMatches<TReturn extends MayReturnMatch> = IIsNot<IRoleMatches<TReturn>> &
  IRoleMatches<TReturn>;

export interface ISetGuildMatchers<TReturn extends MayReturnMatch> {
  /**
   * Specify a guild where tests will be **validated** in.
   *
   * @example
   *
   * // Suposing that the config is:
   * const cordeConfig = {
   *  guildId: "123",
   *  botPrefix: "!"
   * };
   *
   * expect("ping").inGuild("321").toRenameRole("new name", "1231241");
   *
   * @description This will send the message "!ping" in the channel defined in configs("123"),
   * and check if a message with content "pong" will be sent to the text channel of if "321".
   *
   * @param id Id of the channel
   */
  inGuild(id: string): InGuildMatches<TReturn>;
}

export interface ISetChannelMatchers<TReturn extends MayReturnMatch> {
  /**
   * Specify a channel where tests will be **validated** in.
   *
   * @example
   *
   * // Suposing that the config is:
   * const cordeConfig = {
   *  channelId: "123",
   *  botPrefix: "!"
   * };
   *
   * expect("ping").inChannel("321").toReturn("pong");
   *
   * @description This will send the message "!ping" in the channel defined in configs("123"),
   * and check if a message with content "pong" will be sent to the text channel of if "321".
   *
   * @param id Id of the channel
   */
  inChannel(id: string): InChannelMatches<TReturn>;
}

type IsNotWithHaveResults = IIsNot<IMatches<void>, IToHaveResult>;

export type AllMatches<TReturn extends MayReturnMatch> = IIsNot<IMatches<any>> &
  IMatches<TReturn> &
  ISetChannelMatchers<TReturn> &
  ISetGuildMatchers<TReturn>;

export type AllExpectMatches = IMatches<void> &
  IToHaveResult &
  IsNotWithHaveResults &
  ISetChannelMatchers<void> &
  ISetGuildMatchers<void>;

export interface IExpect extends AllMatches<any> {
  /**
   * Receives which command will be tested.
   *
   * Do not inform the command prefix if
   * it's already informed in **configs**
   *
   * @param commandNameResolvable Command name. (Empty strings will resolve failed test)
   * @param channelId Defines the channel where the command should be sent to.
   *
   * @returns An object with all possible tests to be done
   * in the bot.
   *
   * @since 1.0
   */
  <T extends (() => number | string) | number | string>(
    commandNameResolvable: T,
    channelId?: string,
  ): AllExpectMatches;
}

export type ReturnValueOrOwnType<T> = T extends (...args: any[]) => infer U ? U : T;
export type ResolvedValue<T> = T extends (...args: any[]) => PromiseLike<infer U> ? U : T;
export type RejectedValue<T> = T extends (...args: any[]) => PromiseLike<any> ? any : T;
export type FunctionOrReturnObjType<T> = T extends (...args: any[]) => any ? T : () => T;

export interface IMockInstance<
  TEntity extends Record<string, unknown>,
  TKeyEntity extends keyof TEntity,
  TProp extends any = TEntity[TKeyEntity],
> {
  /**
   * Inform the total amount of calls of the mock.
   * This value is not changed by restore call
   *
   * @example
   *
   * const mock = createMock(obj, "someFunction").mockImplementation(() => 1);
   * obj.someFunction() // callsCount: 1
   * mock.restore() // callsCount: 1
   * obj.someFunction() // callsCount: 2
   *
   */
  callsCount: number;
  /**
   * Inform the total amount of call of the mock.
   * This value is reseted when restore function is called.
   *
   * @example
   *
   * const mock = createMock(obj, "someFunction").mockImplementation(() => 1);
   * obj.someFunction() // callsCount: 1
   * mock.restore() // callsCount: 0
   * obj.someFunction() // callsCount: 1
   *
   */
  instanceCallsCount: number;
  /**
   * Mock the implemtation of a function just **one** time.
   * The previous function's value is restored after call it.
   *
   * @param fn Empty or some implementation for a function.
   *
   * @example
   *
   * const obj = {
   *    getNumber: () => {
   *      return 1;
   *    }
   * }
   *
   * const mock = createMock(obj, "getNumber")
   *              .mockImplementationOnce(() => 2);
   *              .mockImplementationOnce(() => 3);
   *
   * obj.getNumber() // Returns 2
   * obj.getNumber() // Returns 3
   * obj.getNumber() // Returns 1
   *
   */
  mockImplementationOnce(fn?: FunctionOrReturnObjType<TProp>): this;
  /**
   * Mock the implementation of a function until `restore` function be called,
   * or by the amount of calls this functions must have.
   *
   * If no value is passed to `maxCalls` the value of `fn` will be used as default implementation
   * of the mocked function until `restore()` function be called.
   *
   * @param fn Empty or some implementation for a function.
   * @param maxCalls Defines the max amount of calls the mocked return value will be valid for.
   *
   * @example
   *
   * const obj = {
   *    getNumber: () => {
   *      return 1;
   *    }
   * }
   *
   * const mock = createMock(obj, "getNumber")
   *              .mockImplementation(() => 2);
   *              .mockImplementation(() => 3);
   *
   * obj.getNumber() // Returns 2
   * obj.getNumber() // Returns 3
   * obj.getNumber() // Returns 3
   * obj.getNumber() // Returns 3
   * ...
   */
  mockImplementation(fn?: FunctionOrReturnObjType<TProp>, maxCalls?: number): this;
  /**
   * Mocks the return value of a property or a function.
   *
   * If no value is passed to maxCalls, `newValue` will be used as return value
   * until `restore()` function be called.
   *
   * @param newValue New return value for the given function or property
   * @param maxCalls Defines the max amount of calls the mocked return value will be valid for.
   *
   * @example
   *
   * const obj = {
   *    increment: (value: number) => {
   *      return ++value;
   *    }
   * }
   *
   * const mock = createMock(obj, "increment")
   *              .mockReturnValue(1);
   *              .mockReturnValue(10);
   *
   * obj.increment(1) // Returns 1
   * obj.increment(1) // Returns 10
   * obj.increment(4) // Returns 10
   */
  mockReturnValue(newValue: ReturnValueOrOwnType<TProp>, maxCalls?: number): this;
  /**
   * Same of `mockReturnValue`, but `newValue` is delimited by just one call
   * @param newValue New return value for the given function or property
   *
   * @example
   *
   * const obj = {
   *    increment: (value: number) => {
   *      return ++value;
   *    }
   * }
   *
   * const mock = createMock(obj, "increment")
   *              .mockReturnValueOnce(1);
   *              .mockReturnValueOnce(10);
   *
   * obj.increment(1) // Returns 1
   * obj.increment(1) // Returns 10
   * obj.increment(4) // Returns 5
   */
  mockReturnValueOnce(newValue: ReturnValueOrOwnType<TProp>): this;
  /**
   * Similar to **mockReturnValue**, but surround the return value with a Promise.resolve
   *
   * @param newValue New resolved value for a function.
   * @param maxCalls Defines the max amount of calls the resolved mocked return value will be valid for.
   *
   * @example
   *
   * // this:
   * createMock(obj, "incrementAsync").mockReturnValue(() => Promise.resolve(1));
   * // is equal to:
   * createMock(obj, "incrementAsync").mockResolvedValue(() => 1);
   *
   */
  mockResolvedValue(newValue: ResolvedValue<TProp>, maxCalls?: number): this;
  /**
   * Same of `mockResolvedValue`, but `newValue` is delimited by just one call.
   *
   * @param newValue New resolved value for a function.
   *
   * @example
   *
   * // this:
   * createMock(obj, "incrementAsync").mockReturnValueOnce(() => Promise.resolve(1));
   * // is equal to:
   * createMock(obj, "incrementAsync").mockResolvedValueOnce(() => 1);
   *
   */
  mockResolvedValueOnce(newValue: ResolvedValue<TProp>): this;
  /**
   * Defines a new value for a function rejection.
   * This function sorround `newValue` with a `Promise.reject`
   *
   * @param newValue New rejected value for a function.
   * @param maxCalls Defines the max amount of calls the rejected mocked return value will be valid for.
   *
   * @example
   *
   * // this:
   * createMock(obj, "incrementAsync").mockReturnValue(() => Promise.reject(1));
   * // is equal to:
   * createMock(obj, "incrementAsync").mockRejectedValue(() => 1);
   *
   */
  mockRejectedValue(newValue: RejectedValue<TProp>, maxCalls?: number): this;
  /**
   * Same of `mockRejectedValue`, but `newValue` is delimited by just one call.
   *
   * @param newValue New rejected value for a function.
   *
   * @example
   *
   * // this:
   * createMock(obj, "incrementAsync").mockReturnValueOnce(() => Promise.reject(1));
   * // is equal to:
   * createMock(obj, "incrementAsync").mockRejectedValueOnce(() => 1);
   *
   */
  mockRejectedValueOnce(newValue: RejectedValue<TProp>): this;
  /**
   * Restores all calls and implementation of a mock
   *
   * *Do not restore callsCount*
   *
   * @example
   *
   * const obj = {
   *    increment: (value: number) => {
   *      return ++value;
   *    }
   * }
   *
   * const mock = createMock(obj, "increment").mockReturnValue(1);
   *
   * obj.increment(2) // Return 1 - Total calls: 1 - InstanceCalls: 1
   * obj.increment(2) // Return 1 - Total calls: 2 - InstanceCalls: 2
   * mock.restore()
   * obj.increment(2) // Return 3 - Total calls: 3 - InstanceCalls: 1
   */
  restore(): this;
  /**
   * Restore all calls of mocks without change the return value or implementation mock.
   *
   * @example
   *
   * const obj = {
   *    increment: (value: number) => {
   *      return ++value;
   *    }
   * }
   *
   * const mock = createMock(obj, "increment").mockReturnValue(1);
   *
   * obj.increment(2) // Return 1 - Total calls: 1 - InstanceCalls: 1
   * obj.increment(2) // Return 1 - Total calls: 2 - InstanceCalls: 2
   * mock.restoreCalls()
   * obj.increment(2) // Return 1 - Total calls: 3 - InstanceCalls: 1
   */
  restoreCalls(): this;
}

export interface ITestFilePattern {
  filesPattern: string[];
  ignorePattern?: string[];
}
