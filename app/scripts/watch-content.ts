import chokidar from 'chokidar';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import fs from 'fs-extra'; // Using fs-extra for recursive copy
import net from 'net';
import { spawn } from 'child_process';
import {
  ORIGINAL_CONTENT,
  PUBLIC_CONTENT,
  ORIGINAL_SITE_CONFIG_CONTENT,
  PROCESS_SITE_CONFIG_SCRIPT,
} from './paths';

const contentPath = ORIGINAL_CONTENT;
const BASE_PORT = 55980;
const MAX_PORT = 55999;

async function findAvailablePort(startPort: number): Promise<number> {
  let port = startPort;
  while (true) {
    const isFree = await new Promise<boolean>(resolve => {
      const tester = net
        .createServer()
        .once('error', () => resolve(false))
        .once('listening', function () {
          tester.close();
          resolve(true);
        })
        .listen(port);
    });
    if (isFree) return port;
    if (port >= MAX_PORT) {
      throw new Error(
        `No available ports found between ${startPort} and ${MAX_PORT}`,
      );
    }
    port++;
  }
}

async function startWatcher() {
  const WS_PORT = await findAvailablePort(BASE_PORT);

  // Create WebSocket server
  const wss = new WebSocketServer({ port: WS_PORT });

  console.log(`🚀 WebSocket server running on ws://localhost:${WS_PORT}`);
  console.log(`📁 Watching content directory: ${contentPath}`);

  // Track connected clients
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws: WebSocket) => {
    console.log('📱 Browser connected for hot-reload');
    clients.add(ws);

    ws.on('close', () => {
      console.log('📱 Browser disconnected');
      clients.delete(ws);
    });
  });

  // Function to copy content file to public directory
  async function copyContent(filePath: string) {
    const relativePath = path.relative(contentPath, filePath);
    const destinationPath = path.join(PUBLIC_CONTENT, relativePath);

    try {
      // Ensure the destination directory exists
      await fs.promises.mkdir(path.dirname(destinationPath), {
        recursive: true,
      });

      // Copy the file
      await fs.promises.copyFile(filePath, destinationPath);
      console.log(`✅ Copied ${filePath} to ${destinationPath}`);
    } catch (error) {
      console.error(`❌ Error copying file ${filePath}:`, error);
    }
  }

  // Function to execute process-site-config script
  async function processSiteConfig() {
    return new Promise<void>((resolve, reject) => {
      console.log('🔄 Processing site configuration...');
      const scriptPath = PROCESS_SITE_CONFIG_SCRIPT;
      const child = spawn('tsx', [scriptPath], {
        cwd: process.cwd(),
        stdio: 'inherit',
      });

      child.on('close', code => {
        if (code === 0) {
          console.log('✅ Site configuration processed successfully');
          resolve();
        } else {
          console.error(
            `❌ Site configuration process failed with code ${code}`,
          );
          reject(new Error(`Process exited with code ${code}`));
        }
      });

      child.on('error', error => {
        console.error(
          '❌ Failed to execute process-site-config script:',
          error,
        );
        reject(error);
      });
    });
  }

  // Watch for content changes (add, change, unlink)
  chokidar
    .watch(contentPath, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true, // Don't trigger on startup
    })
    .on('add', async (filePath: string) => {
      console.log(`🆕 Content file added: ${filePath}`);
      await copyContent(filePath);
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'reload', file: filePath }));
          console.log('🔄 Sent reload signal to browser');
        }
      });
    })
    .on('change', async (filePath: string) => {
      console.log(`📝 Content file changed: ${filePath}`);
      await copyContent(filePath);

      // Check if the changed file is site.json
      if (
        path.resolve(filePath) === path.resolve(ORIGINAL_SITE_CONFIG_CONTENT)
      ) {
        try {
          await processSiteConfig();
          // No need to hard reload the browser here,
          // as the site configuration change will be handled by the script
          return;
        } catch (error) {
          console.error('❌ Failed to process site configuration:', error);
        }
      }

      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'reload', file: filePath }));
          console.log('🔄 Sent reload signal to browser');
        }
      });
    })
    .on('unlink', async (filePath: string) => {
      const relativePath = path.relative(contentPath, filePath);
      const destinationPath = path.join(PUBLIC_CONTENT, relativePath);
      try {
        await fs.promises.unlink(destinationPath);
        console.log(`🗑️ Deleted ${destinationPath}`);
      } catch (error) {
        // Only log if file existed
        if (
          typeof error === 'object' &&
          error !== null &&
          'code' in error &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any).code !== 'ENOENT'
        ) {
          console.error(`❌ Error deleting file ${destinationPath}:`, error);
        }
      }
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'reload', file: filePath }));
          console.log('🔄 Sent reload signal to browser');
        }
      });
    });

  console.log('✅ Hot-reload system ready!');
}

startWatcher();
