import fs from "fs";
import path from "path";
import { testCollector } from "../../src/common/testCollector";
import { reader } from "../../src/core/reader";
import { logger, runtime } from "../../src/environment";
import { FileError } from "../../src/errors";
import { beforeStart as _beforeStart } from "../../src/hooks";
import { ITestFile } from "../../src/types";
import consts from "../mocks/constsNames";

// TODO: This class must have more tests

const conf = require("../mocks/jsconfig/corde.config.js");
const cwd = process.cwd();

afterEach(() => {
  runtime.configFilePath = null;
  process.chdir(cwd);
  testCollector.cleanAll();
});

describe("reader class", () => {
  describe("when instantiating it", () => {
    it("should create the instance", () => {
      expect(reader).toBeTruthy();
    });
  });

  describe("when working with reader.loadConfig()", () => {
    describe("and has runtime.configFilePath", () => {
      beforeEach(() => {
        jest.resetAllMocks();
      });
      it("should read configs from configFilePath", () => {
        const spy = jest.spyOn(fs, "readFileSync").mockReturnValue(null);
        runtime.configFilePath = path.resolve(
          process.cwd(),
          "tests/mocks/jsconfig/corde.config.js",
        );
        expect(reader.loadConfig()).toEqual(conf);
        spy.mockReset();
      });

      it("should throw error when path in runtime.configFilepath is invalid", () => {
        runtime.configFilePath = ".";
        jest.spyOn(fs, "existsSync").mockReturnValue(false);
        expect(() => reader.loadConfig()).toThrowError();
      });

      it("should resolve path of config", () => {
        const spy = jest.spyOn(fs, "readFileSync").mockReturnValue(null);
        runtime.configFilePath = "tests/mocks/jsconfig/corde.config.js";
        expect(reader.loadConfig()).toEqual(conf);
        spy.mockReset();
      });

      it("should read json config", () => {
        runtime.configFilePath = "tests/mocks/jsonconfig/corde.config.json";
        expect(reader.loadConfig()).toEqual(conf);
      });

      it("should throw exception due to invalid file extension (.txt)", () => {
        runtime.configFilePath = path.resolve(
          process.cwd(),
          "tests/mocks/txtconfig/corde.config.txt",
        );
        expect(() => reader.loadConfig()).toThrowError(FileError);
      });
    });

    describe("testing getTestsFromFiles", () => {
      it("should throw error due to no file", async () => {
        try {
          await reader.getTestsFromFiles(null);
          fail();
        } catch (error) {
          logger.log(error);
          expect(error).toBeInstanceOf(FileError);
        }
      });

      it("should get files with fail in execution of hook, but without stop execution", async () => {
        _beforeStart(() => {
          throw new Error();
        });

        const tests = await reader.getTestsFromFiles({
          filesPattern: [process.cwd(), "tests/mocks/sampleSingleTest.ts"],
        });
        expect(tests).toBeTruthy();
      });

      it("should return empty due to inexistance of the file", async () => {
        const tests = await reader.getTestsFromFiles({
          filesPattern: [path.resolve(process.cwd(), "tests/mocks/sampleWithSingleTest.ts")],
        });
        expect(tests.length).toEqual(0);
      });

      it("should return group with only command", async () => {
        const pathFile = "tests/mocks/onlyCommands.ts";
        const tests = await reader.getTestsFromFiles({
          filesPattern: [pathFile],
        });
        const expectedTests: ITestFile[] = [
          {
            path: pathFile,
            isEmpty: false,
            groups: [
              {
                tests: [
                  {
                    testsFunctions: [expect.any(Function)],
                  },
                ],
              },
            ],
          },
        ];
        expect(tests).toEqual(expectedTests);
      });

      it("should return group with double groups", async () => {
        const pathFile = "tests/mocks/sampleDoubleGroup.ts";
        const tests = await reader.getTestsFromFiles({
          filesPattern: [pathFile],
        });
        const expectedTests: ITestFile[] = [
          {
            path: pathFile,
            isEmpty: false,
            groups: [
              {
                name: consts.GROUP_1,
                tests: [
                  {
                    name: consts.TEST_1,
                    testsFunctions: [expect.any(Function)],
                  },
                ],
              },
              {
                name: consts.GROUP_2,
                tests: [
                  {
                    name: consts.TEST_2,
                    testsFunctions: [expect.any(Function)],
                  },
                ],
              },
            ],
          },
        ];
        expect(tests).toEqual(expectedTests);
      });

      it("should return group with only group and expect", async () => {
        const pathFile = "tests/mocks/sampleOnlyWithGroup.ts";
        const tests = await reader.getTestsFromFiles({
          filesPattern: [pathFile],
        });
        const expectedTests: ITestFile[] = [
          {
            path: pathFile,
            isEmpty: false,
            groups: [
              {
                name: consts.GROUP_1,
                tests: [
                  {
                    testsFunctions: [expect.any(Function)],
                  },
                ],
              },
            ],
          },
        ];
        expect(tests).toEqual(expectedTests);
      });
    });

    it("should return group with single group and test", async () => {
      const pathFile = "tests/mocks/sampleWithSingleGroup.ts";

      const tests = await reader.getTestsFromFiles({
        filesPattern: [pathFile],
      });
      const expectedTests: ITestFile[] = [
        {
          path: pathFile,
          isEmpty: false,
          groups: [
            {
              name: consts.GROUP_1,
              tests: [
                {
                  name: consts.TEST_1,
                  testsFunctions: [expect.any(Function)],
                },
              ],
            },
          ],
        },
      ];
      expect(tests).toEqual(expectedTests);
    });

    it("should return empty test (only with group)", async () => {
      const pathFile = "tests/mocks/sampleEmptyGroup.ts";
      const tests = await reader.getTestsFromFiles({
        filesPattern: [pathFile],
      });
      const expectedTests: ITestFile[] = [
        {
          path: pathFile,
          isEmpty: true,
          groups: [],
        },
      ];
      expect(tests).toEqual(expectedTests);
    });

    it("should return empty test (only with test)", async () => {
      const pathFile = "tests/mocks/sampleEmptyTest.ts";
      const tests = await reader.getTestsFromFiles({
        filesPattern: [pathFile],
      });
      const expectedTests: ITestFile[] = [
        {
          path: pathFile,
          isEmpty: true,
          groups: [],
        },
      ];
      expect(tests).toEqual(expectedTests);
    });

    describe("when working with auto search for config files (js, ts, json)", () => {
      it("should read configs from corde.js", () => {
        process.chdir(path.resolve(process.cwd(), "tests/mocks/jsconfig"));
        expect(reader.loadConfig()).toEqual(conf);
      });

      it("should read configs from corde.ts", () => {
        process.chdir(path.resolve(process.cwd(), "tests/mocks/tsconfig"));
        expect(reader.loadConfig()).toEqual(conf);
      });

      it("should read configs from corde.json", () => {
        const jsonPath = path.resolve(process.cwd(), "tests/mocks/jsonconfig/corde.config.json");
        const jsonConfig = JSON.parse(fs.readFileSync(jsonPath).toString());
        process.chdir(path.resolve(process.cwd(), "tests/mocks/jsonconfig"));
        expect(reader.loadConfig()).toEqual(jsonConfig);
      });

      it("should throw error when a config file (corde.json) is empty", () => {
        process.chdir(path.resolve(process.cwd(), "tests/mocks/jsonconfig"));
        const existsSpy = jest.spyOn(fs, "existsSync").mockReturnValue(true);
        const parseSpy = jest.spyOn(JSON, "parse").mockReturnValue(null);
        expect(() => reader.loadConfig()).toThrowError(FileError);
        existsSpy.mockReset();
        parseSpy.mockReset();
      });

      it("should throw error if has no config file", () => {
        const spy = jest.spyOn(fs, "existsSync").mockReturnValue(false);
        expect(() => reader.loadConfig()).toThrowError();
        spy.mockReset();
      });
    });
  });
});
