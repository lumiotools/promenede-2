export interface KeyInitiative {
  name: string
  description: string
  expectedOutcome: string
}

export interface Strategy {
  mission?: string
  vision?: string
  coreValues?: string[]
  businessModel?: string
  growthStrategy?: string
  competitiveAdvantage?: string
  keyInitiatives?: KeyInitiative[]

  // Keep old structure for backward compatibility
  strategies?: Array<{
    title?: string
    description?: string
  }>
  initiatives?: Array<{
    title?: string
    description?: string
  }>
}

