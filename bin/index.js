#!/usr/bin/env node

(async function () {
  const main = await import("../index.mjs");

  await main();
})();
