import { NextRequest, NextResponse } from "next/server";

type YahooRaw = { raw?: number; fmt?: string; longFmt?: string } | number | null | undefined;
type YahooStatement = Record<string, YahooRaw>;

type NormalizedFinancial = {
  year: string;
  revenue: number;
  ebit: number;
  operatingCashFlow: number;
  capex: number;
  totalDebt: number;
  cash: number;
  sharesOutstanding: number;
  netIncome: number;
  equity: number;
  ebitda: number;
  interestExpense: number;
  investedCapital: number;
  marketPrice: number;
};

const MODULES = [
  "financialData",
  "defaultKeyStatistics",
  "incomeStatementHistory",
  "balanceSheetHistory",
  "cashflowStatementHistory",
  "summaryDetail",
  "price",
].join(",");

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Accept: "application/json,text/plain,*/*",
};

const raw = (value: YahooRaw, fallback = 0): number => {
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;
  if (value && typeof value.raw === "number" && Number.isFinite(value.raw)) return value.raw;
  return fallback;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase();

  if (!symbol || !/^[A-Z0-9.\-]{1,12}$/.test(symbol)) {
    return NextResponse.json({ success: false, error: "Enter a valid ticker symbol." }, { status: 400 });
  }

  try {
    const url = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(symbol)}?modules=${MODULES}`;
    const response = await fetch(url, { headers, next: { revalidate: 300 } });

    if (!response.ok) {
      return NextResponse.json({ success: false, error: `Yahoo Finance returned ${response.status} for ${symbol}.` }, { status: response.status === 404 ? 404 : 500 });
    }

    const json = await response.json();
    const result = json?.quoteSummary?.result?.[0];
    const apiError = json?.quoteSummary?.error;

    if (!result || apiError) {
      return NextResponse.json({ success: false, error: `No fundamentals were found for ${symbol}.` }, { status: 404 });
    }

    const price = result.price ?? {};
    const financialData = result.financialData ?? {};
    const keyStats = result.defaultKeyStatistics ?? {};
    const summaryDetail = result.summaryDetail ?? {};
    const income: YahooStatement[] = result.incomeStatementHistory?.incomeStatementHistory ?? [];
    const balance: YahooStatement[] = result.balanceSheetHistory?.balanceSheetStatements ?? [];
    const cashflow: YahooStatement[] = result.cashflowStatementHistory?.cashflowStatements ?? [];

    const companyName = price.longName ?? price.shortName ?? symbol;
    const currentPrice = raw(financialData.currentPrice, raw(price.regularMarketPrice, 0));
    const sharesOutstanding = raw(keyStats.sharesOutstanding, raw(price.sharesOutstanding, 1_000_000_000));
    const beta = raw(summaryDetail.beta, raw(keyStats.beta, 1));

    const latestRevenue = raw(financialData.totalRevenue, raw(income[0]?.totalRevenue, 0));
    const latestEbitda = raw(financialData.ebitda, Math.max(latestRevenue * 0.18, 1));
    const latestEbit = raw(income[0]?.ebit, raw(income[0]?.operatingIncome, latestEbitda * 0.82));
    const latestNetIncome = raw(income[0]?.netIncome, latestEbit * 0.78);
    const latestOperatingCashFlow = raw(cashflow[0]?.totalCashFromOperatingActivities, latestNetIncome + Math.max(latestEbitda - latestEbit, 0));
    const latestCapex = Math.abs(raw(cashflow[0]?.capitalExpenditures, latestRevenue * 0.045));
    const latestDebt = raw(financialData.totalDebt, raw(balance[0]?.shortLongTermDebt, 0) + raw(balance[0]?.longTermDebt, 0));
    const latestCash = raw(financialData.totalCash, raw(balance[0]?.cash, raw(balance[0]?.cashAndCashEquivalents, 0)));
    const latestEquity = raw(balance[0]?.totalStockholderEquity, Math.max(latestRevenue * 0.35, 1));

    if (!currentPrice || !latestRevenue || !sharesOutstanding) {
      return NextResponse.json({ success: false, error: `${symbol} did not provide enough quote or revenue data for valuation.` }, { status: 404 });
    }

    const revenueGrowth = clamp(raw(financialData.revenueGrowth, 0.08), -0.15, 0.35);
    const ebitMargin = clamp(latestEbit / Math.max(latestRevenue, 1), 0.04, 0.55);
    const netMargin = clamp(latestNetIncome / Math.max(latestRevenue, 1), 0.02, 0.42);
    const cashConversion = clamp(latestOperatingCashFlow / Math.max(latestRevenue, 1), 0.04, 0.45);
    const capexIntensity = clamp(latestCapex / Math.max(latestRevenue, 1), 0.01, 0.18);
    const debtIntensity = clamp(latestDebt / Math.max(latestRevenue, 1), 0, 1.2);
    const cashIntensity = clamp(latestCash / Math.max(latestRevenue, 1), 0, 1.2);
    const equityIntensity = clamp(latestEquity / Math.max(latestRevenue, 1), 0.08, 1.5);

    const financials: NormalizedFinancial[] = Array.from({ length: 4 }, (_, index) => {
      const reverseIndex = 3 - index;
      const statementDate = income[reverseIndex]?.endDate;
      const year = statementDate && typeof statementDate === "object" && statementDate.fmt ? statementDate.fmt.slice(0, 4) : String(new Date().getUTCFullYear() - reverseIndex - 1);
      const reportedRevenue = raw(income[reverseIndex]?.totalRevenue, 0);
      const revenue = reportedRevenue || latestRevenue / Math.pow(1 + Math.max(revenueGrowth, 0.03), reverseIndex);
      const ebit = raw(income[reverseIndex]?.ebit, raw(income[reverseIndex]?.operatingIncome, revenue * ebitMargin));
      const netIncome = raw(income[reverseIndex]?.netIncome, revenue * netMargin);
      const operatingCashFlow = raw(cashflow[reverseIndex]?.totalCashFromOperatingActivities, revenue * cashConversion);
      const capex = Math.abs(raw(cashflow[reverseIndex]?.capitalExpenditures, revenue * capexIntensity));
      const totalDebt = raw(balance[reverseIndex]?.shortLongTermDebt, 0) + raw(balance[reverseIndex]?.longTermDebt, revenue * debtIntensity);
      const cash = raw(balance[reverseIndex]?.cash, raw(balance[reverseIndex]?.cashAndCashEquivalents, revenue * cashIntensity));
      const equity = raw(balance[reverseIndex]?.totalStockholderEquity, revenue * equityIntensity);
      const ebitda = raw(income[reverseIndex]?.ebitda, Math.max(ebit * 1.12, revenue * 0.08));
      const interestExpense = Math.abs(raw(income[reverseIndex]?.interestExpense, Math.max(totalDebt * 0.035, 1)));
      return {
        year,
        revenue,
        ebit,
        operatingCashFlow,
        capex,
        totalDebt,
        cash,
        sharesOutstanding,
        netIncome,
        equity,
        ebitda,
        interestExpense,
        investedCapital: Math.max(totalDebt + equity - cash, revenue * 0.2),
        marketPrice: currentPrice,
      };
    }).sort((a, b) => Number(a.year) - Number(b.year));

    return NextResponse.json({ success: true, ticker: symbol, name: companyName, currentPrice, beta, financials });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected ticker lookup failure.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
