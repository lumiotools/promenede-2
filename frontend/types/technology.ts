export interface Technology {
  technology: string | null;
  first_verified_at: string | null;
  last_verified_at: string | null;
}

export interface KeyTechnology {
  technologies_used: Technology[] | null;
  num_technologies: number | null;
}
