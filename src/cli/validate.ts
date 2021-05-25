import chalk from "chalk";
import { FileError, PropertyError } from "../errors";
import { IConfigOptions } from "../types";
import { stringIsNullOrEmpty, utils } from "../utils";

/**
 * Check if configs are valid. Throws an exception
 * if there is no parameter or if any required property is
 * missing.
 *
 * @version 1.0
 *
 * @param configs Config parameter that will be validated
 *
 * @throws Error if any config is invalid.
 */
export async function validate(configs: IConfigOptions) {
  if (!configs) {
    throw new FileError(chalk.red("● configs not informed."));
  }

  const errors: string[] = [];

  addToErrorsIfPropertyIsMissing(configs.botPrefix, errors, "botPrefix");
  addToErrorsIfPropertyIsMissing(configs.botTestId, errors, "botTestId");
  addToErrorsIfPropertyIsMissing(configs.channelId, errors, "channelId");
  addToErrorsIfPropertyIsMissing(configs.cordeBotToken, errors, "cordeBotToken");
  addToErrorsIfPropertyIsMissing(configs.guildId, errors, "guildId");
  addToErrorsIfPropertyIsMissing(configs.botToken, errors, "botToken");
  await validatePaths(configs.testMatches, errors);

  let errorsString = "";

  if (errors.length > 0) {
    errorsString = chalk.red(
      "\n● Corde validation report: see https://corde.netlify.app/docs/configurations \n  ",
    );

    if (errors.length === 1) {
      errorsString += chalk.red("an required property is missing in config file:\n");
      buildMissingPropertiesErrorAndThrow(errorsString, errors);
    }

    if (errors.length > 1) {
      errorsString += chalk.red("some required properties are missing in config file\n");
      buildMissingPropertiesErrorAndThrow(errorsString, errors);
    }
  }
}

async function validatePaths(pathsDir: string[] | undefined, errors: string[]) {
  pathsDir = pathsDir?.filter((p) => p);

  if (!pathsDir || pathsDir.length === 0) {
    errors.push("No test files informed." + chalk.cyan("(testMatches)"));
    return;
  }

  for (const pathDir of pathsDir) {
    const files = await utils.getFiles(pathDir);

    if (files.length === 0) {
      errors.push(`path: ${pathDir} does not exists`);
    }
  }
}

function addToErrorsIfPropertyIsMissing(
  value: string | undefined,
  errors: string[],
  message: string,
) {
  if (stringIsNullOrEmpty(value)) {
    errors.push(message);
  }
}

function buildMissingPropertiesErrorAndThrow(errorString: string, erros: string[]) {
  erros.forEach((error) => (errorString += `  ${chalk.red(`- ${error}`)}\n`));
  throw new PropertyError(errorString);
}
