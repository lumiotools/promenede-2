export interface ShareholderData {
  major_holders: MajorHolders | null;
  institutional_holders: InstitutionalHolder[] | null;
}

export interface MajorHolders {
  insidersPercentHeld: number | null;
  institutionsPercentHeld: number | null;
  institutionsFloatPercentHeld: number | null;
  institutionsCount: number | null;
}

export interface InstitutionalHolder {
  "Date Reported": string | null; // "YYYY-MM-DD" format
  Holder: string | null; // Name of the institutional investor
  pctHeld: number | null; // Percentage of shares held
  Shares: number | null; // Number of shares owned
  Value: number | null; // Total value of shares held
  pctChange: number | null; // Change in percentage of holdings
}
