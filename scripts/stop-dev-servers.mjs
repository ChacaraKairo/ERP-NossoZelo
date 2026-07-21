import { execFileSync } from "node:child_process";

const ports = [3000, 3001];

function pidsForPort(port) {
  try {
    const output = execFileSync("lsof", ["-tiTCP:" + port, "-sTCP:LISTEN"], { encoding: "utf8" }).trim();
    return output ? output.split("\n").map((pid) => Number(pid)).filter(Boolean) : [];
  } catch {
    return [];
  }
}

for (const port of ports) {
  const pids = pidsForPort(port);
  for (const pid of pids) {
    try {
      process.kill(pid, "SIGTERM");
      console.log(`Porta ${port}: processo ${pid} encerrado.`);
    } catch {
      // Processo ja saiu.
    }
  }
}
