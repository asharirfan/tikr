import { execFileSync } from "node:child_process";

const versionType = process.argv[2];
const allowedVersionTypes = new Set(["patch", "minor", "major"]);

if (!allowedVersionTypes.has(versionType)) {
  console.error("Usage: node scripts/release.mjs <patch|minor|major>");
  process.exit(1);
}

run("npm", ["version", versionType]);

const tag = execFileSync("git", ["describe", "--tags", "--abbrev=0"], {
  encoding: "utf8",
}).trim();

run("pnpm", ["run", "publish:npm"]);
run("git", ["push", "--follow-tags"]);
run("node", ["dist/index.js", "--tag", tag]);

function run(command, args) {
  execFileSync(command, args, {
    stdio: "inherit",
  });
}
