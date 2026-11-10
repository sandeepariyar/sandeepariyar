# THREAD — From Shelf to Source

**Interactive supply-chain planning UX portfolio prototype**

THREAD is an independent design-engineering demonstration, not a RELEX product or an operational planning system. All products, locations, financial impacts, and simulation outputs are fictional.

## Explore

Open **[index.html](./index.html)** locally in a browser. This standalone build is self-contained and does not require an npm installation. It contains the compiled React UI and its synthetic scenario model.

### Prototype features

- Product Explorer with a synthetic 1,284-SKU catalog, search and status filtering
- Product/warehouse/factory network inspection with shared selection
- Scenario controls for demand uplift, production capacity, transfers, and transport assumptions
- Eight-week deterministic inventory simulation, before/after comparisons, and explicit draft-versus-run states
- Portfolio risk view and synthetic CSV export
- Keyboard-friendly controls and reduced-motion styling

## Limitations and status

This **branch is a reviewable standalone web-demo snapshot**. The complete **React + TypeScript + Vite source project** remains separate and is **not yet included in this branch**. The synthetic model is illustrative, not a validated optimizer or financial forecast. No backend, actual business telemetry, production integrations, or live plan publishing are provided.

Planned improvements: product-specific network dependencies, shared-capacity portfolio logic, longer product lists/pagination, better global search and inspector responsiveness.

## Technology and credits

Original THREAD concept and application for portfolio exploration by Sandeep Pariyar. React runtime is distributed under the MIT license (Facebook, Inc. and contributors). This project is independent of RELEX Solutions and not affiliated with or endorsed by it.
