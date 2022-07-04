export const commands = {
  INIT: "init",
  UPDATE: "update",
  LOG: "log",
  SYNC: "sync",
  PULL: "pull",
  PUSH: "push",
  VERSION: "version",
};

export const commitTypes = {
  FEAT: "feat", // Features
  FIX: "fix", // Bug Fixes
  DOCS: "docs", // Documentation
  STYLE: "style", // Styles
  REFACTOR: "refactor", // Code Refactoring
  PERF: "perf", // Performance Improvements
  TEST: "test", // Tests
  BUILD: "build", // Builds
  CI: "ci", // Continuous Integrations
  CHORE: "chore", // Chores
  REVERT: "revert", // Reverts
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
