import { Queue } from "../../src/data-structures";

describe("testing queue structure", () => {
  let queue: Queue<() => void>;
  let numberQueue: Queue<(n: number) => number>;
  beforeEach(() => {
    queue = new Queue();
    numberQueue = new Queue();
  });

  describe("testing constructor", () => {
    it("size should be 0 after initialization", () => {
      expect(queue.size).toEqual(0);
    });

    it("defaultParameters should be 0 after initialization", () => {
      expect(queue.defaultParameters.length).toEqual(0);
    });

    it("hasFunctions should be false after initialization", () => {
      expect(queue.hasFunctions).toBeFalsy();
    });

    it("validateDefaultArguments should be false after initialization", () => {
      expect(queue.isDefaultArgumentsValid()).toBeTruthy();
    });
  });

  describe("testing enqueue", () => {
    it("should add a function to queue", () => {
      queue.enqueue(() => {});
      expect(queue.size).toBe(1);
    });

    it("should return a GUID for enqueued function", () => {
      const guid = queue.enqueue(() => {});
      expect(guid).toBeTruthy();
    });

    it("should throw error due to attempt to add a null | undefined value", () => {
      expect(() => queue.enqueue(null)).toThrowError();
    });

    it("should throw error due to attempt to add a non funtion value", () => {
      // @ts-ignore
      expect(() => queue.enqueue(1)).toThrowError();
    });
  });

  describe("testing dequeue", () => {
    it("should dequeue a function", () => {
      const fn = () => {};
      const guid = queue.enqueue(fn);
      const dequeued = queue.dequeue(guid);
      expect(queue.size).toBe(0);
      expect(dequeued).toBeTruthy();
    });

    it("should not dequeue a function", () => {
      const fn = () => {};
      queue.enqueue(fn);
      const dequeued = queue.dequeue("123");
      expect(queue.size).toBe(1);
      expect(dequeued).toBeFalsy();
    });

    it("should not dequeue a function due to null guid", () => {
      const fn = () => {};
      queue.enqueue(fn);
      const dequeued = queue.dequeue(null);
      expect(queue.size).toBe(1);
      expect(dequeued).toBeFalsy();
    });
  });

  describe("testing executeSync", () => {
    it("should execute all functions", () => {
      let a = 1;
      const fn = () => {
        a = 2;
      };
      queue.enqueue(fn);
      queue.executeSync();
      expect(a).toEqual(2);
    });

    it("should execute all functions with parameters", () => {
      let a = 1;
      const fn = (sum: number) => {
        a = 2 + sum;
      };

      const queueParams = new Queue<(sum: number) => void>();
      queueParams.enqueue(fn);
      queueParams.executeSync(2);
      expect(a).toEqual(4);
    });

    it("should execute all functions with parameters and return value", () => {
      const fn = (sum: number) => {
        return 2 + sum;
      };

      const queueParams = new Queue<(sum: number) => number>();
      queueParams.enqueue(fn);
      const returned = queueParams.executeSync(2);
      expect(returned).toEqual([4]);
    });

    it("should execute async all functions with parameters", async () => {
      let a = 1;
      const fn = (sum: number) => {
        a = 2 + sum;
      };

      const queueParams = new Queue<(sum: number) => void>();
      queueParams.enqueue(fn);
      await queueParams.executeAsync(2);
      expect(a).toEqual(4);
    });

    it("should execute async all functions with parameters and return value", async () => {
      const fn = (sum: number) => {
        return 2 + sum;
      };

      const queueParams = new Queue<(sum: number) => number>();
      queueParams.enqueue(fn);
      const returned = await queueParams.executeAsync(2);
      expect(returned).toEqual([4]);
    });

    it("should not throw error due to no function queued", () => {
      const _queue = new Queue<(sum: number) => number>();
      expect(() => _queue.executeSync()).not.toThrowError();
    });

    it("should throw error due to missing parameters", () => {
      const _queue = new Queue<(sum: number) => number>();
      _queue.enqueue((s) => 1 + s);
      expect(() => _queue.executeSync()).toThrowError();
    });
  });

  describe("testing executeAsync", () => {
    it("should executeAsync with directly params", async () => {
      const RESPONSE = 1000;
      const fn = (numb: number) => {
        return new Promise<number>((resolve) => {
          setTimeout(() => {
            resolve(numb);
          }, 100);
        });
      };

      const queueParams = new Queue<(n: number) => Promise<number>>();
      queueParams.enqueue(fn);
      const [returned] = await queueParams.executeAsync(RESPONSE);
      expect(returned).toEqual(RESPONSE);
    });

    it("should executeAsync with default params", async () => {
      const RESPONSE = 1000;
      const fn = (numb: number) => {
        return new Promise<number>((resolve) => {
          setTimeout(() => {
            resolve(numb);
          }, 100);
        });
      };

      const queueParams = new Queue<(n: number) => Promise<number>>();
      queueParams.enqueue(fn);
      queueParams.addDefaultParameters(RESPONSE);
      const [returned] = await queueParams.executeAsync();
      expect(returned).toEqual(RESPONSE);
    });

    it("should throw error due to passage of more args than expect", async () => {
      const RESPONSE = 1000;
      const fn = (numb: number) => {
        return new Promise<number>((resolve) => {
          setTimeout(() => {
            resolve(numb);
          }, 100);
        });
      };

      const queueParams = new Queue<(n: number) => Promise<number>>();
      queueParams.enqueue(fn);
      queueParams.addDefaultParameters(RESPONSE);
      queueParams.addDefaultParameters(123);
      expect(queueParams.executeAsync).rejects.toBeTruthy();
    });

    it("should executeAsync with default params", async () => {
      const RESPONSE = 1000;
      const fn = (numb: number) => {
        return new Promise<number>((resolve) => {
          setTimeout(() => {
            resolve(numb);
          }, 100);
        });
      };

      const queueParams = new Queue<(n: number) => Promise<number>>();
      queueParams.enqueue(fn);
      queueParams.addDefaultParameters(RESPONSE);
      const [value] = await queueParams.executeAsync();
      expect(value).toEqual(RESPONSE);
    });

    it("should execute async all functions with parameters and return value", async () => {
      const fn = () => {
        return new Promise<number>((resolve) => {
          setTimeout(() => {
            resolve(1);
          }, 100);
        });
      };

      const queueParams = new Queue<() => Promise<number>>();
      queueParams.enqueue(fn);
      const returned = await queueParams.executeAsync();
      expect(returned).toEqual([1]);
    });

    it("should fail in async excution", async () => {
      const fn = () => {
        return new Promise<number>((_, reject) => {
          setTimeout(() => {
            reject();
          }, 100);
        });
      };

      const queueParams = new Queue<() => Promise<number>>();
      queueParams.enqueue(fn);
      expect(queueParams.executeAsync).rejects.toBeTruthy();
    });

    it("should not throw error due to no function queued", async () => {
      const _queue = new Queue<(sum: number) => number>();
      const response = await _queue.executeAsync();
      expect(response).toEqual([]);
    });

    it("should throw error due to missing parameters", () => {
      const _queue = new Queue<(sum: number) => number>();
      _queue.enqueue((s) => 1 + s);
      expect(_queue.executeAsync).rejects.toBeTruthy();
    });

    it("should throw error due to missing parameters", () => {
      const _queue = new Queue<(sum: number) => number>();
      _queue.enqueue((s) => 1 + s);
      _queue.addDefaultParameters(1);
      _queue.addDefaultParameters(2);
      expect(_queue.executeAsync).rejects.toBeTruthy();
    });
  });

  describe("testing tryExecuteSync", () => {
    it("should safe execute function that throws error and not provide catchFunction", () => {
      queue.enqueue(() => {
        throw Error();
      });

      expect(() => queue.tryExecuteSync()).not.toThrowError();
    });

    it("should safe execute function that not throws error, not provide catchFunction and return value", () => {
      const queueWithReturn = new Queue<() => number>();
      queueWithReturn.enqueue(() => {
        return 1;
      });
      const values = queueWithReturn.tryExecuteSync();
      expect(values).toEqual([1]);
    });

    it("should safe execute function that throws error and provide catchFunction", () => {
      queue.enqueue(() => {
        throw Error();
      });

      let a = 1;
      queue.tryExecuteSync(() => (a = 2));
      expect(a).toEqual(2);
    });

    it("should do nothing due to no function", () => {
      const response = queue.tryExecuteSync();
      expect(response).toEqual([]);
    });

    it("should throw error due do exceeded parameters", () => {
      numberQueue.enqueue((a) => a + 1);
      numberQueue.addDefaultParameters(1);
      numberQueue.addDefaultParameters(2);
      expect(() => numberQueue.tryExecuteSync()).toThrowError();
    });

    it("should throw error due do exceeded parameters", () => {
      numberQueue.enqueue((a) => a + 1);
      // @ts-ignore
      expect(() => numberQueue.tryExecuteSync(() => {}, 1, 2)).toThrowError();
    });
  });

  describe("testing tryExecuteAsync", () => {
    it("should safe execute async function that throws error and not provide catchFunction", async () => {
      queue.enqueue(() => {
        throw Error();
      });

      expect(async () => await queue.tryExecuteAsync()).not.toThrowError();
    });

    it("should safe execute async function that throws error and provide catchFunction", async () => {
      queue.enqueue(() => {
        throw Error();
      });

      let a = 1;
      await queue.tryExecuteAsync(() => (a = 2));
      expect(a).toEqual(2);
    });

    it("should safe execute function that not throws error, not provide catchFunction and return value", async () => {
      const queueWithReturn = new Queue<() => number>();
      queueWithReturn.enqueue(() => {
        return 1;
      });
      const values = await queueWithReturn.tryExecuteAsync();
      expect(values).toEqual([1]);
    });

    it("should not fail in async excution", async () => {
      const fn = () => {
        return new Promise<number>((_, reject) => {
          setTimeout(() => {
            reject();
          }, 100);
        });
      };

      queue.enqueue(fn);
      expect(async () => await queue.tryExecuteAsync()).not.toThrowError();
    });

    it("should not fail in async excution", async () => {
      let a = 1;
      const fn = () => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            a = 2;
            resolve();
          }, 100);
        });
      };

      queue.enqueue(fn);
      await queue.tryExecuteAsync();
      expect(a).toBe(2);
    });

    it("should not throw error due to no function queued", async () => {
      const _queue = new Queue<(sum: number) => number>();
      const response = await _queue.tryExecuteAsync();
      expect(response).toEqual([]);
    });

    it("should throw error due to missing parameters", () => {
      const _queue = new Queue<(sum: number) => number>();
      _queue.enqueue((s) => 1 + s);
      expect(async () => await _queue.tryExecuteAsync()).rejects.toBeTruthy();
    });

    it("should throw error due to missing parameters", () => {
      const _queue = new Queue<(sum: number) => number>();
      _queue.enqueue((s) => 1 + s);
      _queue.addDefaultParameters(1);
      _queue.addDefaultParameters(2);
      expect(async () => await _queue.tryExecuteAsync()).rejects.toBeTruthy();
    });
  });

  describe("testing executeWithCatchCollectSync", () => {
    it("should execute sync function handling error and returning it", () => {
      queue.enqueue(() => {
        throw new Error("Test Error");
      });

      const errors = queue.executeWithCatchCollectSync();
      expect(errors[0]).toEqual(new Error("Test Error"));
    });

    it("should not throw error due to no function queued", () => {
      const _queue = new Queue<(sum: number) => number>();
      const response = _queue.executeWithCatchCollectSync();
      expect(response).toEqual([]);
    });

    it("should throw error due to missing parameters", () => {
      const _queue = new Queue<(sum: number) => number>();
      _queue.enqueue((s) => 1 + s);
      expect(() => _queue.executeWithCatchCollectSync()).toThrowError();
    });

    it("should throw error due to missing parameters", () => {
      const _queue = new Queue<(sum: number) => number>();
      _queue.enqueue((s) => 1 + s);
      _queue.addDefaultParameters(1);
      _queue.addDefaultParameters(2);
      expect(() => _queue.executeWithCatchCollectSync()).toThrowError();
    });

    it("should throw error due do exceeded parameters", () => {
      numberQueue.enqueue((a) => a + 1);
      // @ts-ignore
      expect(() => numberQueue.executeWithCatchCollectSync(1, 2)).toThrowError();
    });
  });

  describe("testing executeWithCatchCollectAsync", () => {
    it("should execute async function with catchCollect", async () => {
      let a = 1;
      queue.enqueue(async () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            a = 2;
            resolve();
          }, 100);
        });
      });

      const errors = await queue.executeWithCatchCollectAsync();
      expect(a).toBe(2);
      expect(errors.length).toBe(0);
    });

    it("should execute async function handling error and returning it", async () => {
      queue.enqueue(() => {
        throw new Error("Test Error");
      });

      const errors = await queue.executeWithCatchCollectAsync();
      expect(errors[0]).toEqual(new Error("Test Error"));
    });

    it("should not throw error due to no function queued", async () => {
      const _queue = new Queue<(sum: number) => number>();
      const response = await _queue.executeWithCatchCollectAsync();
      expect(response).toEqual([]);
    });

    it("should throw error due to missing parameters", () => {
      const _queue = new Queue<(sum: number) => number>();
      _queue.enqueue((s) => 1 + s);
      expect(async () => await _queue.executeWithCatchCollectAsync()).rejects.toBeTruthy();
    });

    it("should throw error due to missing parameters", () => {
      const _queue = new Queue<(sum: number) => number>();
      _queue.enqueue((s) => 1 + s);
      _queue.addDefaultParameters(1);
      _queue.addDefaultParameters(2);
      expect(async () => await _queue.executeWithCatchCollectAsync()).rejects.toBeTruthy();
    });

    it("should throw error due do exceeded parameters", () => {
      numberQueue.enqueue((a) => a + 1);
      // @ts-ignore
      expect(async () => await numberQueue.executeWithCatchCollectAsync(1, 2)).rejects.toBeTruthy();
    });
  });

  describe("testing queue size", () => {
    it("should clear the queue", () => {
      queue.enqueue(() => {});
      queue.clear();
      expect(queue.size).toBe(0);
    });

    it("queue should have one element", () => {
      queue.enqueue(() => {});
      expect(queue.size).toBe(1);
    });
  });

  describe("testing addDefaultParameters", () => {
    it("should get default parameters", () => {
      numberQueue.addDefaultParameters(1);
      expect(numberQueue.defaultParameters).toEqual([1]);
    });

    it("default parameters should be empty", () => {
      expect(numberQueue.defaultParameters).toEqual([]);
    });

    it("default parameters should be empty after clear then", () => {
      numberQueue.addDefaultParameters(1);
      numberQueue.clearDefaultParameters();
      expect(numberQueue.defaultParameters).toEqual([]);
    });
  });

  describe("testing clearDefaultParameters", () => {
    it("should clear all default parameters", () => {
      numberQueue.addDefaultParameters(1);
      numberQueue.clearDefaultParameters();
      expect(numberQueue.defaultParametersSize).toBe(0);
    });
  });

  describe("testing removeFromDefaultParameters", () => {
    it("should not remove default parameter", () => {
      numberQueue.removeFromDefaultParameter(1);
      expect(numberQueue.defaultParametersSize).toBe(0);
    });

    it("should remove default parameter", () => {
      numberQueue.addDefaultParameters(1);
      numberQueue.removeFromDefaultParameter(1);
      expect(numberQueue.defaultParametersSize).toBe(0);
    });

    it("should not remove parameter", () => {
      numberQueue.addDefaultParameters(1);
      numberQueue.removeFromDefaultParameter(112);
      expect(numberQueue.defaultParametersSize).toBe(1);
    });

    it("should remove default parameter of multiple parameters function", () => {
      const queueMultiple = new Queue<(n1: number, n2: number) => void>();
      queueMultiple.addDefaultParameters(1, 2);
      queueMultiple.removeFromDefaultParameter(1, 2);
      expect(queueMultiple.defaultParametersSize).toBe(0);
    });
  });

  describe("testing validateDefaultArguments", () => {
    it("should return true due to no functions enqueued", () => {
      expect(numberQueue.isDefaultArgumentsValid()).toBeTruthy();
    });

    it("should return true due to valid arguments", () => {
      numberQueue.addDefaultParameters(1);
      numberQueue.enqueue((n: number) => n);
      expect(numberQueue.isDefaultArgumentsValid()).toBeTruthy();
    });

    it("should return false due to no parameter", () => {
      numberQueue.enqueue((n: number) => n);
      expect(numberQueue.isDefaultArgumentsValid()).toBeFalsy();
    });

    it("should return false due to no exceded parameters", () => {
      numberQueue.enqueue((n: number) => n);
      numberQueue.addDefaultParameters(1);
      numberQueue.addDefaultParameters(2);
      expect(numberQueue.isDefaultArgumentsValid()).toBeFalsy();
    });
  });

  describe("testing firstOrDefault", () => {
    it("should get first value", () => {
      numberQueue.enqueue(() => 1);
      expect(numberQueue.firstOrDefault()).toBeTruthy();
    });

    it("should get first value", () => {
      expect(numberQueue.firstOrDefault()).toBeFalsy();
    });
  });

  describe("testing first function", () => {
    it("first should not return something", () => {
      expect(numberQueue.first).toThrowError();
    });

    it("first should return something", () => {
      numberQueue.enqueue(() => 1);
      expect(numberQueue.first()).toBeTruthy();
    });
  });
});
