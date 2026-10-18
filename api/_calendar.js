// Shared: fetch the owner's full contribution calendar (public + private) for a calendar year.
const Q = `query($from:DateTime!,$to:DateTime!){viewer{login contributionsCollection(from:$from,to:$to){
  restrictedContributionsCount
  contributionCalendar{totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}`;
const LV = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
export async function getCalendar(year) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN not set");
  const r = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json", "User-Agent": "faizi-dev" },
    body: JSON.stringify({ query: Q, variables: { from: `${year}-01-01T00:00:00Z`, to: `${year}-12-31T23:59:59Z` } }),
  });
  const j = await r.json();
  if (!r.ok || j.errors) throw new Error(JSON.stringify(j.errors || j));
  const cal = j.data.viewer.contributionsCollection.contributionCalendar;
  const days = cal.weeks.flatMap(w => w.contributionDays).map(d => ({ date: d.date, count: d.contributionCount, level: LV[d.contributionLevel] ?? 0 }));
  return { year, total: cal.totalContributions, contributions: days };
}
export const yearOf = q => { const y = parseInt(q, 10); const now = new Date().getUTCFullYear(); return y >= 2008 && y <= now ? y : now; };
