export interface RevenueRange {
    annualRevenueRangeFrom: number | null;
    annualRevenueRangeTo: number | null;
    annualRevenueRangeCurrency: string;
  }
  
  export interface ProductService {
    uuid: string;
    value: string;
  }
  
  export interface Firmographic {
    name: string;
    legalName: string;
    incorporationDate: string;
    hqAddress: string;
    hqCity: string | null;
    hqState: string | null;
    hqCountry: string;
    industry: string;
    type: string;
    revenueRange: {
      source4AnnualRevenueRange: RevenueRange | null;
      source6AnnualRevenueRange: RevenueRange;
    };
    employeesCount: number;
    productsServices: ProductService[];
    description: string;
  }
  
  export interface IncomeStatement {
    period: string;
    revenue: number;
  }
  
  export interface RevenueGrowth {
    value: number;
    previousPeriod: string;
    currentPeriod: string;
  }
  
  export interface KeyFinancials {
    incomeStatements: IncomeStatement[];
    revenueGrowth: RevenueGrowth[];
  }
  
  export interface CompanyOverview {
    businessModel: string;
    productsBrands: ProductService[];
    customers: string[];
  }
  
  export interface CompanyProfile {
    firmographic: Firmographic;
    keyFinancials: KeyFinancials;
    companyOverview: CompanyOverview;
  }
  
  export const companyProfile: CompanyProfile = {
    firmographic: {
      name: "Apple",
      legalName: "Apple Inc.",
      incorporationDate: "1976-04-01",
      hqAddress: "Cupertino, California, United States",
      hqCity: "Cupertino",
      hqState: "California",
      hqCountry: "United States",
      industry: "Computers and Electronics Manufacturing",
      type: "Public Company",
      revenueRange: {
        source4AnnualRevenueRange: {
          annualRevenueRangeFrom: 10000000000.0,
          annualRevenueRangeTo: null,
          annualRevenueRangeCurrency: "$",
        },
        source6AnnualRevenueRange: {
          annualRevenueRangeFrom: 1000000000.0,
          annualRevenueRangeTo: null,
          annualRevenueRangeCurrency: "$",
        },
      },
      employeesCount: 172119,
      productsServices: [
        { uuid: "c4d8caf3-5fe7-359b-f9f2-2d708378e4ee", value: "Artificial Intelligence (AI)" },
        { uuid: "89da20c4-f7c5-1b6c-6ec6-ca4c272df3c9", value: "Consumer Electronics" },
        { uuid: "bf395a9a-618c-0264-3a2b-b18d8dc56fff", value: "Hardware" },
        { uuid: "8814acc5-9b6a-4f53-28e3-a41c22d6477b", value: "Mobile Devices" },
        { uuid: "d9dda577-abfe-5a6b-0dc5-f5680bc376b0", value: "Operating Systems" },
        { uuid: "11d12f9b-9b5b-1a7b-6b03-86f76910b094", value: "Wearables" },
      ],
      description:
        "We’re a diverse collective of thinkers and doers, continually reimagining what’s possible to help us all do what we love in new ways.",
    },
    keyFinancials: {
      incomeStatements: [
        { period: "Q1, 2022", revenue: 123945000000.0 },
        { period: "Q2, 2022", revenue: 97278000000.0 },
        { period: "FY, 2022", revenue: 394328000000.0 },
      ],
      revenueGrowth: [
        { value: -21.52, previousPeriod: "2021-12-25", currentPeriod: "2022-03-26" },
        { value: 375.33, previousPeriod: "2022-06-25", currentPeriod: "2022-09-24" },
      ],
    },
    companyOverview: {
      businessModel: "B2C",
      productsBrands: [
        { uuid: "c4d8caf3-5fe7-359b-f9f2-2d708378e4ee", value: "Artificial Intelligence (AI)" },
        { uuid: "89da20c4-f7c5-1b6c-6ec6-ca4c272df3c9", value: "Consumer Electronics" },
        { uuid: "bf395a9a-618c-0264-3a2b-b18d8dc56fff", value: "Hardware" },
      ],
      customers: [
        "electronics",
        "computers electronics and technology > consumer electronics (in united states)",
        "apple",
        "iphone",
        "ipad",
        "mac",
      ],
    },
  };
  