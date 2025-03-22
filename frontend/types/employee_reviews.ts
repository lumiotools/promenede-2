export interface EmployeeReviews {
  count: number | null;
  score: number | null;
  breakdown: Breakdown | null;
  distribution: Distribution | null;
  by_category: ByCategory | null;
}

export interface Breakdown {
  business_outlook: number | null;
  career_opportunities: number | null;
  ceo_approval: number | null;
  compensation_benefits: number | null;
  culture_values: number | null;
  diversity_inclusion: number | null;
  recommend: number | null;
  senior_management: number | null;
  work_life_balance: number | null;
}

export interface Distribution {
  [key: string]: number | null; // The distribution can be dynamic with numeric keys like "1", "2", etc.
}

export interface ByCategory {
  business_outlook: CategoryData | null;
  career_opportunities: CategoryData | null;
  ceo_approval: CategoryData | null;
  compensation_benefits: CategoryData | null;
  culture_values: CategoryData | null;
  diversity_inclusion: CategoryData | null;
  recommend: CategoryData | null;
  senior_management: CategoryData | null;
  work_life_balance: CategoryData | null;
}

export interface CategoryData {
  current: number | null;
  change: ChangeData | null;
  trend: TrendItem[] | null;
}

export interface ChangeData {
  monthly: number | null;
  quarterly: number | null;
  yearly: number | null;
}

export interface TrendItem {
  score: number | null;
  date: string | null;
}
