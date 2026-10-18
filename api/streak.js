import { getCalendar } from "./_calendar.js";
// Streak card from the full public + private contribution calendar.
const START = 2023;
const fmt = d => new Date(d + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const fmtY = d => new Date(d + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
export default async function handler(req, res) {
  try {
    const now = new Date().getUTCFullYear();
    const years = [];
    for (let y = START; y <= now; y++) years.push(y);
    const cals = await Promise.all(years.map(getCalendar));
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" });
    const days = cals.flatMap(c => c.contributions).filter(d => d.date <= today).sort((a, b) => a.date < b.date ? -1 : 1);
    const total = cals.reduce((s, c) => s + c.total, 0);
    const first = days.find(d => d.count > 0);
    // longest streak
    let best = { n: 0, s: null, e: null }, run = 0, rs = null;
    for (const d of days) {
      if (d.count > 0) { if (!run) rs = d.date; run++; if (run > best.n) best = { n: run, s: rs, e: d.date }; }
      else run = 0;
    }
    // current streak: today may still be empty
    let i = days.length - 1;
    if (i >= 0 && days[i].count === 0) i--;
    let cur = 0, ce = i >= 0 ? days[i].date : null, cs = ce;
    while (i >= 0 && days[i].count > 0) { cur++; cs = days[i].date; i--; }
    const W = 495, H = 195, c1 = 82.5, c2 = 247.5, c3 = 412.5;
    const range = (s, e) => !s ? "" : s === e ? fmt(s) : `${fmt(s)} - ${fmt(e)}`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Segoe UI,Ubuntu,sans-serif">
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="6" fill="#151515" stroke="#2A2A2A"/>
<line x1="165" y1="28" x2="165" y2="170" stroke="#2A2A2A"/><line x1="330" y1="28" x2="330" y2="170" stroke="#2A2A2A"/>
<text x="${c1}" y="79" text-anchor="middle" font-size="28" font-weight="700" fill="#DAF7DC">${total.toLocaleString("en-US")}</text>
<text x="${c1}" y="115" text-anchor="middle" font-size="14" fill="#FFFFFF">Total Contributions</text>
<text x="${c1}" y="140" text-anchor="middle" font-size="12" fill="#8B949E">${first ? esc(fmtY(first.date)) + " - Present" : ""}</text>
<circle cx="${c2}" cy="71" r="40" fill="none" stroke="#BB2ACF" stroke-width="5"/>
<path d="M ${c2 - 6} 33 q 6 -14 8 -22 q 8 10 6 20 q -4 6 -14 2 z" fill="#BB2ACF"/>
<text x="${c2}" y="81" text-anchor="middle" font-size="28" font-weight="700" fill="#DAF7DC">${cur}</text>
<text x="${c2}" y="140" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">Current Streak</text>
<text x="${c2}" y="162" text-anchor="middle" font-size="12" fill="#8B949E">${esc(range(cur ? cs : null, ce))}</text>
<text x="${c3}" y="79" text-anchor="middle" font-size="28" font-weight="700" fill="#DAF7DC">${best.n}</text>
<text x="${c3}" y="115" text-anchor="middle" font-size="14" fill="#FFFFFF">Longest Streak</text>
<text x="${c3}" y="140" text-anchor="middle" font-size="12" fill="#8B949E">${esc(range(best.s, best.e))}</text>
</svg>`;
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=86400");
    res.status(200).send(svg);
  } catch (e) { res.status(502).setHeader("Content-Type", "text/plain").send(String(e.message || e)); }
}
