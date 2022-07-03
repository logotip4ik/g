import { strict as assert } from "assert";

import { parseArgs } from "../utils.mjs";

export function testParseArgs() {
  const argsResults = new Map([
    [
      "_ _ fix -m added some fixes -ph".split(" "),
      ["fix", { m: " added some fixes", ph: true }],
    ],
    [
      "_ _ -m added some fixes -ph -pl".split(" "),
      ["update", { m: " added some fixes", ph: true, pl: true }],
    ],
    ["_ _ sync".split(" "), ["sync", {}]],
    ["_ _ push".split(" "), ["push", {}]],
    ["_ _ pull".split(" "), ["pull", {}]],
  ]);

  argsResults.forEach((result, args) => {
    const [command, options] = parseArgs(args);

    assert.equal(command, result[0]);
    assert.deepStrictEqual(options, result[1]);
  });
}
