import { execSync } from "child_process";

import { currentBranchCommand } from "./constants.mjs";
import { checkStdoutForError } from "./utils.mjs";

/**
 * @param {object} options
 * @param {boolean} options.pull
 * @param {boolean} options.push
 * @param {string} options.include
 * @param {string} options.message
 * @returns {string[]} array of strings with which user commands will be executed
 */
export function createUpdateWithOptions(options) {
  const currentBrach = runCommand(currentBranchCommand);
  const commands = [];

  if (options.pull) {
    if (typeof options.pull === "boolean")
      commands.push(`git pull origin ${currentBrach}`);
    else commands.push(`git pull origin ${options.pull}`);
  }

  if (!options.include || options.include === true) commands.push(`git add .`);
  else commands.push(`git add ${options.include}`);

  if (!options.message || options.message === true)
    commands.push(`git commit "update"`);
  else commands.push(`git commit "update:${options.message}"`);

  if (options.push) {
    if (typeof options.push === "boolean")
      commands.push(`git push origin ${currentBrach}`);
    else commands.push(`git push origin ${options.push}`);
  }

  return commands;
}

/**
 * @param {string} command command to run in process
 */
export function runCommand(command) {
  const result = String(execSync(command)).trim();

  const error = checkStdoutForError(result);

  if (error) {
    process.exit();
  }

  return result;
}
