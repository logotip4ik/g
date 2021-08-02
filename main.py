from __future__ import annotations, print_function
from rich.console import Console
from os import path, getcwd
import sys
from argparse import ArgumentParser
from subprocess import run, DEVNULL


console = Console()


class Git:
    def __init__(self, cwd: str):
        self.cwd = cwd
        self.git_exists = False
        self.curr_branch = None

    def init(self):
        console.log(r"[cyan]initializing repo...[/cyan]")
        self.__execute(['git', 'init'])
        self.curr_branch = self.__get_curr_branch()

    def commit(self, msg: str, command_type: str):
        self.__add()
        message = command_type if not msg else f'{command_type}: {msg}'
        console.log(r"commiting...")
        self.__execute([*('git commit -m'.split(' ')), message])
        return

    def push(self):
        console.log(f'pushing to origin {self.curr_branch}...')
        self.__execute(f'git push origin {self.curr_branch}'.split(' '))

    def pull(self):
        console.log(r"pulling from origin...")
        self.__execute([*('git pull origin'.split(' ')), self.curr_branch])

    def check_git(self):
        console.log(r"[cyan]Checking for .git dir...[/cyan]")
        git_path = self.cwd + '/.git'
        self.git_exists = path.isdir(git_path)
        if self.git_exists:
            self.curr_branch = self.__get_curr_branch()[0:-1]
            try:
                self.pull()
            except:
                pass
        else:
            console.log(
                r'[yellow bold]Does not have .git...[/yellow bold]')
            create_git_dir = str(
                input('Do you want to auto create .git?(y/n)'))
            if create_git_dir.lower().strip() in ('n', 'no', 'nope'):
                self.init()
            else:
                exit(1)

    def __execute(self, command: list, capture=False) -> str | None:
        if capture:
            cmd = run(command, shell=True, capture_output=capture,
                      text=capture, cwd=self.cwd)
        else:
            cmd = run(command, shell=True, cwd=self.cwd,
                      stdout=DEVNULL, stderr=DEVNULL)
        return cmd.stdout if capture else None

    def __get_curr_branch(self):
        console.log(r"grabing current branch...")
        branch = self.__execute(
            'git branch --show-current'.split(' '), capture=True)
        return branch

    def __add(self):
        console.log(r"adding everything...")
        self.__execute('git add -A .'.split(' '))
        return


def read_args():
    parser = ArgumentParser()
    parser.add_argument("command",
                        help="Type of command to execute (default: \"update\")",
                        default="update",
                        nargs='?',
                        choices=["update", "fix", "init", "sync"],
                        type=str)
    parser.add_argument("-m", "--msg",
                        nargs="*",
                        help="Message with which the command will be executed (update: <your message>)",
                        type=str)
    parser.add_argument("--no-push",
                        default=False,
                        action="store_true",
                        help="Don't push your code to remote")
    args, _ = parser.parse_known_args()
    return args


def main():
    cwd = getcwd()
    args = read_args()
    git = Git(cwd)
    if args.command != 'init':
        git.check_git()
    msg = None if not args.msg else ' '.join(args.msg)
    with console.status("[bold green]Working on tasks...", spinner="line"):
        if args.command == 'init':
            git.init()
        if args.command == 'sync':
            console.log(
                f'[bold green]"{git.curr_branch}" is in sync with remote![/bold green]')
            return
        git.commit(msg, args.command)
        if not args.no_push:
            git.push()
    console.log('[bold green]Done![/bold green]')


if __name__ == '__main__':
    # sys.tracebacklimit = 0
    # try:
    main()
    # finally:
    #     pass
