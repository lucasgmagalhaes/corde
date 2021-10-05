import { testCollector } from "../../src/core/testCollector";
import { Queue } from "../../src/data-structures";
import { beforeAll as hook } from "../../src/hooks";
import { VoidLikeFunction } from "../../src/types";
import { wait } from "../../src/utils";

let queue: Queue<VoidLikeFunction>;

describe("testing beforeAll function", () => {
  beforeEach(() => {
    testCollector.clearTestFiles();
    testCollector.createTestFile("test");
    queue = testCollector.currentTestFile.beforeAllHooks;
  });

  it("should add a function", () => {
    let a = 1;

    hook(() => {
      a = 2;
    });

    queue.executeSync();
    expect(a).toBe(2);
  });

  it("should throw error and get this error", async () => {
    hook(() => {
      throw new Error();
    });

    const errors = await queue.executeWithCatchCollectAsync();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toMatchSnapshot();
  });

  it("should execute a async function", async () => {
    let a = 0;
    hook(async () => {
      await wait(100);
      a = 1;
    });

    await queue.executeWithCatchCollectAsync();
    expect(a).toEqual(1);
  });

  it("Should do nothing", () => {
    hook(undefined);
    const length = queue.size;
    expect(length).toBe(0);
  });
});