export interface MarketSegment {
  segment: string;
  companies: string[];
  companyLogos: string[];
}

export interface MarketMap {
  industry?: string | null;
  segments?: MarketSegment[] | null;
  related_industries?: string[] | null;
  // New structure
  segments_new?: MarketSegment[];
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

// Updated ValueChain interfaces
export interface ValueChainStage {
  stage: string;
  activities: string[];
  companyLogos: string[];
}

export interface ValueChain {
  industryName: string | null;
  stages: ValueChainStage[] | null;
  // Keep old structure for backward compatibility
  summary?: string | null;
  primaryActivities?: PrimaryActivity[] | null;
  supportActivities?: SupportActivity[] | null;
  keyStrengths?: string[] | null;
  keyChallenges?: string[] | null;
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
