/** Pure deterministic, SYNTHETIC planning data and calculations. No company or live data. */
var ThreadModel;
(function (ThreadModel) {
    ThreadModel.initialSettings = { uplift: 25, capacity: 0, transfer: 0, transport: 'standard', duration: 4 };
    const names = ['Style Knit Crew', 'Classic Cotton Tee', 'Winter Puffer Jacket', 'Ribbed Linen Shirt', 'Everyday Denim', 'Merino Cardigan', 'Trail Runner', 'Canvas Sneaker', 'Studio Hoodie', 'Classic Oxford Shirt', 'Thermal Base Layer', 'Summer Utility Bag', 'Heritage Wool Coat', 'Sport Legging', 'Ceramic Storage Set', 'Natural Skin Serum'];
    const categories = ['Apparel', 'Apparel', 'Outdoor', 'Apparel', 'Apparel', 'Apparel', 'Footwear', 'Footwear', 'Apparel', 'Apparel', 'Outdoor', 'Home', 'Outdoor', 'Apparel', 'Home', 'Beauty'];
    const price = [64, 29, 189, 48, 79, 95, 125, 74, 68, 59, 85, 45, 245, 69, 39, 54];
    ThreadModel.products = Array.from({ length: 1284 }, (_, i) => {
        const n = i % names.length, group = Math.floor(i / names.length);
        const baseDemand = i === 0 ? 425 : 140 + ((i * 41 + 137) % 340);
        const stock = i === 0 ? 900 : 800 + ((i * 173 + 440) % 1700);
        const risk = ((i * 37) % 1284) < 43 ? 'At risk' : (((i * 19 + 11) % 1284) < 202 ? 'Watch' : 'Healthy');
        return { id: `SK-${String(10048 + i).padStart(5, '0')}`, name: group === 0 ? names[n] : `${names[n]} / ${['Core', 'Seasonal', 'Nordic', 'Studio', 'Essential', 'Limited'][group % 6]} ${String(group + 1).padStart(2, '0')}`, category: categories[n], stock, baseDemand, price: price[n], risk, image: names[n].toLowerCase().includes('shirt') ? 'shirt' : n === 0 ? 'knit' : n === 2 || n === 12 ? 'coat' : n === 6 || n === 7 ? 'shoe' : 'package', factory: ['VN-01 · Hai Phong', 'TR-02 · Izmir', 'PT-04 · Porto'][i % 3] };
    });
    ThreadModel.first = ThreadModel.products[0];
    ThreadModel.locations = [
        { id: 'retail', name: 'Retail stores', subtitle: '128 destinations', icon: 'store', region: 'US / Northeast', detail: 'Customer-facing availability and demand' },
        { id: 'east', name: 'DC East', subtitle: 'New Jersey · 67% utilized', icon: 'warehouse', region: 'New Jersey, US', detail: 'Regional buffer and outbound fulfillment' },
        { id: 'west', name: 'DC West', subtitle: 'Nevada · 71% utilized', icon: 'warehouse', region: 'Nevada, US', detail: 'Secondary distribution and transfers' },
        { id: 'factory', name: 'Production VN-01', subtitle: 'Hai Phong · 83% load', icon: 'factory', region: 'Hai Phong, Vietnam', detail: 'Manufacturing capacity and changeover' },
        { id: 'supplier', name: 'Material suppliers', subtitle: '3 active inputs', icon: 'layers', region: 'Multiple regions', detail: 'Fabric, packaging and trims' }
    ];
    const cap = (n, min, max) => Math.max(min, Math.min(max, n));
    /** 8-week illustrative model: demand uplift weeks 2...duration+1; replenishment lag 2 weeks, deterministic weekly variation. */
    function simulate(product, settings) {
        const base = product.baseDemand, init = product.stock, supply = base * 0.94;
        let inventory = init, baseline = init, baselineStockouts = 0, proposedStockouts = 0, totalDemand = 0, totalSupply = 0, baselineFulfilled = 0, proposedFulfilled = 0, impactUnits = 0, firstRiskWeek = 0;
        const weeks = [];
        for (let w = 1; w <= 8; w++) {
            const variation = 1 + 0.055 * Math.sin(w * 1.1 + (parseInt(product.id.slice(3)) % 9));
            const naturalDemand = Math.round(base * variation);
            const promotion = w >= 2 && w <= settings.duration + 1;
            const demand = Math.round(naturalDemand * (promotion ? 1 + settings.uplift / 100 : 1));
            const arrived = Math.round(supply * (1 + settings.capacity / 100) + ((w === 3 || w === 4) ? settings.transfer / 2 : 0));
            const delay = settings.transport === 'express' ? 1 : 2;
            const availableSupply = w <= delay ? Math.round(arrived * .50) : arrived;
            const baseSupply = w <= 2 ? Math.round(supply * .50) : Math.round(supply);
            baseline += baseSupply;
            inventory += availableSupply;
            const baseFulfill = Math.min(baseline, naturalDemand), fulfill = Math.min(inventory, demand);
            baseline -= baseFulfill;
            inventory -= fulfill;
            baselineFulfilled += baseFulfill;
            proposedFulfilled += fulfill;
            totalDemand += demand;
            totalSupply += availableSupply;
            if (baseFulfill < naturalDemand)
                baselineStockouts++;
            if (fulfill < demand) {
                proposedStockouts++;
                impactUnits += demand - fulfill;
                if (!firstRiskWeek)
                    firstRiskWeek = w;
            }
            weeks.push({ week: w, baseline: Math.round(baseline), proposed: Math.round(inventory), demand, supply: availableSupply, shortfall: demand - fulfill, service: 100 * fulfill / Math.max(1, demand) });
        }
        const baseTotal = weeks.reduce((s, w) => s + Math.round(base * (1 + 0.055 * Math.sin(w.week * 1.1 + (parseInt(product.id.slice(3)) % 9)))), 0);
        const cost = Math.round((settings.transfer * 1.4) + (settings.capacity / 100 * base * 8 * 1.9) + (settings.transport === 'express' ? 6200 : 0));
        return { weeks, baselineStockouts, proposedStockouts, baselineService: 100 * baselineFulfilled / baseTotal, service: 100 * proposedFulfilled / totalDemand, revenueAtRisk: Math.round(impactUnits * product.price), impactUnits, totalDemand, totalSupply, firstRiskWeek, endingStock: Math.round(inventory), changePct: 100 * (proposedFulfilled / totalDemand - baselineFulfilled / baseTotal), weekCover: Math.max(0, inventory / (base || 1)), cost, affectedLocations: Math.min(128, Math.max(0, Math.round(impactUnits / Math.max(1, base) * 12))) };
    }
    ThreadModel.simulate = simulate;
    function severity(week) {
        if (!week)
            return 'Healthy';
        if (week.shortfall > 0 || week.proposed < week.demand * .55)
            return 'At risk';
        if (week.proposed < week.demand * 1.5)
            return 'Watch';
        return 'Healthy';
    }
    ThreadModel.severity = severity;
    function currency(n) { return Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n); }
    ThreadModel.currency = currency;
    function number(n) { return Intl.NumberFormat('en-US').format(Math.round(n)); }
    ThreadModel.number = number;
    function productsAtRisk() { return ThreadModel.products.filter(p => p.risk === 'At risk').length; }
    ThreadModel.productsAtRisk = productsAtRisk;
    function portfolioRisk(settings) { let atRisk = 0, shortfall = 0, rev = 0; const samples = ThreadModel.products.filter(p => p.risk === 'At risk'); for (const p of samples) {
        const r = simulate(p, settings);
        if (r.proposedStockouts || r.revenueAtRisk > 0) {
            atRisk++;
            shortfall += r.impactUnits;
            rev += r.revenueAtRisk;
        }
    } return { atRisk, shortfall, rev, items: samples }; }
    ThreadModel.portfolioRisk = portfolioRisk;
})(ThreadModel || (ThreadModel = {}));
globalThis.ThreadModel = ThreadModel;
