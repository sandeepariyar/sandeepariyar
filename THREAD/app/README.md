# THREAD — From Shelf to Source

**Independent interactive supply-chain planning UX portfolio project** · React + TypeScript + Vite · 1600 × 900 desktop target

THREAD is an original concept, **not** an official RELEX product and not based on proprietary RELEX data or business rules. It demonstrates reusable interface architecture, connected information, scenario modeling and workflow design.

## Preview now, without installation

Open `preview/index.html` in Chrome or Edge. This offline build includes an embedded local React runtime and compiled TypeScript/JSX so no network or npm installation is needed.

## Standard React + Vite development

With Node.js 20.19+ / 22+ installed:

```bash
npm install
npm run dev
```

Use the URL printed by Vite. For a distributable production build, run `npm run build`.

The offline preview uses an MIT-licensed React 16 UMD runtime for compatibility with this network-restricted build environment, while the Vite project specifies React 18 and keeps the UI in `src/*.tsx`. It intentionally uses class-based React state APIs supported by both. The offline preview and Vite application render the **same authored React components and TypeScript logic**.

## Four connected workspaces

1. **Product Explorer** — search/sort/filter the 1,284-record synthetic catalog; select a SKU and inspect its supply nodes.
2. **Supply Network** — see five dependency layers, select nodes and inspect simulated impacts at any week.
3. **Scenario Studio** — adjust demand uplift, promotion duration, production capacity, transfer quantity and transport timing; explicitly run the model; compare with baseline.
4. **Portfolio Exposure** — inspect the 43 catalog-flagged SKUs; view modeled shortfalls, select rows, export a synthetic CSV.

## Functional interactions

- Shared selected SKU, facility, scenario and week across views
- Search and 2-category filters, sorting, inspector selection and navigation
- `Ctrl+K` focuses catalog search
- Week scrubber updates connected statuses
- Explicit scenario changes versus previously simulated result (no misleading silent recomputation)
- Deterministic inventory model with baseline comparison, stockouts, fulfillment, revenue exposure, illustrative mitigation costs
- Scenario drafts saved to browser-local storage (never transmitted)
- Portfolio export as local CSV
- Keyboard-operable controls, semantic labels and reduced-motion preferences

## Architecture for eventual QML port

| Layer | Source | Qt/QML equivalent |
|---|---|---|
| Synthetic data / deterministic engine | `src/model.ts` | C++ domain models and simulation |
| Reusable UI component library | `src/components.tsx` | QML custom components / design tokens |
| Screen orchestration / state | `src/App.tsx` | ViewModel (C++) + QML pages |
| Design tokens, states, responsive layout | `src/styles.css` | QML Singleton design tokens + Layouts |
| Offline preview build | `preview/` | Desktop Qt executable or Qt WebAssembly |

The model is deliberately separate from view markup and does not rely on React APIs. Preserve the data contracts and interaction behavior when porting rather than mechanically translating HTML/CSS.

## Limitations

- All product and facility data are fictional. No actual supply-chain API is used.
- The inventory model is deliberately simplified and **not a validated demand forecast, optimization engine or operational recommendation**.
- The 43 flagged SKUs represent synthetic catalog states; simulated exposure may be different.
- Supply-node connections are illustrative; not a physically optimized network.
- Saving drafts is local to this browser. There is no production publishing, user authentication, collaboration or backend.
- Displaying more than the first 30 matching products requires narrowing the search; table virtualization/pagination is a production follow-up.
- Source package installs `react` and Vite with npm on a network-enabled machine. Here the offline preview is runnable without installation.

## Origin & rights

Design inspired by the user's Google Stitch concept screens and accompanying `DESIGN.md`. Recreated as a coherent interactive application using independent code, custom SVGs and a shared data model. Original implementation provided as a portfolio prototype. The offline React UMD libraries retain the React project's MIT attribution.
