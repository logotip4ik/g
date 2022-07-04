#!/usr/bin/env node

import chalk from "chalk";
import { commands } from "./constants.mjs";
import {
  createInitWithOptions,
  createUpdateWithOptions,
  createFixWithOptions,
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

const [command, options] = parseArgs(ARGV);
const normalizedOptions = normalizeOptions(options);

if (command === commands.VERSION) {
  const version = getVersion();

  console.log(`$ ${chalk.greenBright("g")} at: ${version}`);

  process.exit();
}

if (command === commands.INIT)
  await createInitWithOptions(normalizedOptions).catch(() => process.exit());
if (command === commands.UPDATE)
  await createUpdateWithOptions(normalizedOptions).catch(() => process.exit());
if (command === commands.LOG)
  await createLogWithOptions(normalizedOptions).catch(() => process.exit());
if (command === commands.SYNC)
  await createSyncWithOptions(normalizedOptions).catch(() => process.exit());
if (command === commands.PUSH)
  await createPushWithOptions(normalizedOptions).catch(() => process.exit());
if (command === commands.PULL)
  await createPullWithOptions(normalizedOptions).catch(() => process.exit());
