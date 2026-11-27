// Tiny static server for Lantern Deals (development use only).
// Serves app/ at http://localhost:8080 — run `node serve.ts [--port N]`.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.argv[process.argv.indexOf("--port") + 1] || 8080);
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json" };

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = join(here, "app", path === "/" ? "index.html" : path);
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found");
  }
});

server.listen(port, () => console.log("Lantern Deals at http://localhost:" + port));
