# THREAD / From Shelf to Source — Product design case study outline

**Portfolio positioning:** Designing and engineering complex applications where humans must understand the consequences of changing a plan.

## Problem hypothesis

Planning across products, locations, manufacturing and distribution often requires switching views and reconstructing dependencies mentally. THREAD explores a workspace where product selection, supply-lineage inspection, time and scenario evaluation share one context.

This is a **design hypothesis**, not the result of verified user interviews. Validate with real planning professionals before claiming improved outcomes.

## Proposed flow

Product Explorer → Focused Supply Network → Scenario Impact → Portfolio Exposure.

1. **Find an SKU** among 1,284 synthetic records, with filtered counts explicitly shown.
2. **Select a facility** to inspect its context while keeping the product selected.
3. **Edit an assumption** in a draft scenario and explicitly run the model.
4. **Scrub time** to investigate projected issues at each week.
5. **Inspect flagged products** in the portfolio table to understand cross-product exposure.

## Design choices

- Product selection persists across screens, avoiding accidental loss of context.
- A compact product explorer is always discoverable on the home workspace.
- The spatial path is a navigable diagram, not an uninformative 3D decoration.
- Model outputs are labeled as synthetic and scenario outcomes are distinct from live data.
- Draft changes do not silently overwrite previously simulated results.
- Accessibility: semantic labels, keyboard controls, non-color statuses, reduced-motion CSS.

## Next experiments

- Five user interviews with planners or internal business application builders.
- Test whether users can identify which SKU and which week they are viewing.
- Compare network-first and table-first investigation on realistic tasks.
- Assess whether hiding inspector details improves completion and error rates.
- Validate the quantitative model with an operations domain expert before making outcome claims.

## Skills demonstrated

React / TypeScript / Vite, reusable component APIs, state orchestration, deterministic simulation, information architecture, spatial information display, scenario UX and domain constraints.

**Not affiliated with RELEX Solutions or the Google Stitch provider.**
