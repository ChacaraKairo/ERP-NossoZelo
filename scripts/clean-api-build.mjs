import { rmSync } from "node:fs";

rmSync("dist-api", { recursive: true, force: true });
