export interface ValueChainActivity {
  name: string;
}

export interface ValueChainStage {
  name: string;
  activities: ValueChainActivity[];
  tools?: string[];
}

export interface ValueChain {
  industry: string;
  stages: ValueChainStage[];
}

export interface MarketMap {
  industry: string;
  segments: string[];
  relatedIndustries: string[];
}

export interface MarketSizeExcerpt {
  text: string;
}

export interface MarketSizeItem {
  marketName: string;
  source: string;
  sourceLink?: string;
  keyExcerpts: MarketSizeExcerpt[];
}

export interface MarketSize {
  title: string;
  subtitle: string;
  items: MarketSizeItem[];
}

export interface MarketInfo {
  size: MarketSize;
  valueChain: ValueChain;
  marketMap: MarketMap;
}
