import evidence from "@/public/data/bangladesh-rmg/dashboard.json";

type Row = (typeof evidence.annual)[number];
const allowedCountries = new Set(evidence.countries);

export function GET(request: Request) {
  const query = new URL(request.url).searchParams;
  const chapter = query.get("chapter");
  const metric = query.get("metric");
  const endYear = Number(query.get("endYear"));
  const countries = query.getAll("country");
  if (!chapter || !["all", "61", "62"].includes(chapter)
    || !metric || !["share", "value", "index"].includes(metric)
    || ![2018, 2019].includes(endYear) || countries.length === 0
    || countries.length > 5 || new Set(countries).size !== countries.length
    || countries.some(country => !allowedCountries.has(country))) {
    return new Response("Choose a valid measure, chapter, endpoint and at least one supplier.", { status: 400 });
  }

  const value = (row: Row) => chapter === "61" ? row.knit_usd : chapter === "62" ? row.nonknit_usd : row.value_usd;
  const unit = metric === "share" ? "percent" : metric === "value" ? "current_USD_billions" : "2012_equals_100";
  const lines = ["year,country,chapter,metric,unit,value,snapshot_sha256"];
  for (let year = 2010; year <= endYear; year++) {
    const world = evidence.annual.find(row => row.year === year && row.country === "World")!;
    for (const country of countries) {
      const row = evidence.annual.find(item => item.year === year && item.country === country)!;
      const base = evidence.annual.find(item => item.year === 2012 && item.country === country)!;
      const result = metric === "share" ? 100 * value(row) / value(world)
        : metric === "value" ? value(row) / 1e9 : 100 * value(row) / value(base);
      lines.push([year, country, chapter, metric, unit, result, evidence.snapshot_sha256].join(","));
    }
  }
  return new Response(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bangladesh-rmg-${chapter}-${metric}-2010-${endYear}.csv"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
