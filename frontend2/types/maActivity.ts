export interface Acquisition {
  acquiree_name: string | null;
  announced_date: string | null;
  price: number | null;
  currency: string | null;
}

export interface AcquiredBy {
  acquirer_name: string | null;
  announced_date: string | null;
  price: number | null;
  currency: string | null;
}
export interface MADeals {
  deal_name: string | null;
  description: string | null;
  deal_type: string | null;
  deal_date: string | null;
  deal_value: string | null;
}

export interface MAActivity {
  acquisitions: Acquisition[] | null;
  acquired_by?: AcquiredBy | null;
  ma_deals?: MADeals[] | null;
}
