import chalk from "chalk";
import { InspectOptions } from "util";
import { MESSAGE_TAB_SPACE } from "../consts";
import { getStackTrace } from "../utils";

export interface StackContainer {
  name: string;
  data: StackData;
}

export interface StackData {
  values: any[];
  printFunction: (...args: any[]) => void;
  trace: string;
}

type StdoutStream = NodeJS.WriteStream & { fd: 1 };

/**
 * @private
 */
export class Logger implements Console {
  public stack: Array<StackContainer> = [];

  private _stdout: StdoutStream;

  private _log: Console["log"];
  private _error: Console["error"];
  private _debug: Console["debug"];
  private _info: Console["info"];
  private _warn: Console["warn"];

  private _count: Console["count"];
  private _clear: Console["clear"];
  private _assert: Console["assert"];
  private _countReset: Console["countReset"];

  private _dir: Console["dir"];
  private _dirxml: Console["dirxml"];
  private _exception: Console["exception"];
  private _group: Console["group"];

  private _groupCollapsed: Console["groupCollapsed"];
  private _groupEnd: Console["groupEnd"];
  private _profile: Console["profile"];
  private _profileEnd: Console["profileEnd"];
  private _table: Console["table"];
  private _time: Console["time"];
  private _timeEnd: Console["timeEnd"];
  private _timeLog: Console["timeLog"];
  private _timeStamp: Console["timeStamp"];
  private _trace: Console["trace"];

  constructor(stdout: StdoutStream) {
    this._stdout = stdout;

    this._log = console.log;
    this._error = console.error;
    this._debug = console.debug;
    this._info = console.info;
    this._warn = console.warn;

    this._clear = console.clear;
    this._count = console.count;
    this._assert = console.assert;
    this._countReset = console.countReset;

    this._dir = console.dir;
    this._dirxml = console.dirxml;
    this._assert = console.assert;
    this._exception = console.exception;
    this._assert = console.assert;

    this._group = console.group;
    this._groupCollapsed = console.groupCollapsed;
    this._groupEnd = console.groupEnd;
    this._profile = console.profile;

    this._profileEnd = console.profileEnd;
    this._table = console.table;
    this._time = console.time;
    this._timeEnd = console.timeEnd;

    this._timeLog = console.timeLog;
    this._timeStamp = console.timeStamp;
    this._trace = console.trace;
  }

  get Console(): any {
    return console;
  }

  get memory() {
    return console.memory;
  }

  assert(condition?: boolean, ...data: any[]): void;
  assert(value: any, message?: string, ...optionalParams: any[]): void;
  assert(value?: any, message?: any, ...optionalParams: any[]) {
    this._assert(value, message, ...optionalParams);
  }

  clear(): void;
  clear(): void;
  clear() {
    this._clear();
  }

  countReset(label?: string): void;
  countReset(label?: string): void;
  countReset(label?: any) {
    this._countReset(label);
  }

  dir(item?: any, options?: any): void;
  dir(obj: any, options?: InspectOptions): void;
  dir(obj?: any, options?: any) {
    if (options) {
      this._dir(obj, options);
      return;
    }
    this._dir(obj);
  }

  dirxml(...data: any[]): void;
  dirxml(...data: any[]): void;
  dirxml(...data: any[]) {
    this._dirxml(...data);
  }

  exception(message?: string, ...optionalParams: any[]): void {
    if (this._exception) {
      this._exception(message, ...optionalParams);
    }
  }

  group(...data: any[]): void;
  group(...label: any[]): void;
  group(...label: any[]) {
    this._group(...label);
  }

  groupCollapsed(...data: any[]): void;
  groupCollapsed(...label: any[]): void;
  groupCollapsed(...label: any[]) {
    this._groupCollapsed(...label);
  }

  groupEnd(): void;
  groupEnd(): void;
  groupEnd() {
    this._groupEnd();
  }

  table(tabularData?: any, properties?: string[]): void;
  table(tabularData: any, properties?: readonly string[]): void;
  table(tabularData?: any, properties?: any) {
    if (properties) {
      this._table(tabularData, ...properties);
      return;
    }

    this._table(tabularData);
  }

  time(label?: string): void;
  time(label?: string): void;
  time(label?: any) {
    this._time(label);
  }

  timeEnd(label?: string): void;
  timeEnd(label?: string): void;
  timeEnd(label?: any) {
    this._timeEnd(label);
  }

  timeLog(label?: string, ...data: any[]): void;
  timeLog(label?: string, ...data: any[]): void;
  timeLog(label?: any, ...data: any[]) {
    this._timeLog(label, ...data);
  }

  timeStamp(label?: string): void;
  timeStamp(label?: string): void;
  timeStamp(label?: any) {
    if (this._timeStamp) {
      this._timeStamp(label);
    }
  }

  trace(...data: any[]): void;
  trace(message?: any, ...optionalParams: any[]): void;
  trace(message?: any, ...optionalParams: any[]) {
    this._trace(message, ...optionalParams);
  }

  profile(label?: string): void {
    if (this._profile) {
      this._profile(label);
    }
  }

  profileEnd(label?: string): void {
    if (this._profileEnd) {
      this._profileEnd(label);
    }
  }

  /**
   * Override all console functions that print values.
   */
  mock() {
    console.log = this.overridePrint("log", this._log);
    console.error = this.overridePrint("error", this._error);
    console.debug = this.overridePrint("debug", this._debug);
    console.info = this.overridePrint("info", this._info);

    console.warn = this.overridePrint("warn", this._warn);
    console.dir = this.overridePrint("dir", this._dir);
    console.dirxml = this.overridePrint("dirxml", this._dirxml);
    console.table = this.overridePrint("table", this._table);
    console.assert = this.overridePrint("assert", this._assert);

    console.count = this.overridePrint("count", this._count);
    console.timeEnd = this.overridePrint("timeEnd", this._timeEnd);
    console.trace = this.overridePrint("trace", this._trace);

    // We must avoid console clear up.
    console.clear = this.createEmptyFunction();

    console.group = this.createEmptyFunction();
    console.groupEnd = this.createEmptyFunction();
    console.groupCollapsed = this.createEmptyFunction();

    if (console.profile) {
      console.profile = this.createEmptyFunction();
    }

    if (console.profileEnd) {
      console.profileEnd = this.createEmptyFunction();
    }

    console.timeStamp = this.createEmptyFunction();

    if (console.exception) {
      console.exception = this.createEmptyFunction();
    }

    console.countReset = this.createEmptyFunction();
  }

  unmock() {
    console.log = this._log;
    console.error = this._error;
    console.debug = this._debug;
    console.info = this._info;

    console.warn = this._warn;
    console.dir = this._dir;
    console.dirxml = this._dirxml;
    console.table = this._table;
    console.assert = this._assert;

    console.count = this._count;
    console.timeEnd = this._timeEnd;
    console.trace = this._trace;

    // We must avoid console clear up.
    console.clear = this._clear;

    console.group = this._group;
    console.groupEnd = this._groupEnd;
    console.groupCollapsed = this._groupCollapsed;
    console.profile = this._profile;
    console.profileEnd = this._profileEnd;
    console.timeStamp = this._timeStamp;

    console.exception = this._exception;
    console.countReset = this._countReset;
  }

  private createEmptyFunction() {
    return () => {
      return;
    };
  }

  log(...message: any[]): void;
  log(message?: any, ...optionalParams: any[]) {
    this._log(message, ...optionalParams);
  }

  count(label?: string) {
    this._count(label);
  }

  info(...message: any[]): void;
  info(message?: any, ...optionalParams: any[]) {
    this._info(message, ...optionalParams);
  }

  warn(...message: any[]): void;
  warn(message?: any, ...optionalParams: any[]) {
    this._warn(message, ...optionalParams);
  }

  error(...message: any[]): void;
  error(message?: any, ...optionalParams: any[]) {
    this._error(chalk.red(message), ...optionalParams);
  }

  debug(...message: any[]): void;
  debug(message?: any, ...optionalParams: any[]) {
    this._debug(message, ...optionalParams);
  }

  /**
   * Prints all recorded call to `console.log|info|warn|debug|error`
   */
  printStacks() {
    if (this.stack.length === 0) {
      return;
    }

    this._stdout.write("\n");

    this.stack.forEach((stackItem) => {
      this._stdout.write(`● console.${stackItem.name}\n\n`);

      stackItem.data.values.forEach((value) => {
        stackItem.data.printFunction(`${MESSAGE_TAB_SPACE}${MESSAGE_TAB_SPACE}${value}`);
        this._stdout.write("\n" + stackItem.data.trace + "\n\n");
      });
    });
    this.stack = [];
  }

  private overridePrint(name: string, printFunction: (...args: any[]) => void) {
    return (...args: any[]) => {
      const trace = getStackTrace(undefined, true, undefined, MESSAGE_TAB_SPACE);
      this.stack.push({
        name: name,
        data: {
          trace,
          printFunction,
          values: args,
        },
      });
    };
  }
}
