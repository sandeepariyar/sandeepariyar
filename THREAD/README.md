# THREAD — From Shelf to Source

**Interactive supply-chain planning UX prototype** · React · TypeScript · Vite

Independent design-engineering portfolio project by Sandeep Pariyar. **Not an official RELEX product.** All catalog, inventory, revenue and facility information is synthetic. The model is illustrative and not an operational forecasting system.

## Open the interactive demo

Download **[index.html](./index.html)** and open it in Chrome or Edge. It is a single-file, self-contained offline React demonstration.

## Work with the complete source

The complete React + TypeScript + Vite project is in **[app/](./app/)**.

```bash
cd app
npm install
npm run dev
npm test
npm run build
```

The project includes:
- [Reusable UI components](./app/src/components.tsx) and [design tokens/styles](./app/src/styles.css)
- [Product selection, network, scenario and portfolio screens](./app/src/App.tsx)
- [Deterministic synthetic simulation](./app/src/model.ts)
- [Case study](./app/docs/CASE_STUDY.md) and [QML migration handoff](./app/docs/QML_HANDOFF.md)
- [Offline preview](./app/preview/index.html) and automated model/UI-tree checks

## Current scope and UX opportunities

Four connected workspaces: product discovery, supply lineage, scenario simulation and portfolio exposure. Scenario edits remain separate from the last simulated result; no live business state can be changed.

See **[UX audit and next improvements](./docs/UX_AUDIT.md)** for known problems and design priorities.

## About the data

1,284 products and all warehouses, factories, scenario effects and revenue estimates are fictional. Forecasting logic is a small, deterministic educational model, not a RELEX or third-party business algorithm. This repository is unaffiliated with RELEX Solutions.

## Credits

Concept and implementation by Sandeep Pariyar, using independent ideas developed through Google Stitch visual exploration. Third-party React/ReactDOM license notices are retained in the offline preview and [notices](./THIRD_PARTY_NOTICES.md).
