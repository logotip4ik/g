use clap::{Parser, Subcommand};
use std::{fmt, env, process};

use rustygit::{Repository, error::GitError};
use spinners::{Spinner, Spinners};

#[derive(Parser)]
#[command(name = "g")]
#[command(about = "simplify your git flow")]
#[command(long_about = None)]
#[command(version = "1.0.1")]
#[command(propagate_version = true)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// show uncommitted changes and previous commits
    Log {},
    /// pull changes from origin
    Pull {
        /// which remote to use
        #[arg(short, long, default_value = "origin")]
        remote: Option<String>,
    },
    /// push changes from origin
    Push {
        /// which remote to use
        #[arg(short, long, default_value = "origin")]
        remote: Option<String>,
    },
    /// push and pull changes from origin
    Sync {
        /// which remote to use
        #[arg(short, long, default_value = "origin")]
        remote: Option<String>,
    },
    /// commit files with message
    Cmt {
        #[command(subcommand)]
        commit_type: CommitType,

        /// files to include in commit
        #[arg(default_value = ".", global = true)]
        files: Vec<String>,

        /// message body
        #[arg(short, long, global = true)]
        message: Option<String>,

        /// which remote to use
        #[arg(short, long, global = true, default_value = "origin")]
        remote: Option<String>,

        /// push to origin after commit
        #[arg(short, long, default_value_t = false, global = true)]
        push: bool,

        /// pull > commit > push
        #[arg(short, long, default_value_t = false, global = true)]
        sync: bool,
    },
}

#[derive(Debug, Subcommand)]
enum CommitType {
    /// Changes that affect the build system like gulp, npm, etc
    Build {},
    /// Changes made to the CI configuration like Travis, Circle, Actions
    Ci {},
    /// Other changes that don't modify src or test files
    Chore {},
    /// Documentation only changes
    Docs {},
    /// A new feature
    Feat {},
    /// Fixed a bug
    Fix {},
    /// Code changes that improve performance
    Perf {},
    /// A code change that's not mainly a bug or new feature
    Refactor {},
    /// Revert a previous commit
    Revert {},
    /// Changes to styling like white space, formatting, semi-colons)
    Style {},
    /// Add or fix tests
    Test {},
}

impl fmt::Display for CommitType {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

fn main() {
    let cli = Cli::parse();

    let current_path = env::current_dir();
    let repo = Repository::new(current_path.expect("current dir is broken"));
    
    let branches = repo.cmd_out(vec!["rev-parse", "--abbrev-ref", "HEAD"]).expect("no current branches");
    let current_branch = branches.first().expect("no current branch");

    match &cli.command {
        Commands::Log {} => {
            log(&repo);
        }
        Commands::Pull { remote } => {
            pull_from_origin(&repo, expect_remote(remote), current_branch);
        }
        Commands::Push { remote } => {
            push_to_origin(&repo, expect_remote(remote), current_branch);
        }
        Commands::Sync { remote } => {
            pull_from_origin(&repo, expect_remote(remote), current_branch);
            push_to_origin(&repo, expect_remote(remote), current_branch);
        }
        Commands::Cmt {
            commit_type,
            files,
            message,
            remote,
            push,
            sync,
        } => {
            if *sync {
                pull_from_origin(&repo, expect_remote(remote), current_branch);
            }

            let m = generate_commit_message(commit_type, message);

            commit_files_with_message(&repo, files, &m);

            if *push || *sync {
                push_to_origin(&repo, expect_remote(remote), current_branch);
            }
        },
    }
}

fn pull_from_origin(repo: &Repository, remote: &String, current_branch: &String) {
    let args = vec!["pull", remote, current_branch];
    
    let mut spinner = Spinner::new(Spinners::Dots, args.join(" "));
    
    match repo.cmd(args) {
        Ok(..) => { },
        Err(error) => early_exit(error)
    };

    // NOTE: need another space because spinner itself is two chars wide 
    spinner.stop_with_symbol("✔");
}

fn push_to_origin(repo: &Repository, remote: &String, current_branch: &String) {
    let args = vec!["push", remote, current_branch];

    let mut spinner = Spinner::new(Spinners::Dots, args.join(" "));

    match repo.cmd(args) {
        Ok(..) => { },
        Err(error) => early_exit(error)
    }

    spinner.stop_with_symbol("✔");
}

fn log(repo: &Repository) {
    match repo.cmd_out(vec!["log", "--pretty=\"%h - %an - %s\"", "-5"]) {
        Ok(commits) => {
            let commits_string = commits
                .iter()
                .map(|s| format!("  {}", s))
                .collect::<Vec<String>>()
                .join("\n")
                .replace("\"", "");
        
            println!("Last 5 commits:\n{}", commits_string);
        },
        Err(error) => early_exit(error)
    }
    
    match repo.list_modified() {
        Ok(files) => {
            println!();
            println!("Modified files:");

            for file in files {
                println!("  {}", file);
            }
        },
        Err(error) => early_exit(error)
    }
}

fn commit_files_with_message(repo: &Repository, files: &Vec<String>, message: &String) {
    let mut spinner = Spinner::new(Spinners::Dots, format!("committing {}", files.join(", ")));

    let command = "add".into();
    let mut args: Vec<&String> = vec![&command];

    args.extend(files);

    // args: ['add', 'file1', 'file2']

    match repo.cmd(args) {
        Ok(..) => {},
        Err(error) => early_exit(error)
    }
    
    match repo.cmd(vec!["commit", "-m", message]) {
        Ok(..) => {},
        Err(error) => early_exit(error)
    }

    spinner.stop_with_symbol("✔");
}

fn generate_commit_message(commit_type: &CommitType, message: &Option<String>) -> String {
    let commit_type_str = commit_type.to_string().to_lowercase();

    if let Some(msg) = message {
        format!("{}: {}", commit_type_str, msg.trim())
    } else {
        commit_type_str
    }
}

fn early_exit(e: GitError) {
    eprintln!("{}", e);
    process::exit(-1);
}

fn expect_remote(remote: &Option<String>) -> &String {
    match remote {
        Some(s) => s,
        None => panic!("remote is not defined"),
    }
}
