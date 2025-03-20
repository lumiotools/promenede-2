export interface Acquisition {
  acquireeName: string;
  announcedDate: string;
  price: number;
  currency: string;
  logo?: string;
  description?: string;
  dealType?: string;
}

export interface AcquiredBy {
  acquirerName: string;
  announcedDate: string;
  price: number;
  currency: string;
  logo?: string;
  description?: string;
  dealType?: string;
}

export interface MAActivity {
  acquisitions: Acquisition[];
  acquiredBy?: AcquiredBy;
}
