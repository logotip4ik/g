# g (shell command)

## About

This command will help you to automate your git flow with ease

## Installation

Install it globally to use it where you want

- npm

  ```shell
  $ npm i -g @logotip4ik/g
  ```

- yarn
  ```shell
  $ yarn global add @logotip4ik/g
  ```

## Usage:

### Available commands:

- init - initialize git
- update - create commit with `update` message (ex. `"update: ..."`)
- fix - create commit with `fix` message (ex. `"fix: ..."`)
- log - log to console current branch, last 5 commits and not staged files
- sync - pull and push from origin, accepts the same arguments as pull
- pull - pull from origin  
  can accept this arguments:
  - `g pull` - will pull from origin and current branch
  - `g pull v5` - will pull from origin and `v5` branch
  - `g pull fake-origin v5` - will pull from `fake-origin` and `v5` branch
- push - push to the origin, accepts the same arguments as pull

### Examples

- init with message and `v2` branch name:

  ```shell
  $ g init v2 -m just for example
  ```

  what it gonna do:

  ```shell
  $ git init -b v2
  $ git add .
  $ git commit -m "init: <your message passed via -m flag>"
  $ git push origin <your current branch>
  ```

- create an update with message and push to origin:

  ```shell
  $ g -m just for example -i ./that/dummy/file.js -ph
  ```

  what it gonna do:

  ```shell
  $ git add <files specified by -i flag> ./that/dummy/file.js
  $ git commit -m "update: <your message passed via -m flag>"
  $ git push origin <current branch>
  ```

- create fix with a message and push to `v3` branch:

  ```shell
  $ g -m just for example -i ./that/dummy/file.js -ph v3
  ```

  what it gonna do:

  ```$
  $ git add .
  $ git commit -m "fix: <your message passed via -m flag>"
  $ git push origin v3
  ```
