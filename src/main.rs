use clap::{Parser, Subcommand};
use std::fmt;

#[derive(Parser)]
#[command(name = "g")]
#[command(about = "simplify your git flow")]
#[command(long_about = None)]
#[command(version = "1.0.0")]
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
    Pull {},
    /// push changes from origin
    Push {},
    /// push and pull changes from origin
    Sync {},
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

    match &cli.command {
        Commands::Log {} => {
            log();
        }
        Commands::Pull {} => {
            pull_from_origin();
        }
        Commands::Push {} => {
            push_to_origin();
        }
        Commands::Sync {} => {
            pull_from_origin();
            push_to_origin();
        }
        Commands::Cmt {
            commit_type,
            files,
            message,
            push,
            sync,
        } => {
            if *sync {
                pull_from_origin();
            }

            let m = generate_commit_message(commit_type, message);
            let files_string = files.join(", ");

            commit_files_with_message(&files_string, &m);

            if *push || *sync {
                push_to_origin();
            }
        },
    }
}

fn pull_from_origin() {
    println!("pull command")
}

fn push_to_origin() {
    println!("push command")
}

fn log() {
    println!("log command")
}

fn commit_files_with_message(files: &String, message: &String) {
    println!("Will commit files: {} with message: {}", files, message);
}

fn generate_commit_message(commit_type: &CommitType, message: &Option<String>) -> String {
    let commit_type_str = commit_type.to_string().to_lowercase();

    if let Some(msg) = message {
        format!("{}: {}", commit_type_str, msg.trim())
    } else {
        commit_type_str
    }
}
