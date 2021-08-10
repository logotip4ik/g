from __future__ import annotations, print_function
from pathlib import Path
from rich.console import Console
from rich.table import Table
from os import path, getcwd
from argparse import ArgumentParser
from subprocess import run, DEVNULL

__version__ = "1.2.1"
console = Console()


class Git:
    def __init__(self, cwd: str, include: list):
        self.cwd = cwd
        self.include = include
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

    def status(self, all_commits=None):
        console.log(r"grabbing info...")
        get_all_commits_command = ['git', 'log', '--pretty=%h - %s']
        if not all_commits:
            get_all_commits_command.append('-2')
        commits = self.__execute(get_all_commits_command, capture=True)
        files_modifed = self.__execute(
            "git status -s".split(' '), capture=True)
        table = Table(title="Commits")

        table.add_column("Hash", style="cyan")
        table.add_column("Name")
        for row in commits.split('\n')[0:-1]:
            table.add_row(*row.split(' - '))
        console.print(files_modifed[0:-1], highlight=True)
        console.print(table)

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

    def __get_curr_branch(self) -> None:
        console.log(r"grabing current branch...")
        branch = self.__execute(
            'git branch --show-current'.split(' '), capture=True)
        return branch

    def __add(self) -> None:
        console.log(r"adding everything...")
        if self.include[0] == '.':
            return self.__execute('git add -A .'.split(' '))
        self.__execute(["git",  "add", " ".join(map(str, self.include))])
        return


def read_args():
    parser = ArgumentParser()
    parser.add_argument("command",
                        help="Type of command to execute (default: \"update\")",
                        default="update",
                        nargs='?',
                        choices=["update", "fix", "init", "sync", "status"],
                        type=str)
    parser.add_argument("-m", "--msg",
                        nargs="*",
                        help="Message with which the command will be executed (update: <your message>)",
                        type=str)
    parser.add_argument("-p", "--push",
                        default=False,
                        action="store_true",
                        help="Push your code to remote")
    parser.add_argument("-a", "--all-commits",
                        default=False,
                        action="store_true",
                        help="Print all your commits insted of only 2")
    parser.add_argument('-i', '--include',
                        default=['.'],
                        nargs='+',
                        action="store",
                        type=Path,
                        help="What files will be included")
    parser.add_argument('-v', '--version', action='version',
                        version='%(prog)s ' + __version__)
    args, _ = parser.parse_known_args()
    return args


def main():
    cwd = getcwd()
    args = read_args()
    git = Git(cwd, args.include)
    if args.command != 'init':
        git.check_git()
    msg = None if not args.msg else ' '.join(args.msg)
    with console.status("[bold green]Working on tasks...", spinner="line"):
        if args.command == 'init':
            git.init()
        if args.command == "status":
            git.status(args.all_commits)
            return
        if args.command == 'sync':
            git.push()
            return console.log(
                f'[bold green]"{git.curr_branch}" is in sync with remote![/bold green]')
        git.commit(msg, args.command)
        if args.push:
            git.push()
    console.log('[bold green]Done![/bold green]')


if __name__ == '__main__':
    # sys.tracebacklimit = 0
    # try:
    main()
    # finally:
    #     pass
