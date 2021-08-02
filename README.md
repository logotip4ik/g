# g (shell command)

## About

This command will help you to automate your git flow with ease

## Usage:

```
usage: g.exe [-h] [-m [MSG [MSG ...]]] [--no-push] [--all-commits] [{update,fix,init,sync,status}]

positional arguments:
  {update,fix,init,sync,status}
                        Type of command to execute (default: "update")

optional arguments:
  -h, --help            show this help message and exit
  -m [MSG [MSG ...]], --msg [MSG [MSG ...]]
                        Message with which the command will be executed (update: <your message>)
  --no-push             Don't push your code to remote
  --all-commits         Print all your commits insted of only 2
```

_example:_

- what you type:

  ```
  py main.py -m init "just for example"
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
  py main.py -m "just for example"
  ```

  what it gonna do:

  ```
  git pull origin <your current branch>
  git add -A .
  git commit -m "update: <your message passed via -m flag>"
  git push origin <your current branch>
  ```

- what you type:

  ```
    py main.py fix -m "just for example"
  ```

  what it gonna do:

  ```
  git pull origin <your current branch>
  git add -A .
  git commit -m "fix: <your message passed via -m flag>"
  git push origin <your current branch>
  ```

- what you type:

  ```
    py main.py sync
  ```

  what it gonna do:

  ```
  git pull origin <your current branch>
  ```

### P.S.

You can add compiled file to your path and use it like: `g -m "just for test"`
