# Dependency review

Reviewed against the npm registry on November 11, 2026, using Bun 1.3.14 and
Node 22.23.1.

## Applied

- Updated the site and the independent `resume/` package to current versions
  within their existing major-version ranges.
- Updated Next.js and its ESLint config together to 16.4.6, React and React DOM
  to 19.3.1, and React types to 19.3.0. Removed the effective React 19.0.2 type
  pin and aligned Node types with the configured Node 22 runtime.
- Updated `react-to-pdf` to 3.2.2 and `react-syntax-highlighter` to 16.1.2 to
  remove vulnerable jsPDF and PrismJS dependencies.
- Regenerated both lockfiles to refresh transitive dependencies. The new
  `bun.lock` files replace the binary `bun.lockb` files.
- Updated the shared cache profile's type inference for Next.js's overloaded
  `cacheLife` API. Explicitly retained existing prefetch behavior with
  `partialPrefetching: false`.
- Replaced effect-based hydration flags with a shared `useSyncExternalStore`
  hook, and synchronized sketchbook props and lightbox bounds during render
  instead of effects, to satisfy the updated React lint rules.

## Compatibility exception

`wasm-feature-detect` is overridden to 1.8.0, the previously working version.
Version 1.10.0 introduces a WebAssembly data URL that crashes Next.js 16.4.6's
Turbopack build with `Unsupported data URL encoding: charset=utf-8;base64`.
No newer npm release was available. Revisit this override when either package
fixes that interoperability issue.

## Deferred major upgrades

These remain intentionally outside this compatibility-focused update. They
need separate migration review and runtime testing, not just a lockfile bump.

| Package                      | Installed | Latest           |
| ---------------------------- | --------- | ---------------- |
| `@vercel/analytics`          | 1.6.1     | 2.0.1            |
| `@vercel/speed-insights`     | 1.3.1     | 2.1.0            |
| `ai`                         | 6.0.330   | 7.0.169          |
| `lucide-react`               | 0.555.0   | 1.72.0           |
| `mermaid`                    | 10.9.8    | 12.3.0           |
| `react-pdf`                  | 10.5.0    | 11.0.0           |
| `eslint` / `@eslint/js`      | 9.39.5    | 10.14.0 / 10.0.1 |
| `globals`                    | 16.5.0    | 17.14.0          |
| `lefthook`                   | 1.13.6    | 2.2.2            |
| `tailwindcss`                | 3.4.19    | 4.3.5            |
| `typescript` (both packages) | 5.9.3     | 7.0.2            |
| `resume/@notionhq/client`    | 2.3.0     | 5.31.1           |
| `resume/dotenv`              | 16.6.1    | 18.0.10          |
| `resume/ora`                 | 8.2.0     | 10.0.0           |

Node types deliberately stay on major 22 to match `engines.node`, rather than
the registry's latest major 26. The resume Notion upgrade also requires adapting
its database queries to the newer data-source API.

## Validation and remaining advisories

- Production build: passed, including generation of all 87 static pages.
- Site TypeScript check and the separate resume TypeScript check: passed.
- ESLint: passed with the same two existing image warnings as the original
  dependency set.
- Frozen-lockfile installation: passed for both packages.
- Production browser smoke tests: home page, theme toggle, blog navigation,
  and resume page passed without browser errors.
- Isolated browser regression test using the actual sketchbook grid with mocked
  network/router/lightbox dependencies: initial pages, lightbox opening, prop
  replacement and shrinking, deletion, empty refresh, and repopulation passed.
- The resume generator was type-checked, not executed against live Notion data.
- Resume dependency audit: no advisories.
- Site dependency audit: four advisories remain, with no critical findings:

| Dependency                | Severity | Advisory            |
| ------------------------- | -------- | ------------------- |
| `zod`                     | High     | GHSA-mrhx-c7xc-m3w5 |
| `minimatch`               | Moderate | GHSA-g3hv-75wg-m249 |
| `postcss-selector-parser` | Moderate | GHSA-rj75-hqrm-r3gf |
| `katex`                   | Low      | GHSA-238p-pmpm-9mq7 |

These are transitive dependencies constrained by their parent packages.
`bun audit` still exits nonzero for the site. Do not force unrelated major
versions through overrides without checking the affected parents' APIs,
especially Jimp's Zod 3 dependency.

The build still reports missing `metadataBase` and an unsupported Notion
`child_database` renderer. Those warnings were not addressed in this dependency
update.
