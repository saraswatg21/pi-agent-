# Weather Forecast App Instructions

## Validation and reports

- After making code changes, run the relevant automated tests with `npm run test:report`. For production-build validation, use `npm run build:report`.
- Do not run the underlying `npm test` or `npm run build` commands directly; the report wrappers capture their complete output and exit status.
- Each run creates a timestamped, human-readable Markdown report under `test-reports/`. Test reports list the test cases and suites; all reports list changed worktree files and include the full output.
- In the final response, summarize the validations and results, identify which changes the test assertions exercise (and note changed behavior not directly covered), and link to each report generated during the task.
- If a run fails or cannot start, preserve that failure in the report and state it clearly; never present it as a pass.
