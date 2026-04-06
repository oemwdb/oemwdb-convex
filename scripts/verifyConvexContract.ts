import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

const repoRoot = process.cwd();
const manifestPath = path.join(
  repoRoot,
  "artifacts",
  "convex",
  "cloud-dev",
  "function-spec.json"
);
const sourceRoot = path.join(repoRoot, "src");

const deprecatedReferences = new Map<string, string>([
  ["api.queries.colorsCollectionGet", "api.colors.collectionGet"],
  ["api.queries.browserColorsCollectionList", "api.colors.collectionGet"],
  ["api.queries.colorDetailGet", "api.colors.detailGet"],
  ["api.queries.browserColorDetailGet", "api.colors.detailGet"],
  ["api.queries.databaseTableRowsGet", "api.tableBrowser.rowsGet"],
  ["api.queries.browserTableRowsList", "api.tableBrowser.rowsGet"],
  ["api.queries.marketListingsGetByWheel", "api.market.marketSurfaceGetByWheel"],
]);

function collectSourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = path.join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      return collectSourceFiles(fullPath);
    }

    if (!/\.(ts|tsx)$/.test(entry) || /\.d\.ts$/.test(entry)) {
      return [];
    }

    return [fullPath];
  });
}

function flattenPropertyAccess(node: ts.PropertyAccessExpression) {
  const parts: string[] = [];
  let current: ts.Expression = node;

  while (ts.isPropertyAccessExpression(current)) {
    parts.unshift(current.name.text);
    current = current.expression;
  }

  if (ts.isIdentifier(current)) {
    parts.unshift(current.text);
  }

  return parts;
}

function collectApiReferences(filePath: string) {
  const sourceText = readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true
  );
  const references = new Set<string>();

  function visit(node: ts.Node) {
    if (ts.isPropertyAccessExpression(node)) {
      const parts = flattenPropertyAccess(node);
      if (parts[0] === "api" && parts.length >= 3) {
        references.add(parts.join("."));
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return references;
}

function identifierToApiReference(identifier: string) {
  const [modulePath, functionName] = identifier.split(":");
  if (!modulePath || !functionName) return null;
  const normalizedModule = modulePath.replace(/\.js$/, "").replace(/\//g, ".");
  return `api.${normalizedModule}.${functionName}`;
}

if (!existsSync(manifestPath)) {
  throw new Error(
    `Missing ${manifestPath}. Run \`npm run convex:cloud-dev:function-spec\` after authenticating the Convex CLI.`
  );
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
  functions: Array<{ identifier: string; visibility?: { kind?: string } }>;
};

const manifestReferences = new Set(
  manifest.functions
    .filter((entry) => entry.visibility?.kind === "public")
    .map((entry) => identifierToApiReference(entry.identifier))
    .filter((entry): entry is string => Boolean(entry))
);

const sourceFiles = collectSourceFiles(sourceRoot);
const sourceReferences = new Map<string, string[]>();

for (const filePath of sourceFiles) {
  const refs = [...collectApiReferences(filePath)];
  for (const ref of refs) {
    if (!sourceReferences.has(ref)) {
      sourceReferences.set(ref, []);
    }
    sourceReferences.get(ref)!.push(path.relative(repoRoot, filePath));
  }
}

const missingReferences = [...sourceReferences.entries()].filter(
  ([reference]) => !manifestReferences.has(reference)
);
const deprecatedUsages = [...sourceReferences.entries()].filter(([reference]) =>
  deprecatedReferences.has(reference)
);

if (deprecatedUsages.length > 0) {
  console.error("Deprecated Convex API references are still used in the frontend:");
  for (const [reference, files] of deprecatedUsages) {
    console.error(`- ${reference} -> ${deprecatedReferences.get(reference)}`);
    for (const filePath of files) {
      console.error(`  in ${filePath}`);
    }
  }
}

if (missingReferences.length > 0) {
  console.error("Frontend references missing from the canonical cloud dev manifest:");
  for (const [reference, files] of missingReferences) {
    console.error(`- ${reference}`);
    for (const filePath of files) {
      console.error(`  in ${filePath}`);
    }
  }
}

if (deprecatedUsages.length > 0 || missingReferences.length > 0) {
  process.exit(1);
}

console.log(`Verified ${sourceReferences.size} frontend Convex references against ${manifestPath}.`);
