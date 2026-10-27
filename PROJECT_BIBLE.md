# Kurt Engine — Project Bible

This document is the authoritative reference for the Kurt Engine proof of concept. Any human contributor or AI assistant working on this repository must read and follow it before making changes.

---

## Purpose

The **Kurt Engine** is a minimal static site generator (SSG) built in Python. Its job is to turn Markdown content into a self-contained static website that can be opened locally or deployed without a server-side runtime.

The current proof of concept exists to validate a simple, understandable pipeline:

```
Markdown content → Python build script → HTML template → static output
```

The long-term vision is a personal publishing engine for **Kurt's English** — a site where content is written in Markdown, styled with plain CSS, and published as static HTML. The engine should remain small enough that a single developer (or AI assistant) can understand the entire codebase in minutes.

This is not a framework, CMS, or application server. It is a build tool.

---

## Philosophy

The Kurt Engine follows these principles:

1. **Simplicity over cleverness.** Prefer readable code and obvious data flow over abstractions, plugins, or configuration systems.
2. **Static by default.** The build output must be plain HTML, CSS, and assets. No JavaScript frameworks, no server requirements, no databases.
3. **Source vs. output separation.** Authors edit source files (`content/`, `templates/`, `assets/`). The `build/` folder is generated and must never be edited by hand.
4. **Minimal dependencies.** Use the Python standard library wherever possible. Third-party packages are allowed only when they solve a real problem that stdlib cannot reasonably handle (currently: Markdown conversion).
5. **Incremental growth.** Features are added only when there is a concrete need. The proof of concept is complete; further work requires explicit approval.
6. **Transparency for AI assistants.** The architecture must stay simple enough that an AI can reason about every file without hidden magic, build steps, or implicit conventions.

---

## Folder Structure

```
kurt-engine-poc/
├── PROJECT_BIBLE.md      # This document
├── build.py              # The build engine (single entry point)
├── requirements.txt      # Python dependencies
├── .gitignore            # Ignores generated and local files
├── content/              # Markdown source files
│   └── home.md
├── templates/            # HTML templates with placeholders
│   └── base.html
├── assets/               # Static assets (CSS, images, etc.)
│   └── style.css
└── build/                # Generated output (do not edit)
    ├── index.html
    └── assets/
        └── style.css
```

---

## Folder Responsibilities

### `content/`
Holds Markdown files with YAML-style front matter. Each file represents a page or piece of content.

- Front matter is delimited by `---` blocks at the top of the file.
- Supported metadata keys are parsed as simple `key: value` pairs (currently `title` is used).
- The Markdown body below the front matter is converted to HTML during the build.

**Rule:** Only human-authored content belongs here. No generated files.

### `templates/`
Holds HTML shell files with placeholder tokens.

- Current placeholders: `{{ title }}` and `{{ content }}`.
- Templates define page structure (head, header, main, etc.).
- Asset references in templates must use paths relative to the `build/` output root (e.g. `assets/style.css`, not `../assets/style.css`).

**Rule:** Templates are layout only. No business logic, no inline scripts unless explicitly approved.

### `assets/`
Holds static files copied verbatim into `build/assets/` during each build.

- Currently contains `style.css`.
- Future assets (images, fonts) would also live here.

**Rule:** Source assets live here. The copies in `build/assets/` are generated.

### `build/`
Generated output directory. Entirely produced by `build.py`.

- `build/index.html` — the compiled page.
- `build/assets/` — copied static assets.
- Listed in `.gitignore`. Safe to delete and regenerate at any time.

**Rule:** Never edit files in `build/` directly. Always change source files and re-run the build.

### Project root files

| File | Responsibility |
|------|----------------|
| `build.py` | Single build script: parse content, render template, copy assets, write output |
| `requirements.txt` | Lists required Python packages (`markdown` only) |
| `.gitignore` | Excludes `build/`, Python caches, virtual environments, and local secrets |
| `PROJECT_BIBLE.md` | Project governance and architectural reference |

---

## Build Process

Run the build from the project root:

```bash
pip install -r requirements.txt   # first time only
python3 build.py
```

### What `build.py` does, step by step

1. **Load** `content/home.md` and read the raw text.
2. **Parse front matter** — extract metadata (`title`) and the Markdown body using a simple `---` delimiter parser.
3. **Convert** the Markdown body to HTML using the `markdown` library.
4. **Load** `templates/base.html`.
5. **Inject** — replace `{{ title }}` and `{{ content }}` with parsed values.
6. **Prepare output** — create `build/` if it does not exist.
7. **Copy assets** — copy the entire `assets/` directory to `build/assets/`.
8. **Write** the final HTML to `build/index.html`.
9. **Report** success: `Build complete → build/index.html`.

### Deployment

The `build/` directory is self-contained. To deploy, upload the contents of `build/` to any static host (GitHub Pages, Netlify, S3, etc.). No Python runtime is needed on the server.

### Verifying the build

After building, confirm:

- `build/index.html` exists and contains the expected title and content.
- `build/assets/style.css` exists.
- Opening `build/index.html` in a browser (or serving `build/` with a local HTTP server) loads styles correctly.

---

## Coding Standards

### Python (`build.py`)

- Use only the Python standard library plus packages listed in `requirements.txt`.
- Keep functions small and named for what they do (`parse_front_matter`, `build`).
- Use `encoding="utf-8"` for all file reads and writes.
- Prefer explicit steps with short comments over clever one-liners.
- Do not add CLI argument parsing, logging frameworks, or configuration files unless explicitly approved.
- New build steps should be added as clear sequential blocks inside `build()`, not as a plugin system.

### Markdown (`content/`)

- Every content file must begin with a `---` front matter block.
- Use standard Markdown syntax. No raw HTML in content unless explicitly approved.
- One file per page (current POC: single `home.md` → `index.html`).

### HTML (`templates/`)

- Use semantic elements (`header`, `main`).
- Placeholder tokens use the `{{ name }}` format with spaces inside the braces.
- Keep templates free of inline styles and scripts.
- Asset paths must resolve correctly from within `build/`.

### CSS (`assets/`)

- Plain CSS only. No preprocessors (Sass, Less), no CSS frameworks (Bootstrap, Tailwind).
- Keep styles readable and minimal.
- Use system font stacks and simple color values.

### General

- Minimize the scope of every change. A focused fix is better than a sweeping refactor.
- Match existing naming, formatting, and comment style.
- Do not add comments that merely narrate what the code does; comment only non-obvious logic.
- Do not add tests, README files, or documentation files beyond what is explicitly requested.

---

## Architectural Principles for AI Assistants

When working on the Kurt Engine, AI assistants must adhere to the following:

1. **Preserve the pipeline.** Content → build script → template → static output. Do not introduce intermediate layers (databases, APIs, ORMs, task queues).
2. **Keep `build.py` as the single entry point.** All build logic lives in one script until the project owner explicitly approves splitting it.
3. **Respect folder boundaries.** Content in `content/`, layout in `templates/`, styles in `assets/`, output in `build/`. Do not merge or relocate these without approval.
4. **Treat `build/` as ephemeral.** Never suggest editing generated files. Always fix the source and rebuild.
5. **Ask before expanding scope.** The POC is complete. New pages, new templates, new metadata fields, and new features all require explicit approval.
6. **Prefer stdlib over dependencies.** If a problem can be solved with `os`, `shutil`, `pathlib`, or similar, do not add a package.
7. **Do not over-engineer.** No abstract base classes, no factory patterns, no dependency injection, no event systems. Write straightforward procedural code.
8. **Show changes, don't hide them.** Keep diffs small and explain what changed and why. Do not refactor unrelated code in the same change.

---

## Things an AI Must Never Do Without Explicit Approval

The following actions are **forbidden** unless the project owner explicitly requests them in the current conversation:

### Architecture and structure
- Replace or redesign the build architecture (e.g. switching to Jekyll, Hugo, Eleventy, or a custom framework).
- Split `build.py` into multiple modules or packages.
- Change the folder structure (rename, merge, or relocate `content/`, `templates/`, `assets/`, or `build/`).
- Introduce a `src/` layout, monorepo structure, or package hierarchy.

### Dependencies and tooling
- Add new Python packages or upgrade existing ones beyond what is in `requirements.txt`.
- Introduce JavaScript/Node.js tooling (npm, webpack, Vite, etc.).
- Add CSS preprocessors, postprocessors, or CSS frameworks.
- Add templating engines (Jinja2, Mako, etc.) to replace the current string-replacement approach.
- Add linters, formatters, pre-commit hooks, or CI/CD pipelines.

### Features and scope
- Create additional pages, routes, or content files.
- Add navigation, pagination, tags, categories, or search.
- Add a development server, watch mode, or hot reload.
- Add internationalization (i18n) or multi-language support.
- Add authentication, comments, analytics, or any server-side functionality.

### Content and output
- Edit files in `build/` directly instead of rebuilding from source.
- Change the site's purpose, branding, or content without being asked.
- Add raw HTML, inline scripts, or tracking code to templates.

### Repository hygiene
- Create commits, push to remote, or open pull requests unless explicitly asked.
- Create additional documentation files (README, CHANGELOG, CONTRIBUTING) unless explicitly asked.
- Delete or rename existing project files.
- Add tests or test infrastructure unless explicitly asked.

### General behavior
- Perform sweeping refactors when a small targeted fix would suffice.
- Make changes the user did not ask for, even if they seem like improvements.
- Assume approval from a previous conversation carries over to a new session.

**When in doubt, describe the proposed change and wait for approval.**

---

## Current State (Proof of Concept — Complete)

| Component | Status |
|-----------|--------|
| Single-page build (`home.md` → `index.html`) | Done |
| Front matter parsing (`title`) | Done |
| Markdown → HTML conversion | Done |
| HTML template with placeholders | Done |
| Asset copying to `build/assets/` | Done |
| Self-contained `build/` output | Done |
| `requirements.txt` | Done |
| `.gitignore` | Done |
| `PROJECT_BIBLE.md` | Done |

No further features are planned until the project owner gives explicit direction.

---

*Last updated: proof of concept completion.*
