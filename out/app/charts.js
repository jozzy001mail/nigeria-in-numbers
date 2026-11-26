// Nigeria in Numbers — hand-rolled SVG charts. No libraries, no network.
// Exports: lineChart(series, opts) and barChart(series, opts), each
// returning an SVG string. series = [{year, v}] or [{label, v}].

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function niceMax(v) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  const m = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return m * p;
}

function niceMin(v) {
  if (v >= 0) return 0;
  const p = Math.pow(10, Math.floor(Math.log10(-v)));
  const n = -v / p;
  const m = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return -m * p;
}

function gridLines(min, max, ticks = 4) {
  const out = [];
  for (let i = 0; i <= ticks; i++) out.push(min + ((max - min) * i) / ticks);
  return out;
}

export function lineChart(series, opts = {}) {
  const w = opts.width || 720;
  const h = opts.height || 300;
  const padL = 58, padR = 16, padT = 14, padB = 34;
  const color = opts.color || '#0b7a4b';
  const fmt = opts.format || ((v) => String(v));
  const vals = series.map((d) => d.v);
  const max = niceMax(Math.max(...vals));
  const min = niceMin(Math.min(...vals));
  const span = max - min || 1;
  const iw = w - padL - padR;
  const ih = h - padT - padB;
  const x = (i) => padL + (iw * i) / Math.max(series.length - 1, 1);
  const y = (v) => padT + ih - ((v - min) / span) * ih;

  const pts = series.map((d, i) => `${x(i).toFixed(1)},${y(d.v).toFixed(1)}`).join(' ');
  const area = `${padL},${y(min).toFixed(1)} ` + pts + ` ${x(series.length - 1).toFixed(1)},${y(min).toFixed(1)}`;
  const grid = gridLines(min, max).map((g) => {
    const gy = y(g);
    return `<line x1="${padL}" y1="${gy.toFixed(1)}" x2="${w - padR}" y2="${gy.toFixed(1)}" stroke="#e3e8e3" stroke-width="1"/>` +
      `<text x="${padL - 8}" y="${(gy + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#5a6b5a">${esc(fmt(g))}</text>`;
  }).join('');
  const xlabels = series.map((d, i) => {
    if (series.length > 12 && i % 2 === 1) return '';
    return `<text x="${x(i).toFixed(1)}" y="${h - 10}" text-anchor="middle" font-size="11" fill="#5a6b5a">${esc(d.year)}</text>`;
  }).join('');
  const dots = series.map((d, i) =>
    `<circle cx="${x(i).toFixed(1)}" cy="${y(d.v).toFixed(1)}" r="3.5" fill="${color}"><title>${esc(d.year)}: ${esc(fmt(d.v))}</title></circle>`
  ).join('');

  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${esc(opts.label || 'Line chart')}" xmlns="http://www.w3.org/2000/svg">
  ${grid}
  <polygon points="${area}" fill="${color}" opacity="0.10"/>
  <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
  ${dots}
  ${xlabels}
</svg>`;
}

export function barChart(items, opts = {}) {
  const w = opts.width || 720;
  const h = opts.height || 300;
  const padL = 58, padR = 16, padT = 14, padB = 34;
  const color = opts.color || '#0b7a4b';
  const fmt = opts.format || ((v) => String(v));
  const vals = items.map((d) => d.v);
  const max = niceMax(Math.max(...vals, 0));
  const min = niceMin(Math.min(...vals, 0));
  const span = max - min || 1;
  const iw = w - padL - padR;
  const ih = h - padT - padB;
  const slot = iw / items.length;
  const bw = Math.min(46, slot * 0.62);
  const y = (v) => padT + ih - ((v - min) / span) * ih;
  const zeroY = y(0);

  const grid = gridLines(min, max).map((g) => {
    const gy = y(g);
    return `<line x1="${padL}" y1="${gy.toFixed(1)}" x2="${w - padR}" y2="${gy.toFixed(1)}" stroke="#e3e8e3" stroke-width="1"/>` +
      `<text x="${padL - 8}" y="${(gy + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#5a6b5a">${esc(fmt(g))}</text>`;
  }).join('');
  const bars = items.map((d, i) => {
    const cx = padL + slot * i + slot / 2;
    const top = Math.min(y(d.v), zeroY);
    const height = Math.abs(zeroY - y(d.v));
    const fill = d.v < 0 ? '#b3402e' : color;
    return `<rect x="${(cx - bw / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(height, 1).toFixed(1)}" rx="3" fill="${fill}"><title>${esc(d.label)}: ${esc(fmt(d.v))}</title></rect>` +
      `<text x="${cx.toFixed(1)}" y="${(top - 5).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="#1d2b1d">${esc(fmt(d.v))}</text>` +
      `<text x="${cx.toFixed(1)}" y="${h - 10}" text-anchor="middle" font-size="11" fill="#5a6b5a">${esc(d.label)}</text>`;
  }).join('');

  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${esc(opts.label || 'Bar chart')}" xmlns="http://www.w3.org/2000/svg">
  ${grid}
  <line x1="${padL}" y1="${zeroY.toFixed(1)}" x2="${w - padR}" y2="${zeroY.toFixed(1)}" stroke="#9aa89a" stroke-width="1"/>
  ${bars}
</svg>`;
}
