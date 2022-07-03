import chalk from "chalk";

import { options, commands, defaultCommand } from "./constants.mjs";

/**
 * @param {NodeJS.Process.argv} argv
 * @returns {[string, {string: string}]}
 */
export function parseArgs(argv) {
  const _executable = argv[0];
  const _fileRunning = argv[1];

  if (!argv[2].startsWith("-") && !commands[argv[2].toUpperCase()]) {
    printError(`unknown command ${chalk.underline(argv[2])}`);
    process.exit();
  }

  const userCommand = argv[2].startsWith("-")
    ? defaultCommand
    : commands[argv[2].toUpperCase()];

  const userOptions = {};

  for (let i = 2; i < argv.length; i++) {
    if (argv[i].startsWith("-")) {
      const optionType = argv[i].slice(1).toLowerCase();

      if (!argv[i + 1] || argv[i + 1]?.startsWith("-")) {
        userOptions[optionType] = true;
        continue;
      }

      const { text, newI } = getText(argv, i + 1);

      i = newI;

      userOptions[optionType] = text;
    }
  }

  return [userCommand, userOptions];
}

function getText(array, startI) {
  let text = "";

  for (let i = startI; i < array.length; i++) {
    if (array[i].startsWith("-")) return { text, newI: i - 1 };

    text += ` ${array[i]}`;
  }

  return { text, newI: array.length };
}

/**
 * Prints error-like message into console
 * @param {string[]} message
 */
export function printError(...message) {
  const currentTime = getCurrentTime();

  const time = chalk.blueBright(`[${currentTime}]`);

  console.log(`${time} ${chalk.red(message.join(" "))}`);
}

/**
 * Prints warning-like message into console
 * @param {string[]} message
 */
export function printWarning(...message) {
  const currentTime = getCurrentTime();

  const time = chalk.blueBright(`[${currentTime}]`);

  console.log(`${time} ${chalk.yellow(message.join(" "))}`);
}

export function getCurrentTime() {
  const now = new Date();

  return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
}
