#!/usr/bin/env node

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
import { parseArgs, normalizeOptions, printError } from "./utils.mjs";

const ARGV = process.argv;

if (ARGV.length <= 2) {
  printError("provide at least 1 argument");

  process.exit();
}

const [command, options] = parseArgs(ARGV);
const normalizedOptions = normalizeOptions(options);

if (command === commands.INIT) createInitWithOptions(normalizedOptions);
if (command === commands.UPDATE) createUpdateWithOptions(normalizedOptions);
if (command === commands.FIX) createFixWithOptions(normalizedOptions);
if (command === commands.LOG) createLogWithOptions(normalizedOptions);
if (command === commands.SYNC) createSyncWithOptions(normalizedOptions);
if (command === commands.PUSH) createPushWithOptions(normalizedOptions);
if (command === commands.PULL) createPullWithOptions(normalizedOptions);
