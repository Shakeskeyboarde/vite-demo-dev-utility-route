import { open, stat } from 'node:fs/promises';
import { type ServerResponse } from 'node:http';
import { dirname, join, posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import mime from 'mime';
import { type Connect, type Plugin } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, '../app');
const INDEX = '/index.html';

/**
 * The app route (aka: base path)
 */
export const ROUTE = '/__inspect';

/**
 * Inspect plugin for Vite.
 */
export default (): Plugin => {
  return {
    name: 'vite-plugin-inspect',
    apply: 'serve',
    configureServer: (server) => {
      server.middlewares.use(middleware());
    },
  };
};

const middleware = (): Connect.NextHandleFunction => {
  return (req, res, next) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);

    if (!url.pathname.startsWith(ROUTE)) {
      // Not our route, so pass through to the next middleware.
      return next();
    }

    // Try serving the requested file.
    serveFile(url.pathname.slice(ROUTE.length), res)
      .catch(async (err: any) => {
        if (err?.code === 'ENOENT' || err?.code === 'EISDIR') {
          // Requested file not found (or it's a directory), so serve the
          // index for SPA routing.
          await serveFile(INDEX, res);
        }
        else {
          console.error(err);
          res.statusCode = 500;
          res.end();
        }
      })
      .catch((err: any) => {
        // Something went wrong while trying to serve the index.
        console.error(err);
        res.statusCode = 500;
        res.end();
      });
  };
};

const serveFile = async (pathname: string, res: ServerResponse): Promise<void> => {
  // XXX: This `posix.resolve` will remove any extra `..` path parts, which
  // prevents the client from accessing files outside the PUBLIC directory.
  const safePathname = posix.resolve('/', pathname);
  const absPathname = join(PUBLIC, safePathname);
  const contentType = mime.getType(absPathname) || 'application/octet-stream';
  const [stats, handle] = await Promise.all([stat(absPathname), open(absPathname)]);
  const stream = handle.createReadStream();

  try {
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stats.size);

    await new Promise<void>((end, error) => {
      stream.on('end', end);
      stream.on('error', error);
      stream.pipe(res, { end: true });
    });
  }
  finally {
    stream.close();
    await handle.close();
  }
};
