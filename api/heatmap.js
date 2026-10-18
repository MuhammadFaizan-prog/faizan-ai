import { getCalendar, yearOf } from "./_calendar.js";
const THEMES = {
  light: { bg: "#ffffff", fg: "#08090a", sub: "#6b6f76", border: "#e7e7e8", cells: ["#ebedf0", "#a7dcc6", "#5fbf97", "#2a9b6e", "#0a7c54"] },
  dark: { bg: "#0d1117", fg: "#f2f3f4", sub: "#8a8e96", border: "#30363d", cells: ["#161b22", "#1a4534", "#26725a", "#36a07c", "#47b990"] },
};
export default async function handler(req, res) {
  try {
    const t = THEMES[req.query.theme] || THEMES.light;
    const { year, total, contributions } = await getCalendar(yearOf(req.query.y));
    const cell = 11, gap = 3, padX = 20, top = 52;
    const offset = new Date(contributions[0].date + "T00:00:00Z").getUTCDay();
    const weeks = Math.ceil((contributions.length + offset) / 7);
    const W = padX * 2 + weeks * (cell + gap) - gap, H = top + 7 * (cell + gap) - gap + 22;
    const rects = contributions.map((d, i) => {
      const k = i + offset, x = padX + Math.floor(k / 7) * (cell + gap), y = top + (k % 7) * (cell + gap);
      return `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2" fill="${t.cells[d.level]}"><title>${d.count} on ${d.date}</title></rect>`;
    }).join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="ui-monospace,SFMono-Regular,Menlo,monospace">
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="10" fill="${t.bg}" stroke="${t.border}"/>
<text x="${padX}" y="32" font-size="13" fill="${t.sub}">Contributions</text>
<text x="${W - padX}" y="32" font-size="13" fill="${t.fg}" text-anchor="end">${total.toLocaleString("en-US")} in ${year}</text>
${rects}</svg>`;
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(svg);
  } catch (e) { res.status(502).setHeader("Content-Type", "text/plain").send(String(e.message || e)); }
}
