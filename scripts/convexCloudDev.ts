import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

export function loadCloudDevEnv() {
  const envFilePath = path.join(process.cwd(), ".env.local");

  if (!existsSync(envFilePath)) {
    throw new Error(`Missing ${envFilePath}.`);
  }

  const parsed = dotenv.parse(readFileSync(envFilePath, "utf8"));
  const deployment =
    parsed.CONVEX_DEPLOYMENT?.trim() ||
    process.env.CONVEX_DEPLOYMENT?.trim();

  if (!deployment) {
    throw new Error(
      `Missing CONVEX_DEPLOYMENT in ${envFilePath}.`
    );
  }

  return {
    envFilePath,
    env: {
      ...process.env,
      ...parsed,
      CONVEX_DEPLOYMENT: deployment,
    },
  };
}

export function runConvexCloudDev(args: string[]) {
  if (args.length === 0) {
    throw new Error("Expected at least one Convex CLI argument.");
  }

  if (args.includes("--env-file")) {
    throw new Error(
      "Do not pass --env-file here. This wrapper loads .env.local into process env to avoid the Convex CLI auth bug in 1.32.0."
    );
  }

  const { env } = loadCloudDevEnv();
  const command = process.platform === "win32" ? "npx.cmd" : "npx";
  const result = spawnSync(command, ["convex", ...args], {
    cwd: process.cwd(),
    env,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.error) {
    throw result.error;
  }

  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}
