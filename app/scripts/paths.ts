import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const baseDirName = path.dirname(fileURLToPath(import.meta.url));

function resolveOriginalContentDir() {
  const CONTENT_DIR = process.env.CONTENT_DIR || 'content';
  // Check if the env provided is absolute or relative
  if (path.isAbsolute(CONTENT_DIR)) {
    return CONTENT_DIR;
  }
  // If relative, resolve it based on the current file's directory
  const contentDir = path.join(baseDirName, '../..', CONTENT_DIR);
  return path.resolve(contentDir);
}

// Original content directory and site configuration (remotely hosted content)
const ORIGINAL_CONTENT = resolveOriginalContentDir();
const ORIGINAL_SITE_CONFIG_CONTENT = path.join(ORIGINAL_CONTENT, 'site.json');

// Public content directory (where content is copied to for serving)
const BASE_APP_DIR = path.join(baseDirName, '..');
const PUBLIC_DIR = path.join(BASE_APP_DIR, 'public');
const PUBLIC_CONTENT = path.join(PUBLIC_DIR, 'content');
const PUBLIC_FAVICON = path.join(PUBLIC_DIR, 'favicon.ico');
const BUILD_OUT_DIR = path.join(baseDirName, '..', 'out');
const CONTENT_HASH_FILE = path.join(PUBLIC_CONTENT, '.content-hash');
const GENERATED_OUTDIR = path.join(baseDirName, '..', 'src', 'generated');
const COPIED_SITE_CONTENT_JSON = path.join(
  GENERATED_OUTDIR,
  'site-config.json',
);

// Themes
const THEMES_DIR = path.resolve(baseDirName, '../../themes');
const THEMES_IMPORT_FILE = path.join(GENERATED_OUTDIR, 'theme.ts');

// Scripts
const PROCESS_SITE_CONFIG_SCRIPT = path.join(
  baseDirName,
  'process-site-config.ts',
);

export {
  PUBLIC_DIR,
  PUBLIC_CONTENT,
  PUBLIC_FAVICON,
  ORIGINAL_CONTENT,
  BUILD_OUT_DIR,
  BASE_APP_DIR,
  CONTENT_HASH_FILE,
  ORIGINAL_SITE_CONFIG_CONTENT,
  GENERATED_OUTDIR,
  COPIED_SITE_CONTENT_JSON,
  THEMES_DIR,
  THEMES_IMPORT_FILE,
  // Script to process site configuration
  PROCESS_SITE_CONFIG_SCRIPT,
};
