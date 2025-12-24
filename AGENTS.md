# Repository Guidelines

## Project Structure & Module Organization
Each PWA lives in its own folder under `src/`, for example `src/notes/`. Treat each folder as a standalone static app with:

- `index.html` as the entry point
- `manifest.json` describing the PWA metadata
- `service-worker.js` scoped to that app folder
- `assets/` for icons and static files

Keep app folders independent so they can be deployed and tested in isolation. If shared utilities emerge, create a top-level `shared/` directory and document how apps consume it.

Per-app checklist:
- `manifest.json` `start_url` and `scope` match the app folder.
- `service-worker.js` lives in the app folder (scope is directory-based).
- Include at least one icon (preferably 192x192 and 512x512).

Planning/spec documents should live under `specs/` (for example
`specs/notes/README.md`) so they are versioned but not shipped.

## Build, Test, and Development Commands
This repository is intended to be no-build. Apps are served as static files. For local development, use a simple static server from the repo root or an app folder:

- `python3 -m http.server 8000` to serve the current directory

Then browse to `http://localhost:8000/src/<app>/`. If you add any tooling, keep commands minimal and document them here.

## Coding Style & Naming Conventions
No formatter or linter is configured. Keep HTML, CSS, and JS consistent within each app, and prefer:

- Two-space indentation for HTML/CSS
- `kebab-case` for file and folder names
- Descriptive IDs and class names scoped to each app

If you add a formatter or linter, include the exact command and config path here.

## Testing Guidelines
There is no test framework configured. If you add tests, keep them per-app (for example `src/notes/tests/`) and document:

- The command to run tests
- Test file naming pattern
- Any minimum coverage or CI expectations

Avoid network dependencies unless explicitly required by the app.

## Commit & Pull Request Guidelines
The Git history currently contains only `Initial commit`, so no commit message convention is established. If you introduce one (e.g., Conventional Commits), update this section with examples. For pull requests:

- Include a brief summary, rationale, and scope
- Link related issues or tickets if applicable
- Add screenshots or logs when behavior changes

## Deployment (GitHub Pages)
Apps are deployed as static files from this repository. The URL pattern is:

- `https://tonylo.github.io/pwa-box/src/<app>/`

Ensure each app’s `manifest.json` uses a `start_url` and `scope` that match its folder path, and keep `service-worker.js` in the app root so it controls the full app scope.

GitHub Pages should publish directly from the repository root since there is no build step; apps live under `src/`.

## Configuration & Security Notes
No configuration files or secrets are present. If you add `.env` or config files, document required variables and ensure secrets are excluded from version control.
