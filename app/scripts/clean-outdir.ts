// Script for cleaning all md and mdx files in the out directory recursively by using glob patterns
import { glob } from 'glob';
import { rimraf } from 'rimraf';
import path from 'path';
import { BUILD_OUT_DIR } from './paths';

async function cleanOutDir() {
  // Clean all .mdx files
  const mdxFiles = await glob('**/*.mdx', {
    cwd: BUILD_OUT_DIR,
    absolute: true,
  });
  await Promise.all(mdxFiles.map(file => rimraf(file)));

  // Clean all .md files
  const mdFiles = await glob('**/*.md', { cwd: BUILD_OUT_DIR, absolute: true });
  await Promise.all(mdFiles.map(file => rimraf(file)));

  // Clean the .content-hash file
  const contentHashFile = path.join(BUILD_OUT_DIR, '.content-hash');
  await rimraf(contentHashFile);

  console.log('Cleaned out directory of all .md and .mdx files.');
}

cleanOutDir().catch(err => {
  console.error('Error cleaning out directory:', err);
  process.exit(1);
});
