import { execSync } from 'child_process';

// This script runs a series of commands to build the project.
// The commands are executed in sequence for valid build and deployment.
const commands = [
  'pnpm run clone:repo',
  'pnpm run cp:content',
  'pnpm run process:config',
  'pnpm run generate:theme-import',
  'concurrently "next dev" "tsx scripts/watch-content.ts"',
];

function runCommands() {
  for (const command of commands) {
    try {
      console.log(`Running command: ${command}`);
      execSync(command, { stdio: 'inherit' });
    } catch (error) {
      console.error(
        `Error running command "${command}":`,
        (error as any).message,
      );
      process.exit(1);
    }
  }
}

runCommands();
