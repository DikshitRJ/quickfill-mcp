import { serve, type ServerType } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import getPort from "get-port";
import { Hono } from "hono";
import type { Server } from "node:http";
import { WebSocket, WebSocketServer } from "ws";
import { fsManager } from "./filesystem.js";

export class QuickfillServer {
    private app = new Hono();
    private server?: ServerType;
    private wss?: WebSocketServer;
    public port: number = 0;
    private clients: Set<WebSocket> = new Set();

    constructor() {
        this.app.use("/*", async (c, next) => {
            await next();
            c.header(
                "Cache-Control",
                "no-store, no-cache, must-revalidate, proxy-revalidate",
            );
            c.header("Pragma", "no-cache");
            c.header("Expires", "0");
        });

        this.app.use(
            "/*",
            serveStatic({
                root: fsManager.tempDir,
                rewriteRequestPath: (path) => path.replace(/^\//, ""),
            }),
        );
    }

    async start() {
        this.port = await getPort({ port: [3000, 3001, 3002, 3003, 3004, 3005] });

        return new Promise<void>((resolve) => {
            this.server = serve(
                {
                    fetch: this.app.fetch,
                    port: this.port,
                },
                (info) => {
                    process.stderr.write(
                        `[Server] Web server running at http://localhost:${info.port}\n`,
                    );

                    // Cast to unknown then Server to bypass Http2Server property mismatches with ws
                    this.wss = new WebSocketServer({
                        server: this.server as unknown as Server,
                    });

                    this.wss.on("connection", (ws) => {
                        this.clients.add(ws);
                        ws.on("close", () => this.clients.delete(ws));
                    });

                    resolve();
                },
            );
        });
    }

    broadcastReload() {
        process.stderr.write(
            `[Server] Broadcasting reload to ${this.clients.size} clients\n`,
        );
        for (const client of this.clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send("reload");
            }
        }
    }

    getUrl() {
        return `http://localhost:${this.port}`;
    }
}

export const quickfillServer = new QuickfillServer();
