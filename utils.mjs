import fs from "fs";
import chalk from "chalk";

import { options, commands, defaultCommand } from "./constants.mjs";
import path from "path";

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
 * Creates a normalized options object (ex. { m: "help me" } => { message: "help me" })
 * @param {object} args
 */
export function normalizeOptions(args) {
  const optionsArray = Array.from(options);

  const mapper = {};
  const result = {};

  let prevKey = "";
  for (let i = 0; i < optionsArray.length; i++) {
    if (i % 2 === 1) mapper[prevKey] = optionsArray[i];
    else prevKey = optionsArray[i];
  }

  for (const key of Object.keys(args)) {
    const normalizedKey = mapper[key] || key;

    result[normalizedKey] =
      typeof args[key] === "string" ? args[key].trim() : args[key];
  }

  return result;
}

/**
 * Checks for error in string, if finds logs error else will do nothing
 * @param {string} string
 * @returns {boolean} weather stdout has error or no
 */
export function checkStdoutForError(string) {
  let hasError = false;

  if (string.includes("fatal")) {
    hasError = true;

    printError(string);
  }

  return hasError;
}

/**
 * Prints error-like message into console
 * @param {string[]} message
 */
export function printError(...message) {
  const m = " " + message.join(" ") + " ";

  console.log(`$ ${chalk.redBright(m)}`);
}

/**
 * Prints warning-like message into console
 * @param {string[]} message
 */
export function printWarning(...message) {
  const m = " " + message.join(" ") + " ";

  console.log(`$ ${chalk.yellowBright(m)}`);
}

/**
 * @returns {string} version number of `g` package
 */
export function getVersion() {
  const cwd = process.cwd();

  const pkgRaw = fs.readFileSync(path.join(cwd, "package.json"));
  const pkg = JSON.parse(pkgRaw);

  return pkg.version;
}
