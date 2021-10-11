# g (shell command)

## About

This command will help you to automate your git flow with ease

## Usage:

```
usage: g.exe [-h] [-m [MSG ...]] [-i [INCLUDE...]] [-p] [--all-commits] [{update,fix,init,sync,log}]

positional arguments:
  {update,fix,init,sync,log}
                        Type of command to execute (default: "update")

optional arguments:
  -h, --help            show this help message and exit
  -m [MSG ...], --msg [MSG ...]
                        Message with which the command will be executed (<command(by default update)>: <your message>)
  -i [INCLUDE ...], --include [INCLUDE ...]
                        What files will be added to comming (by default it will add everything it current directory)
  -p --push             Push your code to remote
  -a --all-commits      Print all your commits insted of only 3
```

_example:_

- what you type:

  ```
  g init -m "just for example"
  ```

  what it gonna do:

  ```
  git init
  git add -A .
  git commit -m "init: <your message passed via -m flag>"
  git push origin <your current branch>
  ```

- what you type:

  ```
  g -m "just for example" -i ./that/dummy/file.js
  ```

  what it gonna do:

  ```
  git add <files specified by -i flag> ./that/dummy/file.js
  git commit -m "update: <your message passed via -m flag>"
  ```

- what you type:

  ```
  g -m "just for example" -p
  ```

  what it gonna do:

  ```
  git add -A .
  git commit -m "update: <your message passed via -m flag>"
  git pull origin <your current branch>
  git push origin <your current branch>
  ```

### P.S.

You can add compiled file to your path env variable and use it like: `g -m just for test -i index.js`
