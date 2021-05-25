import { init } from "../../src/cli/init";
import { FsMockUtils } from "../mockUtils/fs";
import { IConfigOptions } from "../../src/types";
import { logger } from "../../src/environment";

// As there are a local config file for manual tests,
// These files are renamed to avoid remotion after finish
// all tests.

const fs = new FsMockUtils();
jest.mock("fs");

beforeAll(() => {
  fs.createMockForWriteFileSync();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Testing creation of config file in init", () => {
  it("should create corde.config.js file", () => {
    init("js");
    expect(fs.writeFileSyncArgs).toContain(fs.buildFilePath("corde.config.js"));
  });

  it("should create corde.config.ts file", () => {
    init("ts");
    expect(fs.writeFileSyncArgs).toContain(fs.buildFilePath("corde.config.ts"));
  });

  it("should create corde.config.json file with directly argument", () => {
    init("json");
    expect(fs.writeFileSyncArgs).toContain(fs.buildFilePath("corde.config.json"));
  });

  it("should create corde.config.json file without directly argument", () => {
    init();
    expect(fs.writeFileSyncArgs).toContain(fs.buildFilePath("corde.config.json"));
  });

  it("should create corde.config.json file with undefined argument", () => {
    init(undefined);
    expect(fs.writeFileSyncArgs).toContain(fs.buildFilePath("corde.config.json"));
  });

  it("should print msg error if invalid file extension was informed", () => {
    let outputData = "";
    const storeLog = (inputs: string) => (outputData += inputs);
    logger.log = jest.fn(storeLog);
    const invalidExtension = "asdf";
    // @ts-ignore
    init(invalidExtension);
    expect(outputData).not.toBe("");
  });
});

describe("Testing content of config file in init", () => {
  const configFile: IConfigOptions = {
    botPrefix: "",
    botTestId: "",
    channelId: "",
    cordeBotToken: "",
    guildId: "",
    testMatches: [""],
    botToken: "",
    timeout: 5000,
    silent: false,
  };

  it("should js file have same values of configFile", () => {
    init("js");
    expect(configFile).toEqual(fs.convertCreatedFileContentToModule());
  });

  it("should ts file have same values of configFile", () => {
    init("ts");
    expect(configFile).toEqual(fs.convertCreatedFileContentToModule());
  });

  it("should json file have same values of configFile", () => {
    init("json");
    const content = JSON.parse(fs.getCreatedFileContent.toString());
    expect({ $schema: "./node_modules/corde/schema/corde.schema.json", ...configFile }).toEqual(
      content,
    );
  });

  it("Should throw exception due to error in write", () => {
    fs.createMockForWriteFileSync(() => {
      throw new Error("testing error");
    });

    expect(() => init("json")).toThrow(Error);
  });
});
