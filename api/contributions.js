import { getCalendar, yearOf } from "./_calendar.js";
export default async function handler(req, res) {
  try {
    const data = await getCalendar(yearOf(req.query.y));
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (e) { res.status(502).json({ error: String(e.message || e) }); }
}
