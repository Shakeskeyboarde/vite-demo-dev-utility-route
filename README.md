# Demo: Vite Dev Server Utility Route

Demo serving a dev server utility route (eg `/__inspect`) which is itself a full Vite-built single page application.

## Getting Started

After cloning this repo, run the following commands in the repo root.

1. `corepack enable pnpm`
2. `pnpm install`
3. `pnpm start`

This will build and start the [demo](packages/demo) package. Open the demo in your browser, and then add the `/__inspect` route to see the dev utility app.

The [plugin](packages/plugin) package should be setup so that it can be copied to it's own repo as a template for non-monorepo plugin project.
