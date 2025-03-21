export interface ValueChainActivity {
  name: string | null;
}

export interface ValueChainStage {
  name: string | null;
  activities: ValueChainActivity[] | null;
  tools?: string[] | null;
}

export interface ValueChain {
  industry: string | null;
  stages: ValueChainStage[] | null;
}

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

export interface MarketInfo {
  size: MarketSize | null;
  valueChain: ValueChain | null;
  market_map: MarketMap | null;
}
