# THREAD — Engineering handoff for Qt/QML

The React implementation is the reference for design *and behavior*. Port the reusable contracts and user-flow semantics, not the CSS property names.

## Target

Qt 6.11.2 desktop, C++17 backend, Qt Quick/QML application, Qt Quick 3D optional. Suggested design base **1600 × 900**; minimum usable desktop target **1280 × 800**. Use Figma-like density and clear text at 100–150% Windows scaling.

## Source of truth

| Concern | React prototype | QML port |
|---|---|---|
| Synthetic catalog | `src/model.ts:ThreadModel.products` | `QAbstractListModel` with `ProductId` roles |
| Simulated projection | `ThreadModel.simulate` | Pure C++ `SimulationEngine::simulate` returning value objects |
| Current selection | `state.productId` | `PlanningViewModel.currentProductId` |
| Draft parameters | `state.settings` | `PlanningViewModel.draftScenario` |
| Confirmed simulation | `state.simulatedSettings` + `state.result` | `PlanningViewModel.lastRunScenario` + `SimulationResult` |
| Time position | `state.week` | `PlanningViewModel.week` |
| Selected node | `state.selectedNode` | `PlanningViewModel.nodeId` |
| Shared reusable UI | `src/components.tsx` | QML `ThreadTokens`, `StatusChip`, `ProductRow`, `MetricTile`, `NodePin`, `WeekTimeline`, `InspectorPanel` |
| Navigation | `Page` | enum or `StackLayout` with Page IDs |

### State invariants

1. A product selection is persistent across every page.
2. Editing demand/capacity/transport changes the **draft**. It does not change the last simulated numbers until **Run Simulation** is clicked.
3. Portfolio exposure uses `simulatedSettings` (last-run scenario), never unsimulated draft parameters.
4. The time scrubber moves through a single computed result; it should never recompute the entire scenario on each frame.
5. All data in this demo is fictional. Do not wire buttons to real systems or imply an optimization engine.
6. User changes are visible via text and status, not color alone.

## Suggested QML folder structure

```
qml/
  Main.qml
  Theme/ThreadTokens.qml
  Components/
    AppHeader.qml, NavigationRail.qml, ProductRow.qml,
    StatusChip.qml, MetricTile.qml, NodePin.qml,
    InventoryTimeline.qml, ContextInspector.qml
  Screens/
    ProductsPage.qml, LineagePage.qml,
    ScenarioPage.qml, PortfolioPage.qml
src/
  model/ProductModel.cpp, PlanningViewModel.cpp,
  simulation/SimulationEngine.cpp
```

## Component interaction contracts

**ProductRow**: properties `sku`, `displayName`, `stock`, `risk`, `selected`; signal `selected(sku)`.

**NetworkNode**: properties `id`, `type`, `name`, `state`, `selected`; signal `inspected(id)`. Render selected and projected-risk states independently.

**ScenarioControls**: properties `draftSettings`, `dirty`, `validation`; signals `parameterEdited(name,value)`, `runRequested()`, `resetRequested()`, `saveDraftRequested()`.

**Timeline**: properties `resultWeeks`, `selectedWeek`; signal `weekSelected(index)`. Avoid recomputing on `weekSelected`.

**Inspector**: properties `selectedProduct`, `selectedNode`, `selectedWeek`, `result`, `dirty`; signal `openScenarioRequested()`.

## Performance

Cache `SimulationResult` for current SKU and scenario; generate the 1,284 synthetic SKUs once. Use `ListView` rather than creating 1,284 QML delegates. Prefer ShaderEffect only where its visual value is measurable; the central network can initially be a `Canvas` + component overlays. Add Qt Quick 3D only after 2D interaction layout and focus states are stable.

## Validation after port

- The first SKU is `SK-10048` and is named `Style Knit Crew`.
- The generated catalog has 1,284 SKUs, 43 of which are flagged for review.
- Initial scenario +25% yields unmet demand for this selected SKU.
- Extra capacity 30%, transfer 1000 units and express transport reduce that unmet demand to zero under this demonstrative formula.
- Product selection and week remain consistent across all four pages.
- Escape closes Help; Ctrl+K focuses product search (desktop).
- QML application launches cleanly without `QQmlApplicationEngine failed to load component`.

## Model disclaimer

The engine is **not** RELEX software and does not represent validated logistics or business forecasting. There is no backend, live-data stream, authentication, or production plan execution.
