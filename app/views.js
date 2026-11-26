// Nigeria in Numbers — views. Each view returns an HTML string for #view.
// Routing and control state live in main.js; views only read the state
// object passed in and the data module. No network requests anywhere.

import { HEADLINES, GDP_SERIES, GROWTH_SERIES, GDP_CAPITA_SERIES, CPI_SERIES, CPI_INDEX, POP_SERIES, STATES, ZONES, BASKET, SOURCES, fmtPop, shareOfTotal, censusTotal } from './data.js';
import { lineChart, barChart } from './charts.js';

function sourceTag(source, year) {
  return `<span class="src">${source} · ${year}</span>`;
}

function headlineCards() {
  return HEADLINES.map((h) => `
    <article class="card">
      <div class="card-label">${h.label}</div>
      <div class="card-value">${h.value}</div>
      <div class="card-note">${h.note}</div>
      ${sourceTag(h.source, h.year)}
    </article>`).join('');
}

export function viewOverview() {
  const top5 = [...STATES].sort((a, b) => b.pop - a.pop).slice(0, 5)
    .map((s) => ({ label: s.name, v: Math.round(s.pop / 1e6 * 10) / 10 }));
  return `
  <section class="hero">
    <h1>Nigeria in Numbers</h1>
    <p class="lede">The key facts about Africa's largest country — population, economy, prices and
    people — from the official sources, in one place. Every figure is labelled with its
    source and year.</p>
    <div class="hero-facts">
      <span><strong>232.7m</strong> people (2024)</span>
      <span><strong>36</strong> states + FCT</span>
      <span><strong>6</strong> geopolitical zones</span>
      <span><strong>5</strong> official sources</span>
    </div>
  </section>
  <h2>Headline indicators</h2>
  <div class="cards">${headlineCards()}</div>
  <div class="grid2">
    <section class="panel">
      <h3>GDP, nominal (US$ bn) <span class="panel-src">World Bank · 2015–2024</span></h3>
      ${lineChart(GDP_SERIES.map((d) => ({ year: d.year, v: d.gdp })), { color: '#0b7a4b', format: (v) => '$' + v + 'bn', label: 'Nominal GDP 2015 to 2024' })}
      <p class="fine">Nominal GDP fell sharply in 2024 after the naira was floated — the economy
      grew 3.4% in real terms, but in dollar terms it shrank. <a href="#/economy">Economy →</a></p>
    </section>
    <section class="panel">
      <h3>Population (millions) <span class="panel-src">UN WPP 2024 · 2015–2024</span></h3>
      ${lineChart(POP_SERIES, { color: '#14532d', format: (v) => v + 'm', label: 'Population 2015 to 2024' })}
      <p class="fine">Nigeria adds roughly 5 million people a year — the fastest-growing large
      population in the world. <a href="#/people">People →</a></p>
    </section>
  </div>
  <section class="panel">
    <h3>Largest states, 2006 census (millions) <span class="panel-src">NPC · 2006</span></h3>
    ${barChart(top5, { color: '#0b7a4b', format: (v) => v + 'm', label: 'Five largest states by 2006 census population' })}
    <p class="fine">Kano and Lagos are near-tied at the top — 9.40m and 9.11m in the 2006 census.
    <a href="#/states">All 36 states + FCT →</a></p>
  </section>`;
}

const ECONOMY_METRICS = {
  gdp: { title: 'GDP, nominal (US$ bn)', series: GDP_SERIES.map((d) => ({ year: d.year, v: d.gdp })), format: (v) => '$' + v + 'bn', color: '#0b7a4b', type: 'line', about: 'Gross domestic product at current prices, in US dollars. Source: World Bank, World Development Indicators.' },
  capita: { title: 'GDP per capita (current US$)', series: GDP_CAPITA_SERIES, format: (v) => '$' + v.toLocaleString(), color: '#14532d', type: 'line', about: 'GDP divided by midyear population. The 2024 fall to $807 reflects the naira devaluation, not a collapse in output. Source: World Bank, World Development Indicators.' },
  growth: { title: 'Real GDP growth (% year-on-year)', series: GROWTH_SERIES, format: (v) => v + '%', color: '#0b7a4b', type: 'bar', about: 'Growth in GDP at constant prices. Nigeria contracted in 2016 and 2020 (recession and COVID-19) and has grown every year since. Source: National Bureau of Statistics.' },
};

export function viewEconomy(state) {
  const m = ECONOMY_METRICS[state.economyMetric] || ECONOMY_METRICS.gdp;
  const chart = m.type === 'bar'
    ? barChart(m.series.map((d) => ({ label: String(d.year), v: d.v })), { color: m.color, format: m.format, label: m.title })
    : lineChart(m.series, { color: m.color, format: m.format, label: m.title });
  const rows = m.series.map((d) => `<tr><td>${d.year}</td><td>${m.format(d.v)}</td></tr>`).join('');
  const btns = Object.entries(ECONOMY_METRICS).map(([k, v]) =>
    `<button class="switch-btn${k === state.economyMetric ? ' active' : ''}" data-metric="${k}">${v.title.split(' (')[0]}</button>`).join('');
  return `
  <h1>Economy</h1>
  <p class="lede">Nigeria is Africa's largest economy by population and, until the 2023–24 currency
  reforms, by nominal GDP. Switch the metric to see the same decade three ways.</p>
  <div class="switcher" role="group" aria-label="Economy metric">${btns}</div>
  <section class="panel">
    <h3>${m.title} <span class="panel-src">2015–2024</span></h3>
    ${chart}
    <p class="fine">${m.about}</p>
  </section>
  <div class="grid2">
    <section class="panel">
      <h3>Data table</h3>
      <table class="data-table"><thead><tr><th>Year</th><th>${m.title}</th></tr></thead><tbody>${rows}</tbody></table>
      <button class="btn" id="dl-economy">Download CSV</button>
    </section>
    <section class="panel">
      <h3>Reading the economy</h3>
      <ul class="bullets">
        <li><strong>Growth is steady, not fast:</strong> 2.9–3.6% a year since 2021 — below the ~5% needed to lift per-capita incomes quickly.</li>
        <li><strong>Oil is smaller than you think:</strong> crude oil is under 6% of GDP today; services and agriculture dominate output.</li>
        <li><strong>The 2024 dollar drop is a price effect:</strong> real growth was 3.4% in 2024, but the naira's float cut the dollar value of GDP by almost half.</li>
        <li><strong>Inflation is the binding problem:</strong> 33.2% average CPI inflation in 2024 — see <a href="#/prices">Prices</a>.</li>
      </ul>
    </section>
  </div>`;
}

const PEOPLE_METRICS = {
  pop: { title: 'Population (millions), 2015–2024', type: 'line' },
  top10: { title: 'Top 10 states by population (2006 census)', type: 'bar' },
  zones: { title: 'Population by geopolitical zone (2006 census)', type: 'bar' },
};

export function viewPeople(state) {
  const key = PEOPLE_METRICS[state.peopleMetric] ? state.peopleMetric : 'pop';
  let chart;
  if (key === 'pop') {
    chart = lineChart(POP_SERIES, { color: '#14532d', format: (v) => v + 'm', label: 'Population 2015 to 2024' });
  } else if (key === 'top10') {
    chart = barChart([...STATES].sort((a, b) => b.pop - a.pop).slice(0, 10)
      .map((s) => ({ label: s.name, v: Math.round(s.pop / 1e6 * 10) / 10 })),
      { color: '#0b7a4b', format: (v) => v + 'm', label: 'Ten largest states by 2006 census population' });
  } else {
    const byZone = ZONES.map((z) => ({
      label: z.replace(' ', ' '),
      v: Math.round(STATES.filter((s) => s.zone === z).reduce((s2, x) => s2 + x.pop, 0) / 1e6 * 10) / 10,
    }));
    chart = barChart(byZone, { color: '#0b7a4b', format: (v) => v + 'm', label: 'Population by geopolitical zone, 2006 census' });
  }
  const btns = Object.entries(PEOPLE_METRICS).map(([k, v]) =>
    `<button class="switch-btn${k === key ? ' active' : ''}" data-pmetric="${k}">${v.title.split(' (')[0].split(',')[0]}</button>`).join('');
  return `
  <h1>People</h1>
  <p class="lede">232.7 million people in 2024 (UN) — the world's sixth-largest population, and the
  youngest large one: the median age is about 18.</p>
  <div class="switcher" role="group" aria-label="People metric">${btns}</div>
  <section class="panel">
    <h3>${PEOPLE_METRICS[key].title} <span class="panel-src">${key === 'pop' ? 'UN WPP 2024' : 'NPC 2006 census'}</span></h3>
    ${chart}
  </section>
  <div class="cards">
    <article class="card"><div class="card-label">Life expectancy at birth</div><div class="card-value">52.7 years</div><div class="card-note">both sexes</div>${sourceTag('World Bank, WDI', 2023)}</article>
    <article class="card"><div class="card-label">Human Development Index</div><div class="card-value">0.548</div><div class="card-note">medium human development</div>${sourceTag('UNDP Human Development Report', 2023)}</article>
    <article class="card"><div class="card-label">Poverty headcount</div><div class="card-value">40.1%</div><div class="card-note">national poverty line</div>${sourceTag('National Bureau of Statistics', 2019)}</article>
    <article class="card"><div class="card-label">Unemployment rate</div><div class="card-value">4.3%</div><div class="card-note">Q2, revised methodology</div>${sourceTag('National Bureau of Statistics', 2024)}</article>
    <article class="card"><div class="card-label">Census population</div><div class="card-value">${(censusTotal() / 1e6).toFixed(1)}m</div><div class="card-note">36 states + FCT</div>${sourceTag('NPC 2006 census', 2006)}</article>
    <article class="card"><div class="card-label">Median age</div><div class="card-value">~18 years</div><div class="card-note">one of the world's youngest</div>${sourceTag('UN World Population Prospects', 2024)}</article>
  </div>
  <p class="fine">Note: the NBS unemployment rate uses a revised methodology (2023) that counts
  far fewer people as unemployed than the old one — the 4.3% figure is not comparable with
  pre-2023 headlines. The 2019 poverty figure is the latest official national estimate.</p>`;
}

export function filteredStates(state) {
  let list = [...STATES];
  const q = (state.stateQuery || '').trim().toLowerCase();
  if (q) list = list.filter((s) => s.name.toLowerCase().includes(q) || s.capital.toLowerCase().includes(q));
  if (state.stateZone && state.stateZone !== 'All zones') list = list.filter((s) => s.zone === state.stateZone);
  const sort = state.stateSort || 'pop-desc';
  if (sort === 'pop-desc') list.sort((a, b) => b.pop - a.pop);
  else if (sort === 'pop-asc') list.sort((a, b) => a.pop - b.pop);
  else if (sort === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === 'name-desc') list.sort((a, b) => b.name.localeCompare(a.name));
  return list;
}

export function viewStates(state) {
  const list = filteredStates(state);
  const sel = STATES.find((s) => s.name === state.selectedState);
  const zoneOpts = ['All zones', ...ZONES].map((z) =>
    `<option${z === (state.stateZone || 'All zones') ? ' selected' : ''}>${z}</option>`).join('');
  const rows = list.map((s) => `
    <tr data-state="${s.name}" class="${sel && sel.name === s.name ? 'selected' : ''}" tabindex="0">
      <td>${s.name}</td><td>${s.zone}</td><td>${s.capital}</td>
      <td class="num">${s.pop.toLocaleString()}</td><td class="num">${shareOfTotal(s)}</td>
    </tr>`).join('');
  const detail = sel ? `
    <aside class="panel detail" aria-live="polite">
      <h3>${sel.name}</h3>
      <dl class="facts">
        <div><dt>Capital</dt><dd>${sel.capital}</dd></div>
        <div><dt>Zone</dt><dd>${sel.zone}</dd></div>
        <div><dt>Population (2006 census)</dt><dd>${sel.pop.toLocaleString()}</dd></div>
        <div><dt>Share of Nigeria</dt><dd>${shareOfTotal(sel)}</dd></div>
        <div><dt>Rank by population</dt><dd>${[...STATES].sort((a, b) => b.pop - a.pop).findIndex((s) => s.name === sel.name) + 1} of 37</dd></div>
      </dl>
      <p class="fine">Source: National Population Commission, 2006 Population Census.</p>
      <button class="btn" id="clear-state">Clear selection</button>
    </aside>` : `
    <aside class="panel detail empty" aria-live="polite">
      <h3>State detail</h3>
      <p>Click a row in the table to see a state's capital, zone, census population and national share.</p>
    </aside>`;
  return `
  <h1>States</h1>
  <p class="lede">All 36 states and the Federal Capital Territory, from the 2006 Population Census
  (National Population Commission) — the most recent completed census. Search, filter by
  zone, sort, and click any row for detail. Total census population:
  <strong>${censusTotal().toLocaleString()}</strong>.</p>
  <div class="controls">
    <label>Search <input id="state-search" type="search" placeholder="State or capital…" value="${(state.stateQuery || '').replace(/"/g, '&quot;')}"></label>
    <label>Zone <select id="state-zone">${zoneOpts}</select></label>
    <label>Sort <select id="state-sort">
      <option value="pop-desc"${state.stateSort === 'pop-desc' ? ' selected' : ''}>Population: largest first</option>
      <option value="pop-asc"${state.stateSort === 'pop-asc' ? ' selected' : ''}>Population: smallest first</option>
      <option value="name-asc"${state.stateSort === 'name-asc' ? ' selected' : ''}>Name: A–Z</option>
      <option value="name-desc"${state.stateSort === 'name-desc' ? ' selected' : ''}>Name: Z–A</option>
    </select></label>
    <button class="btn" id="dl-states">Download CSV</button>
  </div>
  <p class="fine" id="state-count">${list.length} of 37 shown</p>
  <div class="states-layout">
    <div class="table-wrap">
      <table class="data-table clickable"><thead><tr><th>State</th><th>Zone</th><th>Capital</th><th class="num">Population</th><th class="num">Share</th></tr></thead><tbody>${rows}</tbody></table>
    </div>
    ${detail}
  </div>`;
}

export function viewPrices(state) {
  const from = state.cpiFrom || 2015;
  const to = state.cpiTo || 2024;
  const amount = state.cpiAmount || 10000;
  const idxFrom = CPI_INDEX.find((d) => d.year === from).index;
  const idxTo = CPI_INDEX.find((d) => d.year === to).index;
  const result = Math.round(amount * (idxTo / idxFrom));
  const yearOpts = (sel) => CPI_INDEX.map((d) =>
    `<option value="${d.year}"${d.year === sel ? ' selected' : ''}>${d.year}</option>`).join('');
  const basketRows = BASKET.map((b, i) => {
    const spend = state.basketSpend ? state.basketSpend[i] : Math.round((state.basketTotal || 100000) * b.weight / 100);
    return `<tr><td>${b.item}</td><td class="num">${b.weight}%</td>
      <td class="num"><input class="basket-input" data-i="${i}" type="number" min="0" step="100" value="${spend}" aria-label="Monthly spend on ${b.item}"></td></tr>`;
  }).join('');
  const basketTotal = BASKET.reduce((s, b, i) => s + (state.basketSpend ? state.basketSpend[i] : Math.round((state.basketTotal || 100000) * b.weight / 100)), 0);
  return `
  <h1>Prices</h1>
  <p class="lede">Inflation is the number most Nigerians feel every day. Average CPI inflation hit
  33.2% in 2024 — the highest in nearly three decades.</p>
  <section class="panel">
    <h3>CPI inflation, annual average (%) <span class="panel-src">NBS · 2015–2024</span></h3>
    ${barChart(CPI_SERIES.map((d) => ({ label: String(d.year), v: d.v })), { color: '#b3402e', format: (v) => v + '%', label: 'CPI inflation 2015 to 2024' })}
    <p class="fine">Food inflation ran even hotter than headline CPI through 2023–24. Source: National Bureau of Statistics.</p>
  </section>
  <div class="grid2">
    <section class="panel">
      <h3>What money used to buy — CPI calculator</h3>
      <p class="fine">Uses the CPI index chained from NBS annual-average inflation (2015 = 100).</p>
      <div class="calc">
        <label>₦ <input id="cpi-amount" type="number" min="0" step="100" value="${amount}"></label>
        <label>in <select id="cpi-from">${yearOpts(from)}</select></label>
        <label>buys what ₦ costs in <select id="cpi-to">${yearOpts(to)}</select></label>
      </div>
      <p class="calc-result" id="cpi-result">₦${amount.toLocaleString()} in ${from} ≈ <strong>₦${result.toLocaleString()}</strong> in ${to}</p>
      <p class="fine">CPI index: ${from} = ${idxFrom}, ${to} = ${idxTo}. Prices rose
      ${((idxTo / idxFrom - 1) * 100).toFixed(0)}% between the two years.</p>
    </section>
    <section class="panel">
      <h3>Your monthly basket (NBS CPI weights)</h3>
      <p class="fine">Edit what you spend per category — the total updates live. Weights are the NBS CPI basket shares.</p>
      <table class="data-table"><thead><tr><th>Category</th><th class="num">Weight</th><th class="num">Your ₦ / month</th></tr></thead><tbody>${basketRows}</tbody>
      <tfoot><tr><th>Total</th><th></th><th class="num" id="basket-total">₦${basketTotal.toLocaleString()}</th></tr></tfoot></table>
    </section>
  </div>`;
}

export function viewSources() {
  const rows = SOURCES.map((s) => `<tr><td><strong>${s.org}</strong><br><span class="fine">${s.note}</span></td><td>${s.what}</td><td><a href="${s.url}" target="_blank" rel="noopener">${s.url.replace('https://', '')}</a></td></tr>`).join('');
  return `
  <h1>Sources &amp; method</h1>
  <p class="lede">Every figure on this site names its source and year where it appears. This page
  collects them in one place.</p>
  <section class="panel">
    <table class="data-table"><thead><tr><th>Source</th><th>Figures used</th><th>Link</th></tr></thead><tbody>${rows}</tbody></table>
  </section>
  <section class="panel">
    <h3>Method notes</h3>
    <ul class="bullets">
      <li><strong>Nominal GDP and GDP per capita</strong> are in current US dollars (World Bank WDI). The 2024 drop is driven by the naira float, not by a fall in real output — real GDP grew 3.4% in 2024.</li>
      <li><strong>CPI index</strong> (2015 = 100) is chained from NBS annual-average inflation rates, so the calculator shows cumulative price change, not a single year's rate.</li>
      <li><strong>State populations</strong> are the 2006 census counts (NPC). They are the latest completed census; later figures are estimates, not counts.</li>
      <li><strong>Unemployment (4.3%, Q2 2024)</strong> uses the NBS revised methodology and is not comparable with pre-2023 rates.</li>
      <li><strong>Poverty (40.1%)</strong> is the 2019 national estimate — the latest official one.</li>
      <li>Figures are reproduced as published; rounding may make shares sum to 99.9–100.1%.</li>
    </ul>
  </section>
  <p class="fine">Nigeria in Numbers is an independent, unofficial explorer built for the make.fun
  “best national statistics site” bounty. It is not affiliated with the NBS, the World Bank, the UN or the NPC.</p>`;
}
