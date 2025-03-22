export interface Strategy {
  mission: string | null;
  vision: string | null;
  coreValues: string[] | null;
  businessModel: string | null;
  growthStrategy: string | null;
  competitiveAdvantage: string | null;
  keyInitiatives: KeyInitiative[] | null;
}

export interface KeyInitiative {
  name: string | null;
  description: string | null;
  expectedOutcome: string | null;
}
