import { execSync } from 'child_process';
import { rimraf } from 'rimraf';
import fs from 'fs';

// This script runs a series of commands to build the project.
// The commands are executed in sequence for valid build and deployment.
const commands = [
  'pnpm run clone:repo',
  'pnpm run cp:content',
  'pnpm run process:config',
  'next build',
  'pnpm run clean:outdir-md',
  'pnpm run generate:theme-import',
];

function postCleanOutDir() {
  // Move the out directory to root
  const outDir = 'out';
  const outRootDir = '../../out';
  if (fs.existsSync(outRootDir)) {
    rimraf.sync(outRootDir);
  }
  if (fs.existsSync(outDir)) {
    fs.renameSync(outDir, outRootDir);
  }
  console.log('Cleaned out directory and moved to root.');
}

function runCommands() {
  for (const command of commands) {
    try {
      console.log(`Running command: ${command}`);
      execSync(command, { stdio: 'inherit' });
    } catch (error) {
      console.error(
        `Error running command "${command}":`,
        (error as Error).message,
      );
      process.exit(1);
    }
  }
  postCleanOutDir();
}

runCommands();
