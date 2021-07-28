from __future__ import annotations, print_function
from rich.console import Console
from os import path, getcwd
from sys import tracebacklimit
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
        console.log(f'trying to push to origin {self.curr_branch}...')
        self.__execute(f'git push origin {self.curr_branch}'.split(' '))

    def check_git(self):
        console.log(r"[cyan]Checking for .git dir...[/cyan]")
        git_path = self.cwd + '/.git'
        self.git_exists = path.isdir(git_path)
        if self.git_exists:
            self.curr_branch = self.__get_curr_branch()
            try:
                self.__pull()
            except:
                pass
        else:
            console.log(
                r'[yellow bold]Does not have .git...[/yellow bold]')
            self.init()

    def __execute(self, command: list, capture=False) -> str | None:
        if capture:
            cmd = run(command, shell=True, capture_output=capture,
                      text=capture, cwd=self.cwd)
        else:
            cmd = run(command, shell=True, cwd=self.cwd,
                      stdout=DEVNULL, stderr=DEVNULL)
        return cmd.stdout if capture else None

    def __get_curr_branch(self):
        console.log(r"trying to grab current branch...")
        branch = self.__execute(
            'git branch --show-current'.split(' '), capture=True)
        return branch

    def __pull(self):
        console.log(r"trying to pull from origin...")
        self.__execute([*('git pull origin'.split(' ')), self.curr_branch])

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
                        choices=["update", "fix", "init"],
                        type=str)
    parser.add_argument("-m", "--msg",
                        nargs="*",
                        help="Message with which the command will be executed (update: <your message>)",
                        type=str)
    args, _ = parser.parse_known_args()
    return args


def main():
    cwd = getcwd()
    args = read_args()
    git = Git(cwd)
    if args.command != 'init':
        git.check_git()
    msg = None if not args.msg else ' '.join(args.msg)
    with console.status("[bold green]Working on tasks...", spinner="dqpb") as status:
        if args.command == 'init':
            git.init()
        git.commit(msg, args.command)
        git.push()
    console.log('[bold green]Done![/bold green]')


if __name__ == '__main__':
    tracebacklimit = 0
    try:
        main()
    finally:
        pass
