import * as pack from "../../package.json";
import * as initFunc from "../../src/cli/init";
import * as validateFunc from "../../src/cli/validate";
import * as goFunc from "../../src/cli/exec";

import { program } from "../../src/cli/cli";
import { reader } from "../../src/core/reader";
import { runtime } from "../../src/environment";

describe("testing cli", () => {
  beforeEach(() => {
    jest.spyOn(goFunc, "exec").mockImplementation(() => null);
  });

  it("should get version", () => {
    program.exitOverride();
    expect(() => {
      program.parse(["node", "test", "-v"]);
    }).toThrow(pack.version);
  });

  it("should call init command", () => {
    program.exitOverride();
    const spy = jest.spyOn(initFunc, "init").mockImplementation(null);
    program.parse(["node", "test", "init"]);
    expect(spy).toBeCalled();
  });

  it("should call init command with 'i' alias", () => {
    program.exitOverride();
    const spy = jest.spyOn(initFunc, "init").mockImplementation(null);
    program.parse(["node", "test", "i"]);
    expect(spy).toBeCalled();
  });

  it("should call go command", () => {
    program.exitOverride();
    const spy = jest.spyOn(goFunc, "exec").mockImplementation(null);
    program.parse(["node", "test", ""]);
    expect(spy).toBeCalled();
  });

  it("should call go command with -c option", async () => {
    program.exitOverride();
    const spy = jest.spyOn(goFunc, "exec").mockImplementation(null);
    const testPath = "potatoe";
    await program.parseAsync(["node", "test", "-c", testPath]);
    expect(spy).toBeCalled();
    expect(runtime.configFilePath).toBe(testPath);
  });

  it("should call go command with -f option (single file)", async () => {
    program.exitOverride();
    const spy = jest.spyOn(goFunc, "exec").mockImplementation(null);
    const testMatches = "./tests";
    await program.parseAsync(["node", "test", "-f", testMatches]);
    expect(spy).toBeCalled();
    expect(runtime.testMatches).toEqual(testMatches.split(" "));
  });

  it("should call go command with -f option (multiple files)", async () => {
    program.exitOverride();
    const spy = jest.spyOn(goFunc, "exec").mockImplementation(null);
    const testMatches = "./tests ./tests2";
    await program.parseAsync(["node", "test", "-f", testMatches]);
    expect(spy).toBeCalled();
    expect(runtime.testMatches).toEqual(testMatches.split(" "));
  });

  it("should call go command with --files option (single file)", async () => {
    program.exitOverride();
    const spy = jest.spyOn(goFunc, "exec").mockImplementation(null);
    const testMatches = "./tests";
    await program.parseAsync(["node", "test", "--files", testMatches]);
    expect(spy).toBeCalled();
    expect(runtime.testMatches).toEqual(testMatches.split(" "));
  });

  it("should call go command with --files option (multiple files)", async () => {
    program.exitOverride();
    const spy = jest.spyOn(goFunc, "exec").mockImplementation(null);
    const testMatches = "./tests ./tests2";
    await program.parseAsync(["node", "test", "--files", testMatches]);
    expect(spy).toBeCalled();
    expect(runtime.testMatches).toEqual(testMatches.split(" "));
  });

  it("should call go command with --config option", async () => {
    program.exitOverride();
    const spy = jest.spyOn(goFunc, "exec").mockImplementation(null);
    const testPath = "potatoe";
    await program.parseAsync(["node", "test", "--config", testPath]);
    expect(spy).toBeCalled();
    expect(runtime.configFilePath).toBe(testPath);
  });

  it("should call validate command", async () => {
    program.exitOverride();
    jest.spyOn(reader, "loadConfig").mockImplementation(null);
    const spyValidate = jest.spyOn(validateFunc, "validate").mockImplementation(null);
    await program.parseAsync(["node", "test", "validate"]);
    expect(spyValidate).toBeCalled();
  });

  it("should call validate command with 'v' alias", async () => {
    program.exitOverride();
    jest.spyOn(reader, "loadConfig").mockImplementation(() => null);
    const spyValidate = jest.spyOn(validateFunc, "validate").mockImplementation(() => null);
    await program.parseAsync(["node", "test", "v"]);
    expect(spyValidate).toBeCalled();
  });

  it("should call cli silently", async () => {
    program.exitOverride();
    jest.spyOn(reader, "loadConfig").mockImplementation(() => null);
    expect(runtime.silent).not.toBeTruthy();
    await program.parseAsync(["node", "test", "--silent"]);
    expect(runtime.silent).toBeTruthy();
  });

  it("should set botPrefix", async () => {
    program.exitOverride();
    jest.spyOn(reader, "loadConfig").mockImplementation(() => null);
    expect(runtime.botPrefix).toBeFalsy();
    await program.parseAsync(["node", "test", "--botPrefix", "!"]);
    expect(runtime.botPrefix).toEqual("!");
  });

  it("should set timeout", async () => {
    program.exitOverride();
    jest.spyOn(reader, "loadConfig").mockImplementation(() => null);
    await program.parseAsync(["node", "test", "--timeout", "1000"]);
    expect(runtime.timeout).toEqual(1000);
  });

  it("should set guildId", async () => {
    program.exitOverride();
    const param = "12312412421";
    jest.spyOn(reader, "loadConfig").mockImplementation(() => null);
    expect(runtime.guildId).toBeFalsy();
    await program.parseAsync(["node", "test", "--guildId", param]);
    expect(runtime.guildId).toEqual(param);
  });

  it("should set channelId", async () => {
    program.exitOverride();
    const param = "12312412421";
    jest.spyOn(reader, "loadConfig").mockImplementation(() => null);
    expect(runtime.channelId).toBeFalsy();
    await program.parseAsync(["node", "test", "--channelId", param]);
    expect(runtime.channelId).toEqual(param);
  });

  it("should set botToken", async () => {
    program.exitOverride();
    const param = "asdas1kl2j31lkjlas";
    jest.spyOn(reader, "loadConfig").mockImplementation(() => null);
    expect(runtime.botToken).toBeFalsy();
    await program.parseAsync(["node", "test", "--botToken", param]);
    expect(runtime.botToken).toEqual(param);
  });

  it("should set botTestId", async () => {
    program.exitOverride();
    const param = "12312412312412312";
    jest.spyOn(reader, "loadConfig").mockImplementation(() => null);
    expect(runtime.botTestId).toBeFalsy();
    await program.parseAsync(["node", "test", "--botTestId", param]);
    expect(runtime.botTestId).toEqual(param);
  });

  it("should set cordeBotToken", async () => {
    program.exitOverride();
    const param = "alsdj1çlk1j2d1ubça2";
    jest.spyOn(reader, "loadConfig").mockImplementation(() => null);
    expect(runtime.cordeBotToken).toBeFalsy();
    await program.parseAsync(["node", "test", "--cordeBotToken", param]);
    expect(runtime.cordeBotToken).toEqual(param);
  });
});
