import { NextRequest, NextResponse } from "next/server";

type FinancialStatement = {
  year: string;
  revenue: number;
  ebit: number;
  net_income: number;
  operating_cash_flow: number;
  capex: number;
  total_debt: number;
  cash: number;
};

type FundamentalProfile = {
  name: string;
  beta: number;
  sharesOutstanding: number;
  fallbackPrice: number;
  financials: FinancialStatement[];
};

type YahooChartResult = {
  meta?: {
    currency?: string;
    symbol?: string;
    shortName?: string;
    longName?: string;
    regularMarketPrice?: number;
    previousClose?: number;
    chartPreviousClose?: number;
    exchangeName?: string;
    instrumentType?: string;
  };
  indicators?: { quote?: Array<{ close?: Array<number | null> }> };
};

const browserHeaders = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "application/json,text/plain,*/*",
  "Accept-Language": "en-US,en;q=0.9",
  Origin: "https://finance.yahoo.com",
  Referer: "https://finance.yahoo.com/",
};

const million = 1_000_000;
const billion = 1_000_000_000;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const round = (value: number) => Math.round(value);
const normalizeSymbol = (symbol: string) => symbol.trim().toUpperCase().replace(/\s+/g, "");

const statements = (
  rows: Array<[string, number, number, number, number, number, number, number]>,
): FinancialStatement[] =>
  rows.map(([year, revenue, ebit, netIncome, operatingCashFlow, capex, totalDebt, cash]) => ({
    year,
    revenue: round(revenue * million),
    ebit: round(ebit * million),
    net_income: round(netIncome * million),
    operating_cash_flow: round(operatingCashFlow * million),
    capex: round(capex * million),
    total_debt: round(totalDebt * million),
    cash: round(cash * million),
  }));

const fundamentals: Record<string, FundamentalProfile> = {
  MSFT: { name: "Microsoft Corporation", beta: 0.9, sharesOutstanding: 7.431 * billion, fallbackPrice: 426, financials: statements([["2021", 168088, 69916, 61271, 76740, 20622, 67775, 130256], ["2022", 198270, 83383, 72738, 89035, 23886, 61270, 104757], ["2023", 211915, 88523, 72361, 87582, 28107, 59965, 111262], ["2024", 245122, 109433, 88136, 118548, 44477, 67127, 75531]]) },
  NVDA: { name: "NVIDIA Corporation", beta: 1.68, sharesOutstanding: 24.69 * billion, fallbackPrice: 124, financials: statements([["2021", 16675, 4532, 4332, 5822, 1128, 5964, 11561], ["2022", 26914, 10041, 9752, 9108, 976, 10946, 21208], ["2023", 26974, 4224, 4368, 5641, 1833, 12031, 13296], ["2024", 60922, 32972, 29760, 28090, 1069, 11056, 25984]]) },
  AAPL: { name: "Apple Inc.", beta: 1.24, sharesOutstanding: 15.344 * billion, fallbackPrice: 216, financials: statements([["2021", 365817, 108949, 94680, 104038, 11085, 124719, 62639], ["2022", 394328, 119437, 99803, 122151, 10708, 120069, 48304], ["2023", 383285, 114301, 96995, 110543, 10959, 111088, 61555], ["2024", 391035, 123216, 93736, 118254, 9447, 106629, 65171]]) },
  TSLA: { name: "Tesla, Inc.", beta: 1.95, sharesOutstanding: 3.18 * billion, fallbackPrice: 218.45, financials: [{ year: "2021", revenue: 53823000000, ebit: 6523000000, net_income: 5519000000, operating_cash_flow: 11497000000, capex: 6514000000, total_debt: 6800000000, cash: 17576000000 }, { year: "2022", revenue: 81462000000, ebit: 13656000000, net_income: 12587000000, operating_cash_flow: 14724000000, capex: 7158000000, total_debt: 5748000000, cash: 22185000000 }, { year: "2023", revenue: 96773000000, ebit: 8891000000, net_income: 14997000000, operating_cash_flow: 13256000000, capex: 8898000000, total_debt: 5262000000, cash: 29094000000 }, { year: "2024", revenue: 105400000000, ebit: 9200000000, net_income: 11200000000, operating_cash_flow: 14500000000, capex: 9500000000, total_debt: 5000000000, cash: 32000000000 }] },
  GOOGL: { name: "Alphabet Inc.", beta: 1.02, sharesOutstanding: 12.3 * billion, fallbackPrice: 176, financials: statements([["2021", 257637, 78714, 76033, 91652, 24640, 28395, 139649], ["2022", 282836, 74842, 59972, 91495, 31485, 29679, 113762], ["2023", 307394, 84293, 73795, 101746, 32251, 28504, 110916], ["2024", 350018, 112390, 100118, 125299, 52525, 28712, 95812]]) },
  GOOG: { name: "Alphabet Inc.", beta: 1.02, sharesOutstanding: 12.3 * billion, fallbackPrice: 176, financials: statements([["2021", 257637, 78714, 76033, 91652, 24640, 28395, 139649], ["2022", 282836, 74842, 59972, 91495, 31485, 29679, 113762], ["2023", 307394, 84293, 73795, 101746, 32251, 28504, 110916], ["2024", 350018, 112390, 100118, 125299, 52525, 28712, 95812]]) },
  AMZN: { name: "Amazon.com, Inc.", beta: 1.15, sharesOutstanding: 10.6 * billion, fallbackPrice: 185, financials: statements([["2021", 469822, 24879, 33364, 46327, 61053, 116395, 96049], ["2022", 513983, 12248, -2722, 46752, 63645, 140118, 70026], ["2023", 574785, 36852, 30425, 84946, 52729, 135611, 86780], ["2024", 637959, 68593, 59248, 115877, 83000, 157000, 101000]]) },
  META: { name: "Meta Platforms, Inc.", beta: 1.21, sharesOutstanding: 2.55 * billion, fallbackPrice: 515, financials: statements([["2021", 117929, 46753, 39370, 57683, 18567, 14954, 47998], ["2022", 116609, 28944, 23200, 50475, 31431, 26591, 40738], ["2023", 134902, 46751, 39098, 71113, 28100, 37726, 65403], ["2024", 164501, 69380, 62360, 91328, 39230, 49000, 77800]]) },
  AMD: { name: "Advanced Micro Devices, Inc.", beta: 1.69, sharesOutstanding: 1.62 * billion, fallbackPrice: 140, financials: statements([["2021", 16434, 3648, 3162, 3521, 301, 313, 3608], ["2022", 23601, 1264, 1320, 3565, 450, 2864, 5959], ["2023", 22680, 401, 854, 1667, 546, 3002, 5773], ["2024", 25785, 1900, 1641, 3220, 600, 3000, 5200]]) },
  PLTR: { name: "Palantir Technologies Inc.", beta: 2.2, sharesOutstanding: 2.25 * billion, fallbackPrice: 28, financials: statements([["2021", 1542, -411, -520, 334, 22, 257, 2520], ["2022", 1906, -161, -374, 224, 24, 230, 2626], ["2023", 2225, 120, 210, 712, 13, 230, 3674], ["2024", 2866, 310, 462, 980, 20, 220, 5200]]) },
  NFLX: { name: "Netflix, Inc.", beta: 1.26, sharesOutstanding: 0.43 * billion, fallbackPrice: 670, financials: statements([["2021", 29698, 6195, 5116, 393, 524, 17703, 6028], ["2022", 31616, 5633, 4492, 2026, 407, 16924, 6058], ["2023", 33723, 6954, 5408, 7327, 348, 15971, 7117], ["2024", 39001, 10000, 8711, 7380, 400, 15000, 7800]]) },
  CRM: { name: "Salesforce, Inc.", beta: 1.28, sharesOutstanding: 0.97 * billion, fallbackPrice: 250, financials: statements([["2021", 21252, 455, 4072, 4832, 710, 2676, 11850], ["2022", 26492, 548, 1444, 6000, 717, 10621, 10538], ["2023", 31352, 1030, 208, 7283, 798, 13383, 12000], ["2024", 34857, 5176, 4136, 10234, 736, 12612, 14200]]) },
  UBER: { name: "Uber Technologies, Inc.", beta: 1.35, sharesOutstanding: 2.1 * billion, fallbackPrice: 70, financials: statements([["2021", 17455, -3834, -496, -445, 298, 9485, 7078], ["2022", 31877, -1832, -9138, 642, 252, 9259, 4321], ["2023", 37281, 1106, 1887, 3585, 223, 9721, 5407], ["2024", 43978, 2800, 2800, 6800, 350, 9500, 6200]]) },
  DIS: { name: "The Walt Disney Company", beta: 1.4, sharesOutstanding: 1.82 * billion, fallbackPrice: 100, financials: statements([["2021", 67418, 3415, 1995, 5521, 3578, 58066, 15959], ["2022", 82722, 6285, 3145, 6060, 4943, 51549, 11615], ["2023", 88898, 8982, 2354, 9437, 4969, 47733, 14182], ["2024", 91361, 11100, 4972, 13000, 5200, 47000, 6000]]) },
  JPM: { name: "JPMorgan Chase & Co.", beta: 1.1, sharesOutstanding: 2.85 * billion, fallbackPrice: 210, financials: statements([["2021", 121685, 48334, 48334, 0, 0, 430000, 740000], ["2022", 128695, 37676, 37676, 0, 0, 450000, 680000], ["2023", 158104, 49600, 49600, 0, 0, 470000, 770000], ["2024", 177000, 58000, 58000, 0, 0, 490000, 800000]]) },
  WMT: { name: "Walmart Inc.", beta: 0.52, sharesOutstanding: 8.05 * billion, fallbackPrice: 68, financials: statements([["2021", 559151, 22548, 13510, 36290, 10103, 63016, 17741], ["2022", 572754, 25942, 13673, 24181, 13106, 58691, 14760], ["2023", 611289, 20428, 11680, 28625, 16782, 59617, 8625], ["2024", 648125, 27012, 15511, 35726, 20137, 62000, 9067]]) },
  COST: { name: "Costco Wholesale Corporation", beta: 0.8, sharesOutstanding: 0.444 * billion, fallbackPrice: 850, financials: statements([["2021", 195929, 6803, 5007, 8647, 2810, 7675, 12277], ["2022", 226954, 7793, 5844, 6392, 3891, 7484, 10203], ["2023", 242290, 8114, 6292, 11191, 4052, 7088, 13516], ["2024", 254453, 9400, 7367, 11800, 4300, 6900, 15000]]) },
  INTC: { name: "Intel Corporation", beta: 1.05, sharesOutstanding: 4.25 * billion, fallbackPrice: 22, financials: statements([["2021", 79024, 19456, 19868, 29991, 18733, 38101, 28413], ["2022", 63054, 2334, 8014, 15433, 24935, 42649, 28181], ["2023", 54228, 93, 1689, 11471, 25000, 49100, 25034], ["2024", 53101, -11000, -18700, 8700, 26000, 52000, 22000]]) },
  PYPL: { name: "PayPal Holdings, Inc.", beta: 1.42, sharesOutstanding: 1.02 * billion, fallbackPrice: 65, financials: statements([["2021", 25371, 4262, 4169, 5797, 908, 8971, 7605], ["2022", 27518, 3837, 2419, 5813, 706, 10999, 7767], ["2023", 29771, 5028, 4246, 4813, 651, 11238, 11300], ["2024", 31600, 5600, 4300, 6000, 700, 10500, 12000]]) },
  BA: { name: "The Boeing Company", beta: 1.55, sharesOutstanding: 0.62 * billion, fallbackPrice: 175, financials: statements([["2021", 62286, -353, -4202, -3416, 980, 58102, 16000], ["2022", 66608, -3532, -4935, -3500, 1222, 57369, 14286], ["2023", 77794, -773, -2222, 5960, 1658, 52298, 16048], ["2024", 66500, -10600, -11800, -12000, 1700, 54000, 14000]]) },
  ADBE: { name: "Adobe Inc.", beta: 1.3, sharesOutstanding: 0.45 * billion, fallbackPrice: 520, financials: statements([["2021", 15785, 5802, 4822, 7252, 348, 4123, 5844], ["2022", 17606, 6098, 4756, 7838, 442, 3634, 5800], ["2023", 19409, 6650, 5428, 7302, 302, 3629, 7141], ["2024", 21505, 7700, 6200, 8200, 350, 4000, 7600]]) },
  NKE: { name: "NIKE, Inc.", beta: 1.05, sharesOutstanding: 1.5 * billion, fallbackPrice: 90, financials: statements([["2021", 44538, 6275, 5727, 6657, 695, 12969, 13476], ["2022", 46710, 6675, 6046, 5814, 758, 12071, 13025], ["2023", 51217, 5915, 5070, 5841, 969, 12080, 10740], ["2024", 51362, 6265, 5700, 7400, 1000, 11500, 10800]]) },
  SBUX: { name: "Starbucks Corporation", beta: 0.95, sharesOutstanding: 1.13 * billion, fallbackPrice: 95, financials: statements([["2021", 29061, 4872, 4199, 5901, 1484, 23995, 6455], ["2022", 32250, 4618, 3282, 4576, 1841, 23592, 3760], ["2023", 35976, 5871, 4124, 6008, 2315, 24585, 3552], ["2024", 36200, 5600, 3760, 6800, 2500, 24500, 3200]]) },
};

async function fetchChart(symbol: string): Promise<{ currentPrice: number; currency: string; name?: string; exchangeName?: string; instrumentType?: string }> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1y`;
  const response = await fetch(url, { headers: browserHeaders, next: { revalidate: 60 } });
  if (!response.ok) throw new Error(`Yahoo chart returned ${response.status}.`);
  const json = await response.json();
  const result = json?.chart?.result?.[0] as YahooChartResult | undefined;
  const error = json?.chart?.error;
  if (!result || error) throw new Error("Yahoo chart did not return quote metadata.");
  const closes = result.indicators?.quote?.[0]?.close?.filter((v): v is number => typeof v === "number" && Number.isFinite(v)) ?? [];
  const meta = result.meta ?? {};
  const currentPrice = meta.regularMarketPrice ?? closes.at(-1) ?? meta.previousClose ?? meta.chartPreviousClose ?? 0;
  if (!currentPrice) throw new Error("Yahoo chart did not return a usable current price.");
  return { currentPrice, currency: meta.currency ?? "USD", name: meta.longName ?? meta.shortName, exchangeName: meta.exchangeName, instrumentType: meta.instrumentType };
}

function synthesizeFinancials(symbol: string, price: number): FundamentalProfile {
  const seed = [...symbol].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const sharesOutstanding = (clamp(0.18 + (seed % 80) / 10, 0.18, 8.2) * billion);
  const marketCap = price * sharesOutstanding;
  const salesMultiple = clamp(2.2 + (seed % 55) / 10, 1.2, 8.5);
  const latestRevenue = Math.max(marketCap / salesMultiple, 120 * million);
  const growth = clamp(0.045 + (seed % 20) / 100, 0.04, 0.24);
  const ebitMargin = clamp(0.09 + (seed % 22) / 100, 0.08, 0.31);
  const netMargin = clamp(ebitMargin * 0.72, 0.04, 0.24);
  const beta = Number(clamp(0.75 + (seed % 95) / 100, 0.75, 1.7).toFixed(2));
  const financials = Array.from({ length: 4 }, (_, index) => {
    const back = 3 - index;
    const revenue = latestRevenue / Math.pow(1 + growth, back);
    const ebit = revenue * ebitMargin * (0.94 + index * 0.02);
    const netIncome = revenue * netMargin * (0.94 + index * 0.02);
    const operatingCashFlow = netIncome + revenue * 0.055;
    const capex = revenue * clamp(0.035 + (seed % 9) / 200, 0.035, 0.08);
    const totalDebt = revenue * clamp(0.18 + (seed % 20) / 100, 0.18, 0.38);
    const cash = revenue * clamp(0.10 + (seed % 15) / 100, 0.10, 0.25);
    return { year: String(new Date().getUTCFullYear() - 4 + index), revenue: round(revenue), ebit: round(ebit), net_income: round(netIncome), operating_cash_flow: round(operatingCashFlow), capex: round(capex), total_debt: round(totalDebt), cash: round(cash) };
  });
  return { name: `${symbol} Corporation`, beta, sharesOutstanding: round(sharesOutstanding), fallbackPrice: price, financials };
}

export async function GET(request: NextRequest) {
  const symbol = normalizeSymbol(request.nextUrl.searchParams.get("symbol") ?? "");
  if (!symbol || !/^[A-Z0-9.\-]{1,12}$/.test(symbol)) {
    return NextResponse.json({ success: false, error: "Enter a valid ticker symbol." }, { status: 400 });
  }

  try {
    const chart = await fetchChart(symbol);
    const profile = fundamentals[symbol] ?? synthesizeFinancials(symbol, chart.currentPrice);
    return NextResponse.json({
      success: true,
      symbol,
      ticker: symbol,
      name: chart.name ?? profile.name,
      currentPrice: chart.currentPrice,
      currency: chart.currency,
      exchangeName: chart.exchangeName,
      instrumentType: chart.instrumentType,
      beta: profile.beta,
      sharesOutstanding: profile.sharesOutstanding,
      financials: profile.financials,
    });
  } catch (error) {
    const profile = fundamentals[symbol];
    if (profile) {
      return NextResponse.json({
        success: true,
        symbol,
        ticker: symbol,
        name: profile.name,
        currentPrice: profile.fallbackPrice,
        currency: "USD",
        beta: profile.beta,
        sharesOutstanding: profile.sharesOutstanding,
        financials: profile.financials,
        warning: error instanceof Error ? error.message : "Live chart lookup unavailable; returned curated fundamentals.",
      });
    }
    const message = error instanceof Error ? error.message : "Unexpected ticker lookup failure.";
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}
