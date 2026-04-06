import {
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { runConvexCloudDev } from "./convexCloudDev";

const repoRoot = process.cwd();
const outputPath = path.join(
  repoRoot,
  "artifacts",
  "convex",
  "cloud-dev",
  "function-spec.json"
);

function listFunctionSpecFiles() {
  return readdirSync(repoRoot).filter((name) => /^function_spec_\d+\.json$/.test(name));
}

const beforeFiles = new Set(listFunctionSpecFiles());

try {
  runConvexCloudDev(["function-spec", "--file"]);
} catch {
  throw new Error(
    "Could not fetch the live cloud dev function manifest. Re-authenticate with `npm run convex:cloud-dev:sync` if needed, then rerun `npm run convex:cloud-dev:function-spec`."
  );
}

const afterFiles = listFunctionSpecFiles();
const candidateFiles = afterFiles
  .filter((name) => !beforeFiles.has(name))
  .sort((left, right) => {
    const leftTime = statSync(path.join(repoRoot, left)).mtimeMs;
    const rightTime = statSync(path.join(repoRoot, right)).mtimeMs;
    return rightTime - leftTime;
  });

const selectedFile =
  candidateFiles[0] ??
  afterFiles.sort((left, right) => {
    const leftTime = statSync(path.join(repoRoot, left)).mtimeMs;
    const rightTime = statSync(path.join(repoRoot, right)).mtimeMs;
    return rightTime - leftTime;
  })[0];

if (!selectedFile) {
  throw new Error("Convex function-spec did not produce a manifest file.");
}

const selectedPath = path.join(repoRoot, selectedFile);
const manifest = JSON.parse(readFileSync(selectedPath, "utf8")) as {
  url: string;
  functions: Array<Record<string, unknown> & { identifier?: string }>;
};

const normalizedManifest = {
  generatedAt: new Date().toISOString(),
  url: manifest.url,
  functions: [...manifest.functions].sort((left, right) =>
    String(left.identifier ?? "").localeCompare(String(right.identifier ?? ""))
  ),
};

mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(normalizedManifest, null, 2)}\n`);

if (candidateFiles.includes(selectedFile)) {
  unlinkSync(selectedPath);
}

console.log(`Wrote canonical cloud dev function manifest to ${path.relative(repoRoot, outputPath)}.`);
