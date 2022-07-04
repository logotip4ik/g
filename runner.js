import { $ } from "zx";

$.quote = (...ev) => ev.join(" ");

/**
 * @typedef {object} Options
 * @property {boolean | string | null} options.pull
 * @property {boolean | string | null} options.push
 * @property {boolean | string | null} options.include
 * @property {boolean | string | null} options.message
 * @property {boolean | string | null} options.origin
 */

/**
 * @param {Options} options
 * @returns {Promise<void>} array of strings with which user commands will be executed
 */
export async function createInitWithOptions(options) {
  const initialBranchName =
    process.argv[3] && !process.argv[3].startsWith("-")
      ? process.argv[3]
      : "master";

  await $`git init -b ${initialBranchName}`;

  if (!options.include || options.include === true) await $`git add .`;
  else await $`git add ${options.include}`;

  if (!options.message || options.message === true)
    await $`git commit -m "init"`;
  else await $`git commit -m "init: ${options.message}"`;
}

/**
 * @param {Options} options
 * @returns {Promise<void>}
 */
export async function createUpdateWithOptions(options) {
  const currentBrach = (await $`git branch --show-current`).toString().trim();

  if (options.pull) {
    if (typeof options.pull === "boolean")
      await $`git pull origin ${currentBrach.toString()}`;
    else await $`git pull origin ${options.pull}`;
  }

  if (!options.include || options.include === true) await $`git add .`;
  else await $`git add ${options.include}`;

  if (!options.message || options.message === true)
    await $`git commit -m "update"`;
  else await $`git commit -m "update: ${options.message}"`;

  if (options.push) {
    const branch =
      typeof options.push === "string" ? options.push : currentBrach;
    const origin =
      typeof options.origin === "string" ? options.origin : "origin";

    await $`git push ${origin} ${branch}`;
  }
}

/**
 * @param {Options} options
 * @returns {Promise<void>}
 */
export async function createFixWithOptions(options) {
  const currentBrach = (await $`git branch --show-current`).toString().trim();

  if (options.pull) {
    if (typeof options.pull === "boolean")
      await $`git pull origin ${currentBrach.toString()}`;
    else await $`git pull origin ${options.pull}`;
  }

  if (!options.include || options.include === true) await $`git add .`;
  else await $`git add ${options.include}`;

  if (!options.message || options.message === true)
    await $`git commit -m "fix"`;
  else await $`git commit -m "fix: ${options.message}"`;

  if (options.push) {
    const branch =
      typeof options.push === "string" ? options.push : currentBrach;
    const origin =
      typeof options.origin === "string" ? options.origin : "origin";

    await $`git push ${origin} ${branch}`;
  }
}

/**
 * @param {Options} options
 * @returns {Promise<void>}
 */
export async function createLogWithOptions(options) {
  const currentBrach = (await $`git branch --show-current`).toString().trim();

  if (options.pull) {
    if (typeof options.pull === "boolean")
      await $`git pull origin ${currentBrach.toString()}`;
    else await $`git pull origin ${options.pull}`;
  }

  await $`git status -s`;

  await $`git log --pretty="%h - %an - %s" -5`;
}

/**
 * @param {Options} options
 * @returns {Promise<void>}
 */
export async function createSyncWithOptions(_options) {
  await createPullWithOptions();

  await createPushWithOptions();
}

/**
 * @param {Options} _options
 * @returns {Promise<void>}
 */
export async function createPullWithOptions(_options) {
  let origin = "";
  let branch = "";

  // g pull
  if (
    (!process.argv[3] || process.argv[3].startsWith("-")) &&
    (!process.argv[4] || process.argv[4].startsWith("-"))
  ) {
    origin = "origin";
    branch = await $`git branch --show-current`;
  }
  // g pull v5
  else if (
    !process.argv[3].startsWith("-") &&
    (!process.argv[4] || process.argv[4].startsWith("-"))
  ) {
    origin = "origin";
    branch = process.argv[3];
  }
  // g push master v5
  else if (
    !process.argv[3].startsWith("-") &&
    !process.argv[4].startsWith("-")
  ) {
    origin = process.argv[3].trim();
    branch = process.argv[4].trim();
  }

  await $`git pull ${origin} ${branch}`;
}

/**
 * @param {Options} _options
 * @returns {Promise<void>}
 */
export async function createPushWithOptions(_options) {
  let origin = "";
  let branch = "";

  // g push
  if (
    (!process.argv[3] || process.argv[3].startsWith("-")) &&
    (!process.argv[4] || process.argv[4].startsWith("-"))
  ) {
    origin = "origin";
    branch = await $`git branch --show-current`;
  }
  // g push v5
  else if (
    !process.argv[3].startsWith("-") &&
    (!process.argv[4] || process.argv[4].startsWith("-"))
  ) {
    origin = "origin";
    branch = process.argv[3];
  }
  // g push master v5
  else if (
    !process.argv[3].startsWith("-") &&
    !process.argv[4].startsWith("-")
  ) {
    origin = process.argv[3].trim();
    branch = process.argv[4].trim();
  }

  await $`git push ${origin} ${branch}`;
}
