import { IConfigOptions } from "../../src/types";
import { validate } from "../../src/cli/validate";
import { FileError, PropertyError } from "../../src/errors";

let configs: IConfigOptions;

beforeEach(() => {
  configs = {
    silent: true,
    botPrefix: "!",
    botTestId: "12122216892126544",
    channelId: "12316351316252291",
    cordeBotToken: "5e8862cd73694287ff341e75c95e3c6a",
    guildId: "21685198465498",
    testMatches: ["./tests/dirTestFiles/**"],
    botToken: "1f77a63e0f60f3bf420edf67bfa3915b",
    timeout: 5000,
  };
});

describe("Testing validate CLI function", () => {
  it("Should return false due to no botPrefix", () => {
    configs.botPrefix = "";
    expect(async () => await validate(configs)).rejects.toBeTruthy();
  });

  it("Should return false due to no botTestId", () => {
    configs.botTestId = "";
    expect(async () => await validate(configs)).rejects.toThrow(PropertyError);
  });

  it("Should return false due to no channelId", () => {
    configs.channelId = "";
    expect(async () => await validate(configs)).rejects.toThrow(PropertyError);
  });

  it("Should return false due to no cordeBotToken", () => {
    configs.cordeBotToken = "";
    expect(async () => await validate(configs)).rejects.toThrow(PropertyError);
  });

  it("Should return false due to no guildId", () => {
    configs.guildId = "";
    expect(async () => await validate(configs)).rejects.toThrow(PropertyError);
  });

  it("Should return false due to no testMatches", () => {
    configs.testMatches = [];
    expect(async () => await validate(configs)).rejects.toThrow(PropertyError);
  });

  it("Should return false due invlaid dir", () => {
    configs.testMatches = ["./tests/dirTest/**"];
    expect(async () => await validate(configs)).rejects.toThrow(PropertyError);
  });

  it("Should not throw error due to existance of file", () => {
    configs.testMatches = ["./tests/dirTestFiles/testFile.test.ts"];
    expect(async () => await validate(configs)).not.toThrow(PropertyError);
  });

  it("Should throw error due to inexistance of file", () => {
    configs.testMatches = ["./tests/dirTestFiles/testF.test.ts"];
    expect(async () => await validate(configs)).rejects.toThrow(PropertyError);
  });

  it("Should return true due all configs presence", () => {
    expect(async () => await validate(configs)).not.toThrowError();
  });

  it("Should throw exception due to null parameter", () => {
    expect(async () => await validate(null)).rejects.toThrow(FileError);
  });
});
