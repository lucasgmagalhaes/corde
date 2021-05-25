import chalk from "chalk";
import fs from "fs";
import path from "path";
import { logger } from "../environment";
import { FileError } from "../errors";
import { IConfigOptions, ConfigFileType } from "../types";

const config: IConfigOptions = {
  botPrefix: "",
  silent: false,
  botTestId: "",
  channelId: "",
  cordeBotToken: "",
  guildId: "",
  testMatches: [""],
  botToken: "",
  timeout: 5000,
};

const configString = JSON.stringify(config);

const jsonFile = {
  $schema: "./node_modules/corde/schema/corde.schema.json",
  ...config,
};

const jsFile = `
    /** @type {import('corde/lib/src/types').IConfigOptions} */
    module.exports = ${configString}
`;

const tsFile = jsFile;

/**
 * Initialize a config file with all available options.
 * Formatted using **prettier**
 *
 * @version 1.0
 *
 * @param fileType Possible type of file
 *
 * @throws Error if could not create the config file
 */
export function init(fileType: ConfigFileType = "json") {
  let fileContent = "";

  // No declaration of fileType is considered 'json'

  if (!fileType) {
    fileType = "json";
  }

  if (fileType === "json") {
    fileContent = JSON.stringify(jsonFile);
  } else if (fileType === "js") {
    fileContent = jsFile;
  } else if (fileType === "ts") {
    fileContent = tsFile;
  } else {
    logger.log(
      ` - ${chalk.bold(fileType)} is not a valid type. Use '${chalk.bold(
        "init --help",
      )}' to check valid types`,
    );
  }

  try {
    const fileName = `corde.config.${fileType}`;
    const filePath = path.resolve(process.cwd(), fileName);
    fileContent = formatFile(fileContent, fileType);
    fs.writeFileSync(filePath, fileContent);
    logger.log(
      `- ${chalk.green("Successfully")} generated corde config in ${chalk.bold(filePath)}`,
    );
  } catch (error) {
    throw new FileError(
      " - Fail in config file creation. Check if you have permission to create files in this directory.",
    );
  }
}

function formatFile(file: string, type: ConfigFileType) {
  let formater: "object" | "json" = "json";

  if (type === "js" || type === "ts") {
    formater = "object";
  }

  return format(file, {
    formater,
    size: 2,
    type: "space",
  });
}

/**
 * Code adapted from
 * @see https://github.com/luizstacio/json-format
 */

interface Config {
  type: "space" | "tab";
  size: number;
  formater: "json" | "object";
}

let p: string[] = [];

const indentConfig = {
  tab: { char: "\t", size: 1 },
  space: { char: " ", size: 4 },
};

const configDefault: Config = {
  type: "tab",
  size: 2,
  formater: "json",
};

function push(m: string) {
  return "\\" + p.push(m) + "\\";
}

function pop(_: string, i: number) {
  return p[i - 1];
}

function tabs(count: number, indentType: string) {
  return new Array(count + 1).join(indentType);
}

function format(json: Record<string, unknown> | string, config: Config) {
  config = config || configDefault;
  const indent = indentConfig[config.type];

  const indentType = new Array((config.size || indent.size) + 1).join(indent.char);

  let stringObjt = typeof json === "string" ? json : JSON.stringify(json);

  if (config.formater === "object") {
    // Removes double cotes from generated string in JSON
    // format
    stringObjt = stringObjt.replace(/"([^"]+)":/g, "$1:");
  }

  return formatStringObject(stringObjt, indentType);
}

function formatStringObject(json: string, indentType: string) {
  p = [];
  let out = "";
  let indent = 0;

  // Extract backslashes and strings
  json = json
    .replace(/\\./g, push)
    .replace(/(".*?"|'.*?')/g, push)
    .replace(/\s+/, "");

  // Indent and insert newlines
  for (let i = 0; i < json.length; i++) {
    const c = json.charAt(i);

    switch (c) {
      case "{":
        out += c + "\n" + tabs(++indent, indentType);
        break;
      case "}":
        out += "\n" + tabs(--indent, indentType) + c;
        break;
      case ",":
        out += ",\n" + tabs(indent, indentType);
        break;
      case ":":
        out += ": ";
        break;
      default:
        out += c;
        break;
    }
  }

  // Strip whitespace from numeric arrays and put backslashes
  // and strings back in
  out = out
    .replace(/\[[\d,\s]+?\]/g, (m) => {
      return m.replace(/\s/g, "");
    })
    .replace(/\\(\d+)\\/g, pop) // strings
    .replace(/\\(\d+)\\/g, pop); // backslashes in strings

  return out;
}
