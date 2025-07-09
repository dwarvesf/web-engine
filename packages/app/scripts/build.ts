import { execSync } from 'child_process';

// This script runs a series of commands to build the project.
// The commands are executed in sequence for valid build and deployment.
const commands = [
  'pnpm run clone:repo',
  'pnpm run cp:content',
  'pnpm run process:config',
  'next build',
  'pnpm run clean:outdir-md',
  'rm -rf ../../out',
  'cp -R out ../../out',
  'rm -rf out',
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
