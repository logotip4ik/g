import fs from "fs";
import chalk from "chalk";

import {
  options,
  commands,
  defaultCommand,
  commitTypes,
} from "./constants.mjs";
import path from "path";

/**
 * @param {NodeJS.Process.argv} argv
 * @returns {{ commandType:string, commitType: string, options: {string:string} }}
 */
export function parseArgs(argv) {
  const _executable = argv[0];
  const _fileRunning = argv[1];

  let userCommand = "";
  let userCommitType = "";

  let possibleCommitType = "";

  if (argv[2].includes("!"))
    possibleCommitType = argv[2].split("!")[0].toUpperCase();
  else if (argv[2].includes("("))
    possibleCommitType = argv[2].split("(")[0].toUpperCase();
  else possibleCommitType = argv[2].toUpperCase();

  if (!commands[argv[2].toUpperCase()] && commitTypes[possibleCommitType]) {
    userCommand = defaultCommand;
    userCommitType = argv[2];
  } else if (
    commands[argv[2].toUpperCase()] &&
    !commitTypes[possibleCommitType]
  ) {
    userCommand = commands[argv[2].toUpperCase()];
    userCommitType = "";
  } else {
    printError(`no commit type was specified`);
    process.exit();
  }

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

  return {
    commandType: userCommand,
    commitType: userCommitType,
    options: userOptions,
  };
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
 * Prints error-like message into console
 * @param {string[]} message
 */
export function printError(...message) {
  console.log(`$ ${chalk.redBright(message.join(" "))}`);
}

/**
 * Prints warning-like message into console
 * @param {string[]} message
 */
export function printWarning(...message) {
  console.log(`$ ${message.join(" ")}`);
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
