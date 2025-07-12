// Use simple-git to clone the repository to the `content` directory
import simpleGit, { SimpleGitProgressEvent } from 'simple-git';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { ORIGINAL_CONTENT } from './paths';

dotenv.config({ quiet: true });

function printProgress(progress: string) {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(progress);
}

function clearPrintProgress() {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(''); // Clear the line
}

const progress = ({ method, stage, progress }: SimpleGitProgressEvent) => {
  printProgress(`git.${method} ${stage} stage ${progress}% complete`);
};

function cloneRepository() {
  const git = simpleGit({ progress });
  const repoUrl = process.env.REPO_CONTENT;
  const contentPath = ORIGINAL_CONTENT;
  const isContentExisted =
    fs.existsSync(contentPath) &&
    fs.readdirSync(contentPath, { withFileTypes: true }).length > 0;
  const options = {
    '--depth': '1', // Clone only the latest commit
    '--single-branch': null, // Clone only the default branch
  };
  // Check if the content directory already exists
  if (repoUrl) {
    // Check if the content directory exists and has content
    if (isContentExisted) {
      // Check if it's a git repository
      if (fs.existsSync(path.join(contentPath, '.git'))) {
        console.log(
          'Content directory already exists and is a git repository.',
        );
        // Pull the latest changes
        git.cwd(contentPath).pull((err, update) => {
          if (err) {
            console.error('Error pulling latest changes:', err);
          } else if (update && update.summary.changes) {
            clearPrintProgress();
            console.log('Pulled latest changes:', update.summary.changes);
          } else {
            console.log('No changes to pull.');
          }
        });
        return;
      }
    } else {
      // Clone the repository
      git.clone(repoUrl, contentPath, options, err => {
        if (err) {
          console.error('Failed to clone repository:', err);
          process.exit(1);
        } else {
          clearPrintProgress();
          console.log('Repository cloned successfully to', contentPath);
        }
      });
    }
  } else if (!isContentExisted) {
    console.error('REPO_CONTENT environment variable is not set.');
    process.exit(1);
  }
}

cloneRepository();
