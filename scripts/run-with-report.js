const fs = require("fs");
const path = require("path");
const { execFileSync, spawnSync } = require("child_process");

const [script] = process.argv.slice(2);
const reportTypes = {
  build: "Build",
  test: "Test",
};

if (!reportTypes[script]) {
  console.error("Usage: node scripts/run-with-report.js <test|build>");
  process.exit(2);
}

const root = path.resolve(__dirname, "..");
const commandArgs =
  script === "test"
    ? ["run", "test", "--", "--watchAll=false", "--runInBand", "--verbose"]
    : ["run", "build"];
const command = `npm ${commandArgs.join(" ")}`;
const startedAt = new Date();
const result = spawnSync("npm", commandArgs, {
  cwd: root,
  encoding: "utf8",
  maxBuffer: 10 * 1024 * 1024,
  shell: process.platform === "win32",
});
const exitCode = result.status === null ? 1 : result.status;
const output = [result.stdout, result.stderr].filter(Boolean).join("\n");
const testCases = [...output.matchAll(/^\s*[✓√]\s+(.+)$/gm)].map(
  (match) => match[1].trim()
);
const testSuites = [
  ...output.matchAll(/^(PASS|FAIL)\s+(.+)$/gm),
].map((match) => `- ${match[1] === "PASS" ? "✅ Passed" : "❌ Failed"}: \`${match[2].trim()}\``);
const testSummary = output.match(/^Test Suites:.*$/m);
const caseSummary = output.match(/^Tests:.*$/m);
let changedFiles = [];
try {
  const tracked = execFileSync("git", ["diff", "HEAD", "--name-only"], {
    cwd: root,
    encoding: "utf8",
  });
  const untracked = execFileSync(
    "git",
    ["ls-files", "--others", "--exclude-standard"],
    { cwd: root, encoding: "utf8" }
  );
  changedFiles = [...new Set(`${tracked}\n${untracked}`.split(/\r?\n/))]
    .map((file) => file.trim())
    .filter(Boolean)
    .sort();
} catch (error) {
  changedFiles = [`Could not determine changed files: ${error.message}`];
}
const reportDirectory = path.join(root, "test-reports");
const timestamp = startedAt.toISOString().replace(/[:.]/g, "-");
const reportPath = path.join(
  reportDirectory,
  `${script}-run-${timestamp}.md`
);
const report = [
  `# ${reportTypes[script]} Run Report`,
  "",
  `**Result:** ${exitCode === 0 ? "✅ Passed" : "❌ Failed"} (exit code ${exitCode})`,
  `**Run at:** ${startedAt.toLocaleString("en-GB")}`,
  `**Command:** \`${command}\``,
  "",
  "## Summary",
  "",
  script === "test"
    ? `- ${testSummary ? testSummary[0] : "Test suite summary was not found in the output."}\n- ${caseSummary ? caseSummary[0] : "Individual test summary was not found in the output."}`
    : exitCode === 0
      ? "- Production build completed successfully."
      : "- Production build did not complete successfully.",
  "",
  "## What was checked",
  "",
  script === "test" && testCases.length
    ? testCases.map((testCase) => `- ${testCase}`).join("\n")
    : script === "test"
      ? "- No individual test case names were found. See the run output below for details."
      : "- The production build checked that the application compiles for deployment; it does not replace automated behavior tests.",
  "",
  "## Changed files in the worktree",
  "",
  changedFiles.length
    ? changedFiles.map((file) => `- \`${file}\``).join("\n")
    : "- No uncommitted file changes detected relative to HEAD.",
  "",
  script === "test" ? "## Test suites" : "## Build output",
  "",
  script === "test"
    ? testSuites.length
      ? testSuites.join("\n")
      : "- No test suite results were found."
    : "Build output is included below.",
  "",
  "## Full command output",
  "",
  "```text",
  output.trim() || "(No output)",
  "```",
  result.error ? `\n**Runner error:** ${result.error.message}` : "",
].join("\n");

fs.mkdirSync(reportDirectory, { recursive: true });
fs.writeFileSync(reportPath, report, "utf8");

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.error) {
  process.stderr.write(`${result.error.message}\n`);
}

process.stdout.write(
  `\n${reportTypes[script]} report saved to ${path.relative(root, reportPath)}\n`
);
process.exitCode = exitCode;
