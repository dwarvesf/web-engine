/* eslint-disable @typescript-eslint/no-explicit-any */
import { visit } from 'unist-util-visit';
import type { Node } from 'unist';
import path from 'path';
import { BASE_APP_DIR } from '../../../../../scripts/paths';
import { SiteConfigLoader } from '@wse/global/config/site-config';

interface ElementNode extends Node {
  type: 'element';
  tagName: string;
  properties?: {
    src?: string;
    href?: string;
    [key: string]: string | boolean | number | undefined;
  };
  [key: string]: any;
}

interface ImageNode extends Node {
  type: 'image';
  url: string;
}

interface LinkNode extends Node {
  type: 'link';
  url: string;
}

export const ASSET_POSSIBLE_EXTENSIONS = [
  // Images
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.webp',
  // Videos
  '.mp4',
  '.webm',
  // Audio
  '.mp3',
  '.wav',
  // Documents
  '.pdf',
  '.docx',
  '.xlsx',
  // Other common asset types
  '.txt',
  '.json',
  '.md',
  '.mdx',
  '.zip',
  '.tar',
  '.gz',
  '.rar',
  '.7z',
  '.ico',
  '.bmp',
  '.tiff',
  '.avif',
  '.mpg',
  '.mpeg',
  '.mkv',
  '.mov',
  '.avi',
  '.flv',
  '.wmv',
  '.ogg',
  '.opus',
  '.aac',
  '.flac',
  '.m4a',
  '.csv',
];

/**
 * Walk ESTree AST to find and transform template literals and literal nodes
 * Template literals and literal nodes in MDX are stored in the ESTree format within mdxJsxAttributeValueExpression nodes
 */
function walkESTreeForTemplateLiterals(program: any, filePath: string) {
  function walk(node: any) {
    if (!node || typeof node !== 'object') return;

    // Handle template literals
    if (node.type === 'TemplateLiteral' && node.quasis) {
      node.quasis.forEach((quasi: any) => {
        if (quasi.value && quasi.value.raw) {
          const rawValue = quasi.value.raw;

          // For template literals, we want to transform any path that starts with ./ or ../
          // This is simpler and more direct than the complex isAssetPath logic
          if (rawValue.startsWith('./') || rawValue.startsWith('../')) {
            // Transform the path
            const transformedPath = getRelativeImagePath(
              rawValue,
              filePath,
              true,
            );
            quasi.value.raw = transformedPath;
            quasi.value.cooked = transformedPath;
          }
        }
      });
    }

    // Handle literal nodes (from debug data analysis)
    if (
      node.type === 'Literal' &&
      node.value &&
      typeof node.value === 'string'
    ) {
      const literalValue = node.value;
      const regexTestStyleSource = /url\(['"]?([^'"]+)['"]?\)/g;

      // Transform literal nodes that contain asset paths
      if (literalValue.startsWith('./') || literalValue.startsWith('../')) {
        const transformedPath = getRelativeImagePath(
          literalValue,
          filePath,
          true,
        );
        node.value = transformedPath;
        node.raw = `'${transformedPath}'`;
      }

      if (regexTestStyleSource.test(literalValue)) {
        // Transform CSS url() values
        node.value = (literalValue as string).replace(
          regexTestStyleSource,
          (_match, p1) => {
            const isHashValue = p1.startsWith('#') || p1.startsWith('/#');
            if (isHashValue) {
              return `url(${p1})`; // Keep hash values as is
            }
            const transformedPath = getRelativeImagePath(p1, filePath, true);
            return `url(${transformedPath})`;
          },
        );
        node.raw = `'${node.value}'`; // Update raw value to match the new value
      }
    }

    // Handle CallExpression (like .map() calls)
    if (node.type === 'CallExpression' && node.arguments) {
      node.arguments.forEach((arg: any) => walk(arg));
    }

    // Handle ArrowFunctionExpression
    if (node.type === 'ArrowFunctionExpression' && node.body) {
      walk(node.body);
    }

    // Handle JSXElement and JSXFragment
    if (node.type === 'JSXElement' && node.children) {
      node.children.forEach((child: any) => walk(child));
    }

    // Handle JSXExpressionContainer
    if (node.type === 'JSXExpressionContainer' && node.expression) {
      walk(node.expression);
    }

    // Handle JSXAttribute
    if (node.type === 'JSXAttribute' && node.value) {
      walk(node.value);
    }

    // Recursively walk child nodes
    for (const key in node) {
      if (node.hasOwnProperty(key)) {
        const value = node[key];
        if (Array.isArray(value)) {
          value.forEach(walk);
        } else if (value && typeof value === 'object') {
          walk(value);
        }
      }
    }
  }

  walk(program);
}

/**
 * Transform array expressions containing asset paths in JSX attributes
 * Example: ['./images/logo1.png', './images/logo2.png'] becomes ['transformed/path1.png', 'transformed/path2.png']
 */
function transformAssetArrayExpression(
  data: Record<string, any>,
  filePath: string,
) {
  try {
    walkESTreeForTemplateLiterals(data?.estree, filePath);
  } catch (error) {
    console.error('Error transforming asset array expression:', error);
  }
}

function mdxJsxElementResolvePaths(node: ElementNode, filePath: string) {
  if ((node.name === 'img' || node.name === 'Image') && node.attributes) {
    const srcAttr = node.attributes.filter(
      (attr: Record<string, unknown>) =>
        attr.name === 'src' || attr.name === 'srcSet',
    );
    for (const attr of srcAttr) {
      if (typeof attr.value === 'string') {
        const oldSrc = attr.value as string;
        // Check if is the src set ...1x, ...2x, etc.
        if (oldSrc.includes(', ')) {
          // Split and transform each part
          const parts = oldSrc.split(', ');
          const transformedParts = parts.map(part => {
            // Split src url and descriptor
            const [src, descriptor] = part.split(' ');
            // Transform the src part
            const transformedSrc = getRelativeImagePath(src, filePath);
            // Return the transformed src with descriptor if exists
            return descriptor
              ? `${transformedSrc} ${descriptor}`
              : transformedSrc;
          });
          attr.value = transformedParts.join(', ');
        } else {
          const newSrc = getRelativeImagePath(oldSrc, filePath);
          attr.value = newSrc;
        }
      }
    }
  } else if (node.attributes) {
    node.attributes.forEach((attr: Record<string, unknown>) => {
      if (
        attr.value &&
        typeof attr.value === 'object' &&
        attr.value !== null &&
        'type' in attr.value &&
        attr.value.type === 'mdxJsxAttributeValueExpression'
      ) {
        // Handle JSX expression attributes like logos={[...]}
        const attrValue = attr.value as {
          type: string;
          value: unknown;
          data: Record<string, any>;
        };
        if (attrValue.data.estree.body) {
          // Transform array expressions containing asset paths
          transformAssetArrayExpression(attrValue.data, filePath);
        }
      } else if (typeof attr.value === 'string' && isAssetPath(attr.value)) {
        // Transform string attributes that look like asset paths
        attr.value = getRelativeImagePath(attr.value as string, filePath);
      }
    });
  }
}

/**
 * Remark plugin to transform relative paths in MDX files
 * Converts paths like "/images/hero.png" to work with content directory structure
 */
export const remarkTransformPaths = (filePath: string) => {
  return (tree: Node) => {
    // Transform image elements (JSX)
    visit(tree, 'element', (node: ElementNode) => {
      if (node.tagName === 'img' && node.properties?.src) {
        const oldSrc = node.properties.src;
        const newSrc = getRelativeImagePath(oldSrc, filePath);
        node.properties.src = newSrc;
      }
    });

    // Transform MDX JSX image elements (MDX v2)
    visit(tree, 'mdxJsxFlowElement', (node: ElementNode) => {
      mdxJsxElementResolvePaths(node, filePath);
    });

    visit(tree, 'mdxJsxTextElement', (node: ElementNode) => {
      mdxJsxElementResolvePaths(node, filePath);
    });

    // Transform markdown image syntax
    visit(tree, 'image', (node: ImageNode) => {
      if (node.url) {
        node.url = getRelativeImagePath(node.url, filePath);
      }
    });

    // Transform link elements (JSX)
    visit(tree, 'element', (node: ElementNode) => {
      if (node.tagName === 'a' && node.properties?.href) {
        // Only transform if it looks like a local file (not external URL)
        if (
          !node.properties.href.startsWith('http') &&
          !node.properties.href.startsWith('mailto:')
        ) {
          node.properties.href = getRelativeImagePath(
            node.properties.href,
            filePath,
          );
        }
      }
    });

    // Transform markdown link syntax
    visit(tree, 'link', (node: LinkNode) => {
      if (
        node.url &&
        !node.url.startsWith('http') &&
        !node.url.startsWith('mailto:')
      ) {
        node.url = getRelativeImagePath(node.url, filePath);
      }
    });

    // Transform template literals in MDX JSX attribute value expressions
    visit(tree, 'mdxFlowExpression', (node: any) => {
      if (node.data?.estree?.body) {
        walkESTreeForTemplateLiterals(node.data.estree, filePath);
      }
    });
  };
};

/**
 * Check if a path looks like an asset path based on extension or relative path indicators
 */
function isAssetPath(path: string): boolean {
  // Skip external URLs
  if (
    path.startsWith('http') ||
    path.startsWith('data:') ||
    path.startsWith('mailto:')
  ) {
    return false;
  }

  // Check if path has an asset extension
  const extension = path.toLowerCase().match(/\.[^.]+$/);
  if (extension) {
    return ASSET_POSSIBLE_EXTENSIONS.includes(extension[0]);
  }

  // Also consider relative paths that start with ./ or ../
  // This includes directory paths like "./images/home/"
  return path.startsWith('./') || path.startsWith('../');
}

export function getRelativeImagePath(
  originalPath: string,
  fileDir: string,
  isIgnoreCheckAssetPath = false,
): string {
  // Skip if already transformed or external
  if (
    originalPath.startsWith('http') ||
    originalPath.startsWith('data:') ||
    originalPath.startsWith('mailto:')
  ) {
    return originalPath;
  }

  // Check if the path is absolute
  if (path.isAbsolute(originalPath)) {
    // Check if is an asset path
    if (isAssetPath(originalPath)) {
      return `${SiteConfigLoader.BASE_PATH_URL}/content${originalPath}`; // Return as is if absolute
    }

    // If it's not an asset path, return as is
    return `${SiteConfigLoader.BASE_PATH_URL}${originalPath}`;
  }

  // Check is static asset path
  if (!isAssetPath(originalPath) && !isIgnoreCheckAssetPath) {
    // If it's a relative path, resolve it against the file directory
    return `${SiteConfigLoader.BASE_PATH_URL}/${originalPath}`;
  }

  // Get the directory of the markdown file
  const mdFileDir = path.dirname(fileDir);

  const filePath = path.join(mdFileDir, originalPath);

  // Construct the path to the image relative to the content directory
  const absoluteImagePath = path.resolve(mdFileDir, filePath);

  let relativePath = path.relative(BASE_APP_DIR, absoluteImagePath);

  const isEndsWithSlash = originalPath.endsWith(path.sep);
  const isRelativeEndsWithSlash = relativePath.endsWith(path.sep);
  // If the original path ends with a slash, ensure the transformed path does too
  if (isEndsWithSlash && !isRelativeEndsWithSlash) {
    relativePath += path.sep;
  } else if (!isEndsWithSlash && isRelativeEndsWithSlash) {
    relativePath = relativePath.slice(0, -1);
  }

  // Make the path relative to the public directory for serving
  let publicPath = '/' + relativePath;

  // Remove the 'public' prefix if it exists
  if (publicPath.startsWith('/public/')) {
    publicPath = publicPath.substring(8);
  }

  return `${SiteConfigLoader.BASE_PATH_URL}/${publicPath}`;
}
