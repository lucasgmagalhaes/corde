import { Config } from "../../src/common/config";
import { testCollector } from "../../src/common/testCollector";
import { runtime } from "../../src/environment";

describe("Define tests for index of common module", () => {
  it("Should import runtime", () => {
    expect(runtime).toBeTruthy();
  });

  it("Should import Config", () => {
    expect(Config).toBeTruthy();
  });

  it("Should import testCollector", () => {
    expect(testCollector).toBeTruthy();
  });
});
