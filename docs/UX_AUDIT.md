# THREAD — Product design audit / implementation backlog

The project illustrates design-to-code product thinking. These observations are **not claims of features already implemented**.

## Strengths
- One selected SKU and scenario context across four workspaces
- Explicit synthetic data and no live-publishing action
- Reusable React UI components and independent planning model
- Visual separation between edited inputs and last simulated results
- Documented deterministic modeling and automated checks

## Critical fixes
1. **Product-specific lineage** — render factory/supplier nodes using the selected SKU's actual fictional dependencies instead of a static generic network.
2. **Portfolio modeling honesty** — currently aggregates simulations independently, not competing use of shared factory or warehouse capacity. Either model shared capacities or relabel as independent SKU analysis.
3. **Product discovery** — remove the 30-item visibility ceiling through pagination or virtualization; distinguish total catalog, filtered count, selected count, and flagged count.
4. **Search semantics** — either implement global search for facilities and scenarios or limit the promise to products.
5. **Responsive inspector** — at small desktop widths move inspector to a keyboard-accessible drawer instead of hiding important details.
6. **Accessibility** — implement complete listbox keyboard semantics or use native button rows; verify dialog focus behavior and reduced-motion support.
7. **Simulation interaction** — make a changed assumption propagate visibly through affected nodes and the timeline with explainable causes and no false precision.

## Recommended usability tasks
- Find the earliest modeled inventory shortage for a selected SKU.
- Identify the location and dependency most relevant to that shortage.
- Compare two mitigation options while keeping baseline and proposed results distinguishable.

This project remains a concept prototype, not a validated operational system.
