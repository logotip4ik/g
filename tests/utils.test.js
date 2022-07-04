import { strict as assert } from "assert";

import { parseArgs } from "../utils.mjs";

export function testParseArgs() {
  const argsResults = new Map([
    [
      "_ _ fix -m added some fixes -ph".split(" "),
      {
        commandType: "update",
        commitType: "fix",
        options: { m: " added some fixes", ph: true },
      },
    ],
    [
      "_ _ chore! -m added some fixes -ph -pl".split(" "),
      {
        commandType: "update",
        commitType: "chore!",
        options: { m: " added some fixes", ph: true, pl: true },
      },
    ],
    [
      "_ _ build(npm) -m added some fixes -ph -pl".split(" "),
      {
        commandType: "update",
        commitType: "build(npm)",
        options: { m: " added some fixes", ph: true, pl: true },
      },
    ],
    [
      "_ _ sync".split(" "),
      { commandType: "sync", commitType: "", options: {} },
    ],
    [
      "_ _ push".split(" "),
      { commandType: "push", commitType: "", options: {} },
    ],
    [
      "_ _ pull".split(" "),
      { commandType: "pull", commitType: "", options: {} },
    ],
  ]);

  argsResults.forEach((result, args) => {
    const { commandType, commitType, options } = parseArgs(args);

    console.log(commandType, commitType, options);

    assert.equal(commandType, result.commandType);
    assert.deepStrictEqual(commitType, result.commitType);
    assert.deepStrictEqual(options, result.options);
  });
}
