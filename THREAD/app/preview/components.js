/** Reusable visual primitives. Keep props and states explicit for future QML equivalents. */
const TReact = globalThis.React;
var ThreadUI;
(function (ThreadUI) {
    function Icon({ name, size = 18 }) {
        const shapes = {
            layers: React.createElement("g", null,
                React.createElement("path", { d: "m12 3 9 5-9 5-9-5 9-5z" }),
                React.createElement("path", { d: "m3 12 9 5 9-5M3 16l9 5 9-5" })),
            grid: React.createElement("g", null,
                React.createElement("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1" }),
                React.createElement("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1" }),
                React.createElement("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" }),
                React.createElement("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1" })),
            package: React.createElement("g", null,
                React.createElement("path", { d: "m12 2 9 5-9 5-9-5 9-5zM3 7v10l9 5 9-5V7M12 12v10" })),
            search: React.createElement("g", null,
                React.createElement("circle", { cx: "11", cy: "11", r: "7" }),
                React.createElement("path", { d: "m16 16 5 5" })),
            plus: React.createElement("g", null,
                React.createElement("path", { d: "M12 5v14M5 12h14" })),
            chevron: React.createElement("path", { d: "m9 6 6 6-6 6" }), down: React.createElement("path", { d: "m6 9 6 6 6-6" }),
            arrows: React.createElement("g", null,
                React.createElement("path", { d: "M5 6h13l-4-4m4 4-4 4M19 18H6l4 4m-4-4 4-4" })),
            box: React.createElement("g", null,
                React.createElement("rect", { x: "3", y: "5", width: "18", height: "16", rx: "2" }),
                React.createElement("path", { d: "M3 10h18M9 5V2h6v3" })),
            factory: React.createElement("g", null,
                React.createElement("path", { d: "M3 21V10l6 4v-4l6 4V5h5v16H3zM15 8h5M7 18h2m3 0h2m3 0h2" })),
            store: React.createElement("g", null,
                React.createElement("path", { d: "M3 10h18l-2-6H5l-2 6zM5 10v11h14V10M9 21v-7h6v7" })),
            warehouse: React.createElement("g", null,
                React.createElement("path", { d: "m2 10 10-7 10 7v11H2V10zM7 21v-8h10v8M7 16h10" })),
            clock: React.createElement("g", null,
                React.createElement("circle", { cx: "12", cy: "12", r: "9" }),
                React.createElement("path", { d: "M12 7v5l4 2" })),
            edit: React.createElement("g", null,
                React.createElement("path", { d: "M4 20h16M5 16l11-11 3 3L8 19H5v-3z" })),
            alert: React.createElement("g", null,
                React.createElement("path", { d: "m12 3 10 18H2L12 3zM12 9v5M12 18h.01" })),
            check: React.createElement("path", { d: "m4 12 5 5L20 6" }),
            spark: React.createElement("g", null,
                React.createElement("path", { d: "M12 2v5m0 10v5M2 12h5m10 0h5M5 5l4 4m6 6 4 4m0-14-4 4m-6 6-4 4" })),
            target: React.createElement("g", null,
                React.createElement("circle", { cx: "12", cy: "12", r: "9" }),
                React.createElement("circle", { cx: "12", cy: "12", r: "5" }),
                React.createElement("circle", { cx: "12", cy: "12", r: "1" })),
            chart: React.createElement("g", null,
                React.createElement("path", { d: "M3 20h18M4 16l5-6 4 3 6-8" })),
            settings: React.createElement("g", null,
                React.createElement("circle", { cx: "12", cy: "12", r: "3" }),
                React.createElement("path", { d: "M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2" })),
            bookmark: React.createElement("g", null,
                React.createElement("path", { d: "M6 3h12v18l-6-4-6 4V3z" })),
            globe: React.createElement("g", null,
                React.createElement("circle", { cx: "12", cy: "12", r: "9" }),
                React.createElement("path", { d: "M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18" })),
            menu: React.createElement("g", null,
                React.createElement("path", { d: "M4 6h16M4 12h16M4 18h16" })),
            close: React.createElement("path", { d: "M5 5l14 14M19 5 5 19" }),
            info: React.createElement("g", null,
                React.createElement("circle", { cx: "12", cy: "12", r: "9" }),
                React.createElement("path", { d: "M12 11v6M12 7h.01" })),
            download: React.createElement("g", null,
                React.createElement("path", { d: "M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4" })),
            play: React.createElement("path", { d: "m8 5 11 7-11 7V5z" }),
            sliders: React.createElement("g", null,
                React.createElement("path", { d: "M4 6h16M4 12h16M4 18h16" }),
                React.createElement("circle", { cx: "8", cy: "6", r: "2" }),
                React.createElement("circle", { cx: "16", cy: "12", r: "2" }),
                React.createElement("circle", { cx: "10", cy: "18", r: "2" }))
        };
        return React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.65", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, shapes[name] || shapes.package);
    }
    ThreadUI.Icon = Icon;
    function StatusChip({ status, small = false }) { let key = status.toLowerCase().replace(/ /g, '-'); return React.createElement("span", { className: 'status-chip ' + key + (small ? ' small' : '') },
        React.createElement("i", { className: "status-dot" }),
        status); }
    ThreadUI.StatusChip = StatusChip;
    function Metric({ label, value, note, accent }) { return React.createElement("div", { className: "metric" },
        React.createElement("div", { className: "metric-label" }, label),
        React.createElement("div", { className: 'metric-value ' + (accent || '') }, value),
        note && React.createElement("div", { className: "metric-note" }, note)); }
    ThreadUI.Metric = Metric;
    function Sparkline({ values, color = '#5c55d8', height = 42 }) { const hi = Math.max(...values, 1), lo = Math.min(...values, 0), d = Math.max(1, hi - lo); const line = values.map((v, i) => `${(i * 100) / (values.length - 1)},${36 - 32 * (v - lo) / d}`).join(' '); return React.createElement("svg", { className: "sparkline", viewBox: "0 0 100 40", height: height, preserveAspectRatio: "none" },
        React.createElement("polyline", { points: line, fill: "none", stroke: color, strokeWidth: "2.3", strokeLinejoin: "round", strokeLinecap: "round", vectorEffect: "non-scaling-stroke" })); }
    ThreadUI.Sparkline = Sparkline;
    function AvatarProduct({ kind = 'knit', large = false }) {
        return React.createElement("div", { className: 'product-avatar ' + (large ? 'large' : '') + ' ' + kind }, kind === 'knit' || kind === 'coat' || kind === 'shirt' ? React.createElement("svg", { viewBox: "0 0 84 90", "aria-hidden": "true" },
            React.createElement("path", { d: "M29 13 17 20 5 36l14 10 7-9v40h33V37l8 9 13-10-15-16-12-7-7 8H36z", fill: kind === 'coat' ? '#9bacb1' : kind === 'shirt' ? '#eae3d3' : '#c8b4a4', stroke: "#817a77", strokeWidth: "1.1" }),
            React.createElement("path", { d: "M29 13c4 11 20 11 24 0M26 42h33M32 17l5 5M51 18l-4 5", fill: "none", stroke: "#796e67", strokeOpacity: ".55", strokeWidth: "1.2" })) : kind === 'shoe' ? React.createElement("svg", { viewBox: "0 0 90 78" },
            React.createElement("path", { d: "M10 43c11 0 20-18 30-18 6 12 24 20 40 23 9 2 8 14-5 16H16C4 64 1 50 10 43z", fill: "#bdc9d1", stroke: "#6e7980", strokeWidth: "2" }),
            React.createElement("path", { d: "M28 38h18M23 43h23M16 61h62", stroke: "#fff", strokeWidth: "2" })) : React.createElement(Icon, { name: "package", size: large ? 48 : 28 }));
    }
    ThreadUI.AvatarProduct = AvatarProduct;
    function SectionTitle({ kicker, title, right }) { return React.createElement("div", { className: "section-head" },
        React.createElement("div", null,
            React.createElement("div", { className: "overline" }, kicker),
            React.createElement("h2", null, title)),
        right); }
    ThreadUI.SectionTitle = SectionTitle;
})(ThreadUI || (ThreadUI = {}));
globalThis.ThreadUI = ThreadUI;
