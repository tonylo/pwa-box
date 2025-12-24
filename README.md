This is an experimental project to create and play with Progressive Web
Apps (PWAs).

These will be simple applications, the idea of using PWA is so I can
easily prototype these apps on a Mac and have the apps accessible via
a browser. However, further to that I want the apps to be usable on
both Android and iOS without worrying about all the issues surrounding
native or larger applications.

## Goals
- Build small, focused PWA prototypes quickly.
- Validate ideas in a real browser on desktop and mobile.
- Keep the setup lightweight so iteration is fast.

## Project Status
This repository is intentionally lightweight and uses a no-build, static
workflow.

## Project Structure
Each app lives in its own folder under `src/`. Example:

- `src/notes/index.html`
- `src/notes/manifest.json`
- `src/notes/service-worker.js`
- `src/notes/assets/`

## Development Workflow
Serve static files locally from the repo root or an app folder:

- `python3 -m http.server 8000`

Then open `http://localhost:8000/src/<app>/` in a browser.

## Deployment (GitHub Pages)
Apps are deployed as static files from this repository. The URL pattern is:

- `https://tonylo.github.io/pwa-box/src/<app>/`

Set each app’s `manifest.json` `start_url` and `scope` to its folder path,
and keep the service worker in that folder to scope caching correctly.

## App Checklist
- `manifest.json` uses `start_url` and `scope` that match `src/<app>/`.
- `service-worker.js` lives in `src/<app>/` to control that scope.
- Provide at least one icon (preferably 192x192 and 512x512).

## GitHub Pages Settings
Publish from the repository root (no build step). The app folders are
served directly from `src/`.

## Contributing
Contributions are welcome once the baseline app and tooling are in place.
For now, please keep changes small and focused, and document any new
commands or conventions you add.
