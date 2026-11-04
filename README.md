# Weather Forecast App

A React weather app that uses your browser location to show current conditions, temperature, humidity, wind, and a short forecast. If location access is unavailable, the app uses a default location. Weather information is loaded from the OpenWeather API.

## Run the application

Install dependencies and start the development server:

```bash
npm install
npm start
```

Open the local URL printed by the development server. To create a production build, run:

```bash
npm run build
```

## Agent validation and reports

Workspace Copilot instructions in `.github/copilot-instructions.md` tell the coding agent how to validate code changes and summarize the results in chat. For reports, use the report commands below instead of the direct test or build commands:

| Command | What it runs |
| --- | --- |
| `npm run test:report` | Runs the automated test suite once, in-band, with verbose test names, and generates a test report. |
| `npm run build:report` | Runs the production build and generates a build report. |

### How report generation works

Both commands call `scripts/run-with-report.js`, which starts the corresponding npm script as a child process. The runner captures its standard output, standard error, and exit status; then creates a timestamped Markdown report under `test-reports/`.

Test reports summarize the test-suite and test-case results. Build reports show whether compilation succeeded; a successful build checks that the app compiles but does not replace behavior tests. Both report types include the command, run time, changed files in the worktree, and the full command output. A failed command is recorded as a failure and retains its nonzero exit status.

Reports are local artifacts: `test-reports/` is excluded from Git. The agent instructions ask the coding agent to summarize validation results in its final chat response and identify which code changes the tests cover. The report commands run tests or a build when invoked; they do not automatically run after every arbitrary terminal command.

## Project links

- [Original installation article](https://www.htmlhints.com/article/how-to-create-weather-app-using-reactjs-with-current-location-search-city/93)
- [Live demo](https://master.d2gxbs6vwhkz68.amplifyapp.com/)
