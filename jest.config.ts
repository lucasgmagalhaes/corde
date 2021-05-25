import type { Config } from "@jest/types";

// Set TEST environment to avoid process to exit with code 1 inside aplicaton
process.env.ENV = "UNITY_TEST";

const config: Config.InitialOptions = {
  rootDir: ".",
  verbose: false,
  setupFiles: ["<rootDir>/setup.ts"],
  preset: "ts-jest/presets/js-with-babel",
  testEnvironment: "node",
  collectCoverageFrom: ["./src/**/*.ts"],
  testMatch: ["**/tests/**/*.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  modulePathIgnorePatterns: ["./tests/mocks", "./tests/manual_test", "./tests/dirTestFiles"],
  projects: ["<rootDir>/tests"],
  restoreMocks: true,
  forceExit: true,
  globals: {
    "ts-jest": {
      babelConfig: "./babel.config.js",
      tsconfig: "./tsconfig.test.json",
    },
  },
  transform: {
    "^.+\\.js?$": "babel-jest",
  },
};

export default config;
