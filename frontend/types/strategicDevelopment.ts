export interface StrategicDevelopment {
  strategicFocusGoingForward: string | null;
  years: {
    [year: string]: YearData | null;
  } | null;
}

export interface YearData {
  strategicFocus: string | null;
  initiativesAndAchievements: Initiative[] | null;
}

export interface Initiative {
  initiativeName: string | null;
  description: string | null;
  referenceLink: string | null;
}
