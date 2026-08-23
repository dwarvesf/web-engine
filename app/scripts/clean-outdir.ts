// Strips the raw content tree from the export.
//
// The whole content repository is copied into public/content, and `next build`
// copies public/ verbatim into out/, so without this step every source file
// ships: page sources, files that are not pages at all, and the build's
// content hash. The images and other assets under out/content are referenced
// by the pages and stay.
//
// It is scoped to out/content on purpose. gen:agent-files writes a markdown
// twin per page at out/<route>/index.md, which is the markdown the site does
// mean to serve, and a repo-wide `**/*.md` sweep would delete those the moment
// the two steps were reordered.
import { glob } from 'glob';
import { rimraf } from 'rimraf';
import path from 'path';
import { BUILD_OUT_DIR } from './paths';

const CONTENT_OUT_DIR = path.join(BUILD_OUT_DIR, 'content');

async function cleanOutDir() {
  const sources = await glob('**/*.{md,mdx}', {
    cwd: CONTENT_OUT_DIR,
    absolute: true,
    dot: true,
  });
  await Promise.all(sources.map(file => rimraf(file)));

  await rimraf(path.join(CONTENT_OUT_DIR, '.content-hash'));

  console.log(
    `Cleaned ${sources.length} .md and .mdx files from the exported content tree.`,
  );
}

cleanOutDir().catch(err => {
  console.error('Error cleaning out directory:', err);
  process.exit(1);
});
