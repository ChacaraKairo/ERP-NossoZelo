import { mkdirSync, writeFileSync } from "node:fs";

mkdirSync("dist-api", { recursive: true });
writeFileSync("dist-api/package.json", JSON.stringify({ type: "commonjs" }, null, 2));
