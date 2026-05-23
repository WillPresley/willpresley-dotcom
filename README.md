# willpresley-dotcom

Source code for [https://willpresley.com](https://willpresley.com), a static personal site built with Jekyll.

## Overview

This repository contains:

- A blog with Markdown posts and tag pages
- A projects collection with custom permalinks/navigation
- Custom Jekyll plugins for sitemap generation, tags, and collection behavior
- SCSS source files with minified CSS output committed to the repo
- Client-side theme switching (system/dark/light)
- RSS (`feed.xml`) and JSON Feed (`feed.json`)
- Isso comments integration

## Tech Stack

- Ruby + Jekyll
- Liquid templates (`_layouts`, `_includes`)
- SCSS (`_sass`) compiled to `css/*.min.css`
- Vanilla JavaScript (`js/`)
- Custom Ruby plugins in `_plugins/`

Primary config lives in `_config.yml`.

## Repository Layout

- `_config.yml`: Site metadata, collections, plugin config, sitemap config
- `index.html`, `about.md`, `blog.md`, `uses.md`: Top-level pages
- `blog/_posts/`: Blog post source files
- `_projects/`: Project collection entries
- `_layouts/`: Page/post/project templates
- `_includes/`: Shared partials (head, nav, analytics, comments, etc.)
- `_plugins/`: Custom Jekyll plugin code
- `_sass/`: SCSS source
- `css/`: Compiled/minified CSS assets
- `js/`: Front-end scripts (theme switch and site scripts)
- `uploads/`, `images/`, `fonts/`, `static/`: Static assets

## Local Development

### 1) Prerequisites

- Ruby (current stable)
- RubyGems
- Jekyll

If Bundler is available and you add a Gemfile, use Bundler workflow. This repo currently does not include a Gemfile.

### 2) Install Jekyll (global)

```bash
gem install jekyll bundler
```

### 3) Run the site locally

From the repository root:

```bash
jekyll serve --source . --livereload
```

Then open `http://127.0.0.1:4000`.

Note: `_config.yml` contains a machine-specific `source` path used for deployment workflow. Passing `--source .` ensures local builds use this checkout.

### 4) Production build (local check)

```bash
jekyll build --source .
```

Generated output goes to `_site/` unless overridden.

## Content Workflow

### Blog posts

- Add Markdown files to `blog/_posts/` using `YYYY-MM-DD-title.md` naming.
- Set front matter fields like `layout`, `title`, `date`, `tags`, and `comments` as needed.

### Projects

- Add new collection documents to `_projects/`.
- Existing plugin logic generates project permalinks and previous/next navigation.

## Styling and Scripts

- Edit SCSS in `_sass/` (entrypoint: `_sass/screen.scss`).
- Compiled assets are committed under `css/`.
- Theme toggle behavior is implemented in `js/theme-switch.js` (and minified build files in `js/`).
- Optional style lint config is in `.stylelintrc.json`.

## Notable Customizations

- `tags.rb`: Generates per-tag blog index pages
- `spicy_collections.rb`: Custom project collection permalink/navigation helpers
- `sri.rb`: Supports Subresource Integrity hashing in templates
- `sitemap_generator.rb`: Custom sitemap generation
- `remove_from_rss.rb`: Excludes selected content from RSS output

## Current Repository Snapshot

- Blog posts: 15
- Project entries: 3
- Custom plugin files: 7
- Latest post file: `2026-05-22-taking-back-the-scroll-wheel.md`

## Deployment Notes

Deployment in this repo appears to rely on an external/private build script and server-specific paths.
If you are adapting this project for a different host, review:

- `_config.yml` (`source`, `url`, `baseurl`, sitemap settings)
- Asset URL usage in `_includes/head.html` and `_layouts/default.html`

## License

Copyright (c) 2015-2026 Will Presley.
