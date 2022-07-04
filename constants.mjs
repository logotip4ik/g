export const commands = {
  INIT: "init",
  UPDATE: "update",
  FIX: "fix",
  LOG: "log",
  SYNC: "sync",
  PULL: "pull",
  PUSH: "push",
  VERSION: "version",
};

export const defaultCommand = commands.UPDATE;

// NOTE: each option should have to names
// NOTE: FIRST WORD SHOULD BE SHORT VERSION OF THE OPTION
export const options = new Set([
  "m",
  "message",
  //
  "ph",
  "push",
  //
  "pl",
  "pull",
  //
  "i",
  "include",
  //
  "o",
  "origin",
]);

export const currentBranchCommand = "git branch --show-current";
