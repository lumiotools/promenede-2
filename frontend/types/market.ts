export interface MarketMap {
  industry: string | null;
  segments: string[] | null;
  related_industries: string[] | null;
}

export interface MarketSizeExcerpt {
  text: string | null;
}

export interface MarketSizeItem {
  marketName: string | null;
  source: string | null;
  sourceLink?: string | null;
  keyExcerpts: MarketSizeExcerpt[] | null;
}

export interface MarketSize {
  title: string | null;
  subtitle: string | null;
  items: MarketSizeItem[] | null;
}
export interface SizeData {
  industryName: string | null;
  pastYearData: YearData | null;
  yearBeforeData: YearData | null;
  projectionFor2030: YearData | null;
}

export interface YearData {
  marketSize: string | null;
  cagr: string | null;
  explanation: string | null;
  keyIndustryTrends: string[] | null;
  keyExcerpt: string | null;
}
export interface ValueChain {
  summary: string | null;
  primaryActivities: PrimaryActivity[] | null;
  supportActivities: SupportActivity[] | null;
  keyStrengths: string[] | null;
  keyChallenges: string[] | null;
}

export interface PrimaryActivity {
  name: string | null;
  description: string | null;
}

export interface SupportActivity {
  name: string | null;
  description: string | null;
}
export interface MarketInfo {
  size: SizeData | null;
  value_chain: ValueChain | null;
  market_map: MarketMap | null;
}
