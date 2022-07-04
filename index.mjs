#!/usr/bin/env node

import chalk from "chalk";
import { commands } from "./constants.mjs";
import {
  createInitWithOptions,
  createUpdateWithOptionsAndType,
  createLogWithOptions,
  createSyncWithOptions,
  createPushWithOptions,
  createPullWithOptions,
} from "./runner.js";
import {
  parseArgs,
  normalizeOptions,
  printError,
  getVersion,
} from "./utils.mjs";

const ARGV = process.argv;

if (ARGV.length <= 2) {
  printError("provide at least 1 argument");

  process.exit();
}

const { commandType, commitType, options } = parseArgs(ARGV);
const normalizedOptions = normalizeOptions(options);

if (commandType === commands.VERSION) {
  const version = getVersion();

  console.log(`$ ${chalk.greenBright("g")} at: ${version}`);

  process.exit();
}

if (commandType === commands.INIT)
  await createInitWithOptions(normalizedOptions).catch(() => process.exit());

if (commandType === commands.UPDATE)
  await createUpdateWithOptionsAndType(normalizedOptions, commitType).catch(
    () => process.exit()
  );

if (commandType === commands.LOG)
  await createLogWithOptions(normalizedOptions).catch(() => process.exit());

if (commandType === commands.SYNC)
  await createSyncWithOptions(normalizedOptions).catch(() => process.exit());

if (commandType === commands.PUSH)
  await createPushWithOptions(normalizedOptions).catch(() => process.exit());

if (commandType === commands.PULL)
  await createPullWithOptions(normalizedOptions).catch(() => process.exit());
