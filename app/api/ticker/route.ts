import yahooFinance from "yahoo-finance2";
import { NextResponse } from "next/server";

type FundamentalYear = {
  year: string;
  revenue: number;
  ebit: number;
  net_income: number;
  operating_cash_flow: number;
  capex: number;
  total_debt: number;
  cash: number;
};

type ApiPayload = {
  success: true;
  symbol: string;
  name: string;
  currentPrice: number;
  beta: number;
  sharesOutstanding: number;
  financials: FundamentalYear[];
  source: "yahoo-finance2" | "calibrated-fallback" | "synthetic-fallback";
};

type Calibration = {
  name: string;
  currentPrice: number;
  beta: number;
  sharesOutstanding: number;
  revenue: number;
  ebitMargin: number;
  netMargin: number;
  ocfMargin: number;
  capexMargin: number;
  debtMargin: number;
  cashMargin: number;
  growth: number;
};

type LooseRecord = Record<string, unknown>;

const modules = [
  "price",
  "summaryDetail",
  "defaultKeyStatistics",
  "financialData",
  "incomeStatementHistory",
  "balanceSheetHistory",
  "cashflowStatementHistory",
] as const;

const calibrations: Record<string, Calibration> = {
  TSLA: { name: "Tesla, Inc.", currentPrice: 220.5, beta: 2.1, sharesOutstanding: 3_180_000_000, revenue: 96_773_000_000, ebitMargin: 0.09, netMargin: 0.08, ocfMargin: 0.14, capexMargin: 0.09, debtMargin: 0.07, cashMargin: 0.3, growth: 0.24 },
  GOOGL: { name: "Alphabet Inc.", currentPrice: 175, beta: 1.05, sharesOutstanding: 12_300_000_000, revenue: 307_394_000_000, ebitMargin: 0.28, netMargin: 0.24, ocfMargin: 0.33, capexMargin: 0.1, debtMargin: 0.09, cashMargin: 0.36, growth: 0.12 },
  AMZN: { name: "Amazon.com, Inc.", currentPrice: 185, beta: 1.16, sharesOutstanding: 10_500_000_000, revenue: 574_785_000_000, ebitMargin: 0.07, netMargin: 0.05, ocfMargin: 0.15, capexMargin: 0.11, debtMargin: 0.28, cashMargin: 0.15, growth: 0.13 },
  META: { name: "Meta Platforms, Inc.", currentPrice: 510, beta: 1.21, sharesOutstanding: 2_550_000_000, revenue: 134_902_000_000, ebitMargin: 0.35, netMargin: 0.29, ocfMargin: 0.47, capexMargin: 0.21, debtMargin: 0.28, cashMargin: 0.49, growth: 0.14 },
  AMD: { name: "Advanced Micro Devices, Inc.", currentPrice: 155, beta: 1.7, sharesOutstanding: 1_620_000_000, revenue: 22_680_000_000, ebitMargin: 0.08, netMargin: 0.04, ocfMargin: 0.07, capexMargin: 0.03, debtMargin: 0.13, cashMargin: 0.25, growth: 0.18 },
  PLTR: { name: "Palantir Technologies Inc.", currentPrice: 28, beta: 1.9, sharesOutstanding: 2_250_000_000, revenue: 2_225_000_000, ebitMargin: 0.09, netMargin: 0.09, ocfMargin: 0.32, capexMargin: 0.01, debtMargin: 0.01, cashMargin: 1.65, growth: 0.22 },
  NFLX: { name: "Netflix, Inc.", currentPrice: 650, beta: 1.25, sharesOutstanding: 430_000_000, revenue: 33_723_000_000, ebitMargin: 0.21, netMargin: 0.16, ocfMargin: 0.21, capexMargin: 0.01, debtMargin: 0.45, cashMargin: 0.21, growth: 0.08 },
  CRM: { name: "Salesforce, Inc.", currentPrice: 260, beta: 1.22, sharesOutstanding: 970_000_000, revenue: 34_857_000_000, ebitMargin: 0.15, netMargin: 0.12, ocfMargin: 0.29, capexMargin: 0.02, debtMargin: 0.28, cashMargin: 0.36, growth: 0.11 },
  UBER: { name: "Uber Technologies, Inc.", currentPrice: 72, beta: 1.35, sharesOutstanding: 2_100_000_000, revenue: 37_281_000_000, ebitMargin: 0.04, netMargin: 0.05, ocfMargin: 0.09, capexMargin: 0.02, debtMargin: 0.26, cashMargin: 0.18, growth: 0.16 },
  DIS: { name: "The Walt Disney Company", currentPrice: 105, beta: 1.3, sharesOutstanding: 1_830_000_000, revenue: 88_898_000_000, ebitMargin: 0.1, netMargin: 0.03, ocfMargin: 0.11, capexMargin: 0.06, debtMargin: 0.52, cashMargin: 0.16, growth: 0.05 },
  JPM: { name: "JPMorgan Chase & Co.", currentPrice: 200, beta: 1.1, sharesOutstanding: 2_870_000_000, revenue: 158_104_000_000, ebitMargin: 0.38, netMargin: 0.31, ocfMargin: 0.24, capexMargin: 0.01, debtMargin: 0.5, cashMargin: 0.45, growth: 0.05 },
  WMT: { name: "Walmart Inc.", currentPrice: 68, beta: 0.52, sharesOutstanding: 8_050_000_000, revenue: 648_125_000_000, ebitMargin: 0.04, netMargin: 0.02, ocfMargin: 0.05, capexMargin: 0.03, debtMargin: 0.1, cashMargin: 0.02, growth: 0.04 },
  "BRK-B": { name: "Berkshire Hathaway Inc.", currentPrice: 410, beta: 0.85, sharesOutstanding: 2_170_000_000, revenue: 364_482_000_000, ebitMargin: 0.24, netMargin: 0.18, ocfMargin: 0.13, capexMargin: 0.05, debtMargin: 0.32, cashMargin: 0.46, growth: 0.06 },
};

const read = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value && typeof value === "object" && "raw" in value) {
    const rawValue = (value as { raw?: unknown }).raw;
    if (typeof rawValue === "number" && Number.isFinite(rawValue)) return rawValue;
  }
  return fallback;
};

const pick = (record: unknown, key: string, fallback = 0) => read((record as LooseRecord | undefined)?.[key], fallback);
const statementYear = (record: unknown, fallback: string) => {
  const endDate = (record as LooseRecord | undefined)?.endDate;
  if (endDate && typeof endDate === "object" && "fmt" in endDate && typeof (endDate as { fmt?: unknown }).fmt === "string") {
    return ((endDate as { fmt: string }).fmt).slice(0, 4);
  }
  return fallback;
};

const buildSeries = (calibration: Calibration, source: ApiPayload["source"]): ApiPayload => {
  const currentYear = new Date().getUTCFullYear();
  const financials = Array.from({ length: 4 }, (_, index) => {
    const yearsBack = 3 - index;
    const revenue = calibration.revenue / Math.pow(1 + calibration.growth, yearsBack);
    return {
      year: String(currentYear - yearsBack - 1),
      revenue,
      ebit: revenue * calibration.ebitMargin,
      net_income: revenue * calibration.netMargin,
      operating_cash_flow: revenue * calibration.ocfMargin,
      capex: revenue * calibration.capexMargin,
      total_debt: revenue * calibration.debtMargin,
      cash: revenue * calibration.cashMargin,
    };
  });

  return {
    success: true,
    symbol: calibration.name === "Fallback Industries" ? "CUSTOM" : "",
    name: calibration.name,
    currentPrice: calibration.currentPrice,
    beta: calibration.beta,
    sharesOutstanding: calibration.sharesOutstanding,
    financials,
    source,
  };
};

const fallbackFor = (symbol: string, quote?: Partial<Calibration>): ApiPayload => {
  const calibration = calibrations[symbol] ?? {
    name: quote?.name ?? `${symbol} Fundamental Model`,
    currentPrice: quote?.currentPrice ?? 100,
    beta: quote?.beta ?? 1.05,
    sharesOutstanding: quote?.sharesOutstanding ?? 1_000_000_000,
    revenue: quote?.revenue ?? 12_000_000_000,
    ebitMargin: quote?.ebitMargin ?? 0.14,
    netMargin: quote?.netMargin ?? 0.09,
    ocfMargin: quote?.ocfMargin ?? 0.16,
    capexMargin: quote?.capexMargin ?? 0.05,
    debtMargin: quote?.debtMargin ?? 0.25,
    cashMargin: quote?.cashMargin ?? 0.18,
    growth: quote?.growth ?? 0.08,
  };
  const payload = buildSeries(calibration, calibrations[symbol] ? "calibrated-fallback" : "synthetic-fallback");
  return { ...payload, symbol };
};

export async function GET(request: Request) {
  const symbol = new URL(request.url).searchParams.get("symbol")?.trim().toUpperCase();

  if (!symbol || !/^[A-Z0-9.\-]{1,12}$/.test(symbol)) {
    return NextResponse.json({ success: false, error: "Enter a valid ticker symbol." }, { status: 400 });
  }

  try {
    const summary = (await yahooFinance.quoteSummary(symbol, { modules: [...modules] })) as unknown as LooseRecord;
    const price = summary.price as LooseRecord | undefined;
    const financialData = summary.financialData as LooseRecord | undefined;
    const keyStats = summary.defaultKeyStatistics as LooseRecord | undefined;
    const summaryDetail = summary.summaryDetail as LooseRecord | undefined;
    const income = ((summary.incomeStatementHistory as LooseRecord | undefined)?.incomeStatementHistory as unknown[] | undefined) ?? [];
    const balance = ((summary.balanceSheetHistory as LooseRecord | undefined)?.balanceSheetStatements as unknown[] | undefined) ?? [];
    const cashflow = ((summary.cashflowStatementHistory as LooseRecord | undefined)?.cashflowStatements as unknown[] | undefined) ?? [];

    const name = String(price?.longName ?? price?.shortName ?? symbol);
    const currentPrice = read(financialData?.currentPrice, read(price?.regularMarketPrice, calibrations[symbol]?.currentPrice ?? 100));
    const beta = read(summaryDetail?.beta, read(keyStats?.beta, calibrations[symbol]?.beta ?? 1.05));
    const sharesOutstanding = read(keyStats?.sharesOutstanding, read(price?.sharesOutstanding, calibrations[symbol]?.sharesOutstanding ?? 1_000_000_000));
    const latestRevenue = read(financialData?.totalRevenue, pick(income[0], "totalRevenue", calibrations[symbol]?.revenue ?? 12_000_000_000));

    const quoteFallback: Partial<Calibration> = {
      name,
      currentPrice,
      beta,
      sharesOutstanding,
      revenue: latestRevenue,
      growth: Math.max(-0.1, Math.min(0.35, read(financialData?.revenueGrowth, calibrations[symbol]?.growth ?? 0.08))),
    };

    const financials: FundamentalYear[] = Array.from({ length: 4 }, (_, index) => {
      const reverseIndex = 3 - index;
      const revenue = pick(income[reverseIndex], "totalRevenue", 0);
      const fallbackRevenue = latestRevenue / Math.pow(1 + (quoteFallback.growth ?? 0.08), reverseIndex);
      const normalizedRevenue = revenue || fallbackRevenue;
      const ebit = pick(income[reverseIndex], "ebit", pick(income[reverseIndex], "operatingIncome", normalizedRevenue * (calibrations[symbol]?.ebitMargin ?? 0.14)));
      return {
        year: statementYear(income[reverseIndex], String(new Date().getUTCFullYear() - reverseIndex - 1)),
        revenue: normalizedRevenue,
        ebit,
        net_income: pick(income[reverseIndex], "netIncome", normalizedRevenue * (calibrations[symbol]?.netMargin ?? 0.09)),
        operating_cash_flow: pick(cashflow[reverseIndex], "totalCashFromOperatingActivities", normalizedRevenue * (calibrations[symbol]?.ocfMargin ?? 0.16)),
        capex: Math.abs(pick(cashflow[reverseIndex], "capitalExpenditures", normalizedRevenue * (calibrations[symbol]?.capexMargin ?? 0.05))),
        total_debt: pick(balance[reverseIndex], "shortLongTermDebt", 0) + pick(balance[reverseIndex], "longTermDebt", normalizedRevenue * (calibrations[symbol]?.debtMargin ?? 0.25)),
        cash: pick(balance[reverseIndex], "cash", pick(balance[reverseIndex], "cashAndCashEquivalents", normalizedRevenue * (calibrations[symbol]?.cashMargin ?? 0.18))),
      };
    }).filter((row) => row.revenue > 0 && row.ebit !== 0);

    if (financials.length < 4) {
      return NextResponse.json(fallbackFor(symbol, quoteFallback));
    }

    return NextResponse.json({ success: true, symbol, name, currentPrice, beta, sharesOutstanding, financials: financials.sort((a, b) => Number(a.year) - Number(b.year)), source: "yahoo-finance2" satisfies ApiPayload["source"] });
  } catch {
    return NextResponse.json(fallbackFor(symbol));
  }
}
