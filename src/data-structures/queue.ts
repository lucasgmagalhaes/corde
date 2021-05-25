import { GenericFunction, ParametersAsOptional } from "../types";
import crypto from "crypto";

export function createHash() {
  const current_date = new Date().valueOf().toString();
  const random = Math.random().toString();
  return crypto
    .createHash("sha1")
    .update(current_date + random)
    .digest("hex");
}

/**
 * Structure to handle a collection of functions and execute then.
 * This structure does not remove its values after its executions.
 */
export class Queue<T extends GenericFunction> {
  private readonly _funcs: Map<string, T>;
  private _defaultParameters: Parameters<T>[];

  /**
   * Gets default parameters added.
   */
  get defaultParameters() {
    return this._defaultParameters;
  }

  get size() {
    return this._funcs.size;
  }

  get hasFunctions() {
    return this._funcs.size > 0;
  }

  get hasDefaultParameters() {
    return this._defaultParameters.length > 0;
  }

  get defaultParametersSize() {
    return this._defaultParameters.length;
  }

  constructor() {
    this._funcs = new Map<string, T>();
    this._defaultParameters = [];
  }

  /**
   * Add a function to queue.
   *
   * @param fn Functions to be queued
   * @throws Error if `fn` is null, undefined, or if the value
   * is not a function.
   *
   * @returns A **hash** for the function
   */
  enqueue(fn: T) {
    if (!fn) {
      throw new Error("Can not add an null | undefined value");
    }

    if (typeof fn !== "function") {
      throw new Error("Can not add a type that is not a function");
    }

    const hash = createHash();
    this._funcs.set(hash, fn);
    return hash;
  }

  /**
   * Removes a function from the queue
   * @param fn Function to be removed from the queue.
   */

  dequeue(guid: string) {
    if (!guid) {
      return false;
    }

    return this._funcs.delete(guid);
  }

  /**
   * Execute functions with parameters.
   * @param params Parameters to be injected on function in queue.
   */
  async executeAsync<K extends ParametersAsOptional<T>, U extends ReturnType<T>>(
    ...params: K
  ): Promise<U[]> {
    if (!this.hasFunctions) {
      return [];
    }

    const parameters = [...params, ...this._defaultParameters];
    const returnList: U[] = [];

    for (const [, fn] of this._funcs) {
      this.checkFunctionArgumentsSize(fn, parameters);
      const value = await fn(...parameters);
      if (value) {
        returnList.push(value);
      }
    }
    this.clear();
    return returnList;
  }

  /**
   * Execute functions with parameters.
   * @param params Parameters to be injected on function in queue.
   */
  executeSync<K extends ParametersAsOptional<T>, U extends ReturnType<T>>(...params: K): U[] {
    if (!this.hasFunctions) {
      return [];
    }

    const parameters = [...params, ...this._defaultParameters];
    const returnList: U[] = [];

    for (const [, fn] of this._funcs) {
      this.checkFunctionArgumentsSize(fn, parameters);
      const value = fn(...parameters);
      if (value) {
        returnList.push(value);
      }
    }
    this.clear();
    return returnList;
  }

  /**
   * Execute function with exception treatment.
   * So if any function throw a error, it will be handled by an catch function
   * provided in parameters.
   * @param catchAction Function to handle errors.
   * @param params Parameters to the functions.
   */
  tryExecuteSync<K extends ParametersAsOptional<T>, U extends ReturnType<T>>(
    catchAction?: (error: any) => void,
    ...params: K
  ): U[] {
    if (!this.hasFunctions) {
      return [];
    }
    const parameters = [...params, ...this._defaultParameters];
    const returnValues: U[] = [];

    for (const [, fn] of this._funcs) {
      this.checkFunctionArgumentsSize(fn, parameters);
      try {
        const value = fn(...parameters);
        if (value) {
          returnValues.push(value);
        }
      } catch (error) {
        if (catchAction) {
          catchAction(error);
        }
      }
    }
    this.clear();
    return returnValues;
  }

  /**
   * Execute function with exception treatment.
   * So if any function throw a error, it will be handled by an catch function
   * provided in parameters.
   * @param catchAction Function to handle errors.
   * @param params Parameters to the functions.
   */
  async tryExecuteAsync<K extends ParametersAsOptional<T>, U extends ReturnType<T>>(
    catchAction?: GenericFunction,
    ...params: K
  ) {
    if (!this.hasFunctions) {
      return [];
    }

    const parameters = [...params, ...this._defaultParameters];
    const returnValues: U[] = [];

    for (const [, fn] of this._funcs) {
      this.checkFunctionArgumentsSize(fn, parameters);
      try {
        const value = await fn(...parameters);
        if (value) {
          returnValues.push(value);
        }
      } catch (error) {
        if (catchAction) {
          catchAction(error);
        }
      }
    }
    this.clear();
    return returnValues;
  }

  /**
   * Function like *tryExecute()* but return all exceptions if they
   * occur.
   * @param params Parameters to the functions.
   */
  executeWithCatchCollectSync<K extends ParametersAsOptional<T>>(...params: K) {
    if (!this.hasFunctions) {
      return [];
    }

    const parameters = [...params, ...this._defaultParameters];
    const errors: any[] = [];

    for (const [, fn] of this._funcs) {
      this.checkFunctionArgumentsSize(fn, parameters);
      try {
        fn(...parameters);
      } catch (error) {
        errors.push(error);
      }
    }
    this.clear();
    return errors;
  }

  /**
   * Function like *tryExecute()* but return all exceptions if they
   * occur.
   * @param params Parameters to the functions.
   */
  async executeWithCatchCollectAsync<K extends ParametersAsOptional<T>>(...params: K) {
    if (!this.hasFunctions) {
      return [];
    }

    const parameters = [...params, ...this._defaultParameters];
    const errors: any[] = [];

    for (const [, fn] of this._funcs) {
      this.checkFunctionArgumentsSize(fn, parameters);
      try {
        await fn(...parameters);
      } catch (error) {
        errors.push(error);
      }
    }
    this.clear();
    return errors;
  }

  /**
   * Add parameters to be injected on queued functions
   * @param parameter Parameter value
   */
  addDefaultParameters<K extends Parameters<T>>(...parameter: K) {
    if (parameter) {
      this._defaultParameters.push(...parameter);
    }
  }

  /**
   * Removes all default parameters from the queue
   */
  clearDefaultParameters() {
    this._defaultParameters = [];
  }

  /**
   * Removes a specific default parameter
   * @param parameters Parameter to remove
   *
   */
  removeFromDefaultParameter<K extends Parameters<T>>(...parameters: K) {
    if (!this.hasDefaultParameters) {
      return;
    }

    for (const parameter of parameters) {
      const index = this._defaultParameters.indexOf(parameter);
      if (index > -1) {
        this._defaultParameters.splice(index, 1);
      }
    }
  }

  /**
   * Removes all elements from the queue
   * @returns The own queue.
   */
  clear() {
    return this._funcs.clear();
  }

  /**
   * Check if default arguments correctly fill all expected arguments
   * for functions in the queue.
   *
   * @returns `true` if arguments are ok or there is no function added
   * and `false` if it's going to pass more or fewer arguments than necessary.
   *
   * @example
   *
   * const queue = new Queue<(sum: number) => number>();
   * queue.addDefaultParameters(1);
   * queue.addDefaultParameters(3);
   * queue.isDefaultArgumentsValid(); // false - expect 1 arg, received 2
   *
   * const queue2 = new Queue<(sum: number) => number>();
   * queue2.isDefaultArgumentsValid(); // false - expect 1 arg, received 0
   *
   * const queue3 = new Queue<(sum: number) => number>();
   * queue3.addDefaultParameters(1);
   * queue3.isDefaultArgumentsValid(1); // true - expect 1 arg, received 1
   */
  isDefaultArgumentsValid() {
    if (!this.hasFunctions) {
      return true;
    }

    try {
      this.checkFunctionArgumentsSize(this.first(), this.defaultParameters);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Gets the first functions queued or throws a error if
   * empty.
   */
  first() {
    const value = this.firstOrDefault();
    if (value) {
      return value;
    }
    throw new Error("Queue has no value");
  }

  /**
   * Gets the first value of the queue or null if it's
   * empty
   */
  firstOrDefault() {
    if (!this.hasFunctions) {
      return null;
    }

    const keyValue: [string, T] = this._funcs.entries().next().value;
    return keyValue[1];
  }

  private checkFunctionArgumentsSize(fn: GenericFunction, argsToPass: any[]) {
    if (fn.length !== argsToPass.length) {
      throw new Error(
        `Could not pass more arguments ${argsToPass.length} than what the function ${fn.name} supports ${fn.length}`,
      );
    }
  }
}
