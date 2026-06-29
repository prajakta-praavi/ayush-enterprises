import { spawn } from "node:child_process";

const isWindows = process.platform === "win32";
const npmCommand = isWindows ? "npm.cmd" : "npm";
const nodeCommand = process.execPath;

const children = [
  spawn(nodeCommand, ["scripts/dev-backend.mjs"], {
    cwd: process.cwd(),
    stdio: "inherit",
    windowsHide: true,
  }),
  spawn(npmCommand, ["run", "dev"], {
    cwd: process.cwd(),
    stdio: "inherit",
    windowsHide: true,
    shell: isWindows,
  }),
];

let shuttingDown = false;

const shutdown = (exitCode = 0) => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }

  process.exit(exitCode);
};

for (const child of children) {
  child.on("exit", (code, signal) => {
    if (shuttingDown) {
      return;
    }

    if (code === 0 || signal === "SIGTERM") {
      shutdown(0);
      return;
    }

    shutdown(code ?? 1);
  });

  child.on("error", (error) => {
    console.error(error);
    shutdown(1);
  });
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

console.log("Starting backend on 127.0.0.1:3001 and frontend on 8080...");
