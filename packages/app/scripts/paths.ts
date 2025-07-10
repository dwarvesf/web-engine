import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const baseDirName = path.dirname(fileURLToPath(import.meta.url));

// Original content directory and site configuration (remotely hosted content)
const ORIGINAL_CONTENT_DIR = process.env.ORIGINAL_CONTENT_DIR || 'content';
const ORIGINAL_CONTENT = path.join(
  baseDirName,
  '../../..',
  ORIGINAL_CONTENT_DIR,
);
const ORIGINAL_SITE_CONFIG_CONTENT = path.join(ORIGINAL_CONTENT, 'site.json');

// Public content directory (where content is copied to for serving)
const BASE_APP_DIR = path.join(baseDirName, '..');
const PUBLIC_CONTENT = path.join(baseDirName, '..', 'public', 'content');
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

export {
  PUBLIC_CONTENT,
  ORIGINAL_CONTENT,
  BUILD_OUT_DIR,
  BASE_APP_DIR,
  CONTENT_HASH_FILE,
  ORIGINAL_SITE_CONFIG_CONTENT,
  GENERATED_OUTDIR,
  COPIED_SITE_CONTENT_JSON,
  THEMES_DIR,
  THEMES_IMPORT_FILE,
};
