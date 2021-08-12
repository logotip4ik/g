#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <limits.h>
#include <time.h>
#include <ctype.h>

#define VERSION "1.0.0"
#define STR_BUFFER_SIZE 1024

#define ANSI_COLOR_RED "\x1b[31m"
#define ANSI_COLOR_GREEN "\x1b[32m"
#define ANSI_COLOR_YELLOW "\x1b[33m"
#define ANSI_COLOR_BLUE "\x1b[34m"
#define ANSI_COLOR_MAGENTA "\x1b[35m"
#define ANSI_COLOR_CYAN "\x1b[36m"
#define ANSI_COLOR_BOLD "\x1b[1m"
#define ANSI_COLOR_RESET "\x1b[0m"

void error(char message[])
{
  fprintf(stderr, "g: %s\n", message);
  exit(EXIT_FAILURE);
}
void print_help()
{
  fprintf(stdout, "usage: %s [{update,fix,init,sync,status}] [-h] [-m [MSG ...]] [-p] [-a] [-i INCLUDE [INCLUDE ...]] [-v]\n\
  \n\
  positional arguments:\n\
    {update,fix,init,sync,status}\n\
                          Type of command to execute (default: \"update\")\n\
  \n\
  optional arguments:\n\
  -h, --help            show this help message and exit\n\
  -m [MSG ...], --msg [MSG ...]\n\
                        Message with which the command will be executed (update: <your message>)\n\
  -p, --push            Push your code to remote\n\
  -a, --all-commits     Print all your commits insted of only 2\n\
  -i INCLUDE [INCLUDE ...], --include INCLUDE [INCLUDE ...]\n\
                        What files will be included\n\
  -v, --version         show program's version number and exit",
          __FILE__);
  exit(EXIT_SUCCESS);
}
#define LEN 150
void print_log(char *message, short error)
{
  char buf[LEN];
  time_t curtime;
  struct tm *loc_time;

  //Getting current time of system
  curtime = time(NULL);
  // Converting current time to local time
  loc_time = localtime(&curtime);

  if (error)
    strftime(buf, LEN, ANSI_COLOR_RED "[%X] " ANSI_COLOR_RESET, loc_time);
  else
    strftime(buf, LEN, ANSI_COLOR_CYAN "[%X] " ANSI_COLOR_RESET, loc_time);
  strcat(buf, message);
  strcat(buf, "\n");
  fputs(buf, stdout);
  if (error)
  {
    print_log("exiting...", 0);
    exit(EXIT_FAILURE);
  }
}

void get_message(short argc, char *argv[], short from, char **message)
{
  for (short i = from; i < argc; i++)
  {
    if (argv[i][0] == '-')
      break;

    strcat(*message, argv[i]);
    strcat(*message, " ");
  }
}

void get_sub_string(char *source, char *target, short from, short to)
{
  short length = 0;
  short i = 0, j = 0;

  while (source[i++] != '\0')
    length++;

  if (from < 0 || from > length)
    error("Invalid 'from' index");
  if (to > length)
    error("Invalid 'to' index\n");

  for (i = from, j = 0; i <= to; i++, j++)
    target[j] = source[i];

  target[j] = '\0';
}

short array_includes(char *array[], short size, char *string)
{
  for (short i = 0; i < size; ++i)
  {
    if (strcmp(array[i], string) == 0)
      return 0;
  }
  return 1;
}

void parse_args(short argc, char *argv[], char **command, char **include, char **message, short *push, short *all_commits)
{
  char *commands[] = {"update", "fix", "init", "sync", "log"};
  const short SIZE = sizeof(commands) / sizeof(commands[0]);

  for (short i = 1; i < argc; ++i)
  {
    // ! First argument always must be a command type (see commands)
    if (i == 1 && argv[i][0] != '-')
    {
      if (array_includes(commands, SIZE, argv[i]) == 0)
        *command = argv[i];
      else
        // TODO: show what command type is unknown
        error("unknown command type");
    }
    else if (argv[i][0] == '-')
    {
      char *flag = strrchr(argv[i], '-');
      get_sub_string(flag, flag, 1, strlen(flag));

      char *push_flags[] = {"p", "push"};
      char *all_commits_flags[] = {"a", "all-commits"};
      char *message_flags[] = {"m", "messsage"};
      char *include_flags[] = {"i", "include"};
      char *help_flags[] = {"h", "help"};
      char *version_flags[] = {"v", "version"};
      if (strcmp(flag, push_flags[0]) == 0 || strcmp(flag, push_flags[1]) == 0)
        *push = 1;
      else if (strcmp(flag, all_commits_flags[0]) == 0 || strcmp(flag, all_commits_flags[1]) == 0)
        *all_commits = 1;
      else if (strcmp(flag, message_flags[0]) == 0 || strcmp(flag, message_flags[1]) == 0)
        get_message(argc, argv, i + 1, message);
      else if (strcmp(flag, include_flags[0]) == 0 || strcmp(flag, include_flags[1]) == 0)
        get_message(argc, argv, i + 1, include);
      else if (strcmp(flag, version_flags[0]) == 0 || strcmp(flag, version_flags[1]) == 0)
      {
        printf("%s: %s", __FILE__, VERSION);
        exit(EXIT_SUCCESS);
      }
      else if (strcmp(flag, help_flags[0]) == 0 || strcmp(flag, help_flags[1]) == 0)
        print_help();
    }
  }
}

#define COMMAND_SIZE 1024
#define MAX_BRANCH_NAME 128
void git_get_current_branch(char *target)
{
  print_log("getting current branch...", 0);
  FILE *pipe = popen("git branch --show-current", "r");
  if (!pipe)
    error("unable to grab current branch(cannot spawn new process)");

  while (!feof(pipe))
    fgets(target, MAX_BRANCH_NAME, pipe);

  pclose(pipe);
}
void git_log(char *cwd, short *all_commits)
{
  print_log("grabbing latest info...", 0);
  char *command = calloc(COMMAND_SIZE, sizeof(char *));
  strcat(command, "cd ");
  strcat(command, cwd);
  strcat(command, " && git status -s");
  print_log("Not staged files:", 0);
  system(command);

  memset(command, 0, sizeof(char));

  strcat(command, "cd ");
  strcat(command, cwd);
  strcat(command, " && git log --pretty=\"%h - \%s\"");
  if (*all_commits != 1)
    strcat(command, " -3");

  print_log("Latest commits:", 0);
  system(command);
  // strcat(command, "cd ");
  // strcat(command, cwd);
  // strcat(command, " && git status -s");

  // system(command);
  free(command);
}
void git_pull(char *cwd, char *current_branch)
{
  char *message = calloc(MAX_BRANCH_NAME, sizeof(char));
  sprintf(message, "pulling from origin "ANSI_COLOR_BOLD ANSI_COLOR_YELLOW"%s"ANSI_COLOR_RESET"...", current_branch);
  print_log(message, 0);
  char *command = calloc(COMMAND_SIZE, sizeof(char *));
  strcat(command, "cd ");
  strcat(command, cwd);
  strcat(command, " && git pull origin ");
  strcat(command, current_branch);
  #if defined WIN32
  strcat(command, " > NUL 2>&1");
  #else
  strcat(command, " > /dev/null 2>&1")
  #endif

  system(command);
  free(command);
}
void git_push(char *cwd, char *current_branch)
{
  char *message = calloc(MAX_BRANCH_NAME, sizeof(char));
  sprintf(message, "pushing to origin "ANSI_COLOR_BOLD ANSI_COLOR_YELLOW"%s"ANSI_COLOR_RESET"...", current_branch);
  print_log(message, 0);
  char *command = calloc(COMMAND_SIZE, sizeof(char *));
  strcat(command, "cd ");
  strcat(command, cwd);
  strcat(command, " && git push origin ");
  strcat(command, current_branch);
  #if defined WIN32
  strcat(command, " > NUL 2>&1");
  #else
  strcat(command, " > /dev/null 2>&1")
  #endif
  // strcat(command, " > /dev/null 2>&1");

  system(command);
  free(command);
}
void git_commit(char *cwd, char *type, char *message)
{
  print_log("commiting...", 0);
  char *command = calloc(COMMAND_SIZE, sizeof(char *));
  strcat(command, "cd ");
  strcat(command, cwd);
  strcat(command, " && git commit -m \"");
  strcat(command, type);
  if (strcmp(&message[0], "\0") != 0)
  {
    strcat(command, ": ");
    strcat(command, message);
  }
  strcat(command, "\"");
  #if defined WIN32
  strcat(command, " > NUL 2>&1");
  #else
  strcat(command, " > /dev/null 2>&1")
  #endif
  // strcat(command, " > /dev/null 2>&1");

  system(command);
  free(command);
}
void git_add(char *cwd, char *include)
{
  print_log("adding files...", 0);
  char *command = calloc(COMMAND_SIZE, sizeof(char *));
  strcat(command, "cd ");
  strcat(command, cwd);
  strcat(command, " && git add ");
  size_t include_len = strlen(include);
  if (include_len == 0)
    strcat(command, ". -A");
  else
    strcat(command, include);

  system(command);
  free(command);
}
void git_check_dir(char *cwd)
{
  print_log("checking .git dir...", 0);
  char *command = calloc(COMMAND_SIZE, sizeof(char *));
  strcat(command, cwd);
#if defined WIN32
  strcat(command, "\\");
#else
  strcat(command, "/");
#endif
  strcat(command, ".git");
  if (access(command, F_OK) == -1)
  {
    free(command);
    print_log(ANSI_COLOR_RED ANSI_COLOR_BOLD ".git dir was not found" ANSI_COLOR_RESET, 1);
  }
  free(command);
}
void git_init(char *cwd)
{
  print_log("initializing git...", 0);
  char *command = calloc(COMMAND_SIZE, sizeof(char *));
  strcat(command, "cd ");
  strcat(command, cwd);
  strcat(command, " && git init");
  #if defined WIN32
  strcat(command, " > NUL 2>&1");
  #else
  strcat(command, " > /dev/null 2>&1")
  #endif
  system(command);
  free(command);
}

int main(int argc, char *argv[])
{
  // ! setting up all the vars
  char cwd[PATH_MAX];
  getcwd(cwd, sizeof cwd);
  char *current_branch = calloc(MAX_BRANCH_NAME, sizeof(char));

  char *command = "update";
  char *include = calloc(STR_BUFFER_SIZE, sizeof(char *));
  char *message = calloc(STR_BUFFER_SIZE, sizeof(char *));
  short push, all_commits = 0;

  // ! parsign args
  parse_args(argc, argv, &command, &include, &message, &push, &all_commits);

  // Hides cursor, but not in cmd.exe
  fputs("\e[?25l", stdout);

  // ! main logic
  if (strcmp(command, "init") == 0)
    git_init(cwd);
  else
    git_check_dir(cwd);

  if (strcmp(command, "sync") != 0 && strcmp(command, "log") != 0)
  {
    git_add(cwd, include);
    git_commit(cwd, command, message);
  }

  git_get_current_branch(current_branch);
  get_sub_string(current_branch, current_branch, 0, strlen(current_branch) - 2);
  git_pull(cwd, current_branch);

  if (strcmp(command, "log") == 0)
    git_log(cwd, &all_commits);

  if (push || strcmp(command, "sync") == 0)
    git_push(cwd, current_branch);

  print_log(ANSI_COLOR_BOLD ANSI_COLOR_GREEN "Done!" ANSI_COLOR_RESET, 0);

  // ! clean up
  free(include);
  free(message);

  // Put the cursor back
  fputs("\e[?25h", stdout);

  return EXIT_SUCCESS;
}