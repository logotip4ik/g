export const commands = {
  INIT: "init",
  UPDATE: "update",
  FIX: "fix",
  LOG: "log",
  SYNC: "sync",
  PULL: "pull",
  PUSH: "push",
};

export const defaultCommand = commands.UPDATE;

// NOTE: each option should have to names
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
]);
