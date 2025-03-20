export interface Technology {
  technology: string;
  first_verified_at: string;
  last_verified_at: string;
}

export interface KeyTechnology {
  technologies_used: Technology[];
  num_technologies: number;
}
