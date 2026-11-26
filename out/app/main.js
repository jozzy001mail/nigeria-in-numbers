// Nigeria in Numbers — app shell: hash router, control state, events, CSV export.
// Static only: no fetch, no network requests of any kind.

import { viewOverview, viewEconomy, viewPeople, viewStates, viewPrices, viewSources, filteredStates } from './views.js';
import { GDP_SERIES, GROWTH_SERIES, GDP_CAPITA_SERIES, CPI_SERIES, STATES, CPI_INDEX, BASKET } from './data.js';

const NAV = [
  { hash: '#/overview', label: 'Overview' },
  { hash: '#/economy', label: 'Economy' },
  { hash: '#/people', label: 'People' },
  { hash: '#/states', label: 'States' },
  { hash: '#/prices', label: 'Prices' },
  { hash: '#/sources', label: 'Sources' },
];

const state = {
  economyMetric: 'gdp',
  peopleMetric: 'pop',
  stateQuery: '',
  stateZone: 'All zones',
  stateSort: 'pop-desc',
  selectedState: null,
  cpiFrom: 2015,
  cpiTo: 2024,
  cpiAmount: 10000,
  basketSpend: null,
  basketTotal: 100000,
};

const root = document.getElementById('view');

function currentRoute() {
  const h = location.hash || '#/overview';
  const name = h.replace('#/', '').split('/')[0];
  return NAV.some((n) => n.hash === '#/' + name) ? name : 'overview';
}

function render(scroll = true) {
  const route = currentRoute();
  document.querySelectorAll('nav a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === '#/' + route);
    if (a.getAttribute('href') === '#/' + route) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  let html;
  if (route === 'economy') html = viewEconomy(state);
  else if (route === 'people') html = viewPeople(state);
  else if (route === 'states') html = viewStates(state);
  else if (route === 'prices') html = viewPrices(state);
  else if (route === 'sources') html = viewSources();
  else html = viewOverview();
  root.innerHTML = html;
  if (scroll) root.scrollIntoView({ block: 'start' });
  bindRoute(route);
}

function downloadCsv(filename, rows) {
  const csv = rows.map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function bindRoute(route) {
  if (route === 'economy') {
    root.querySelectorAll('[data-metric]').forEach((b) => b.addEventListener('click', () => {
      state.economyMetric = b.dataset.metric;
      render();
    }));
    const dl = document.getElementById('dl-economy');
    if (dl) dl.addEventListener('click', () => {
      const series = state.economyMetric === 'gdp' ? GDP_SERIES.map((d) => [d.year, d.gdp])
        : state.economyMetric === 'capita' ? GDP_CAPITA_SERIES.map((d) => [d.year, d.v])
        : GROWTH_SERIES.map((d) => [d.year, d.v]);
      downloadCsv('nigeria-economy-' + state.economyMetric + '.csv', [['Year', 'Value'], ...series]);
    });
  }
  if (route === 'people') {
    root.querySelectorAll('[data-pmetric]').forEach((b) => b.addEventListener('click', () => {
      state.peopleMetric = b.dataset.pmetric;
      render();
    }));
  }
  if (route === 'states') {
    const search = document.getElementById('state-search');
    const zone = document.getElementById('state-zone');
    const sort = document.getElementById('state-sort');
    if (search) search.addEventListener('input', () => { state.stateQuery = search.value; rerenderStatesTable(); });
    if (zone) zone.addEventListener('change', () => { state.stateZone = zone.value; render(); });
    if (sort) sort.addEventListener('change', () => { state.stateSort = sort.value; render(); });
    root.querySelectorAll('tr[data-state]').forEach((tr) => {
      const pick = () => { state.selectedState = tr.dataset.state; render(); };
      tr.addEventListener('click', pick);
      tr.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
    });
    const clear = document.getElementById('clear-state');
    if (clear) clear.addEventListener('click', () => { state.selectedState = null; render(); });
    const dl = document.getElementById('dl-states');
    if (dl) dl.addEventListener('click', () => {
      downloadCsv('nigeria-states-2006-census.csv',
        [['State', 'Zone', 'Capital', 'Population_2006'],
          ...STATES.map((s) => [s.name, s.zone, s.capital, s.pop])]);
    });
  }
  if (route === 'prices') {
    const amount = document.getElementById('cpi-amount');
    const from = document.getElementById('cpi-from');
    const to = document.getElementById('cpi-to');
    const recalc = () => {
      state.cpiAmount = Math.max(0, Number(amount.value) || 0);
      state.cpiFrom = Number(from.value);
      state.cpiTo = Number(to.value);
      const idxFrom = CPI_INDEX.find((d) => d.year === state.cpiFrom).index;
      const idxTo = CPI_INDEX.find((d) => d.year === state.cpiTo).index;
      const result = Math.round(state.cpiAmount * (idxTo / idxFrom));
      const el = document.getElementById('cpi-result');
      if (el) el.innerHTML = '₦' + state.cpiAmount.toLocaleString() + ' in ' + state.cpiFrom +
        ' ≈ <strong>₦' + result.toLocaleString() + '</strong> in ' + state.cpiTo;
    };
    if (amount) amount.addEventListener('input', recalc);
    if (from) from.addEventListener('change', recalc);
    if (to) to.addEventListener('change', recalc);
    root.querySelectorAll('.basket-input').forEach((inp) => inp.addEventListener('input', () => {
      // Seed from the displayed defaults on first edit, so editing one
      // category never zeroes the others.
      if (!state.basketSpend) state.basketSpend = BASKET.map((b) => Math.round((state.basketTotal || 100000) * b.weight / 100));
      const i = Number(inp.dataset.i);
      state.basketSpend[i] = Math.max(0, Number(inp.value) || 0);
      const total = state.basketSpend.reduce((a, b) => a + b, 0);
      const el = document.getElementById('basket-total');
      if (el) el.textContent = '₦' + total.toLocaleString();
    }));
  }
}

// Live-update only the states table + count while typing, so focus is kept.
function rerenderStatesTable() {
  const list = filteredStates(state);
  const tbody = root.querySelector('tbody');
  const count = document.getElementById('state-count');
  if (!tbody) return;
  tbody.innerHTML = list.map((s) => `
    <tr data-state="${s.name}" tabindex="0">
      <td>${s.name}</td><td>${s.zone}</td><td>${s.capital}</td>
      <td class="num">${s.pop.toLocaleString()}</td>
      <td class="num">${((s.pop / STATES.reduce((a, x) => a + x.pop, 0)) * 100).toFixed(1)}%</td>
    </tr>`).join('');
  if (count) count.textContent = list.length + ' of 37 shown';
  tbody.querySelectorAll('tr[data-state]').forEach((tr) => {
    tr.addEventListener('click', () => { state.selectedState = tr.dataset.state; render(); });
  });
}

window.addEventListener('hashchange', () => render(true));
document.getElementById('year').textContent = new Date().getFullYear();
render(false);
