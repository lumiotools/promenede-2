import { CompetitiveAnalysis } from "@/types/competitor";

export const competitiveAnalysis: CompetitiveAnalysis = {
  landscape: [
    {
      name: "Microsoft",
      similarityScore: 100000,
      website: "microsoft.com",
      monthlyVisits: 1200000000,
      rankCategory: 4,
    },
    {
      name: "Dell",
      similarityScore: 99117,
      website: "dell.com",
      monthlyVisits: 41300000,
      rankCategory: 4,
    },
    {
      name: "Samsung",
      similarityScore: 98083,
      website: "samsung.com",
      monthlyVisits: 955500000,
      rankCategory: 1,
    },
  ],
  competitors: [
    {
      companyName: "Panasonic",
      similarityScore: 8584,
    },
    {
      companyName: "Huawei",
      similarityScore: 89038,
    },
    {
      companyName: "Asus",
      similarityScore: 93889,
    },
  ],
  competitorsWebsites: [
    {
      website: "bestbuy.com",
      similarityScore: 100,
      totalWebsiteVisitsMonthly: 110000000,
      category: "Computers Electronics and Technology > Consumer Electronics",
      rankCategory: 3,
    },
    {
      website: "icloud.com",
      similarityScore: 96,
      totalWebsiteVisitsMonthly: 110400000,
      category:
        "Computers Electronics and Technology > Programming and Developer Software",
      rankCategory: 10,
    },
  ],
  financialComparables: [
    {
      name: "Microsoft",
      similarityScore: 100000,
      financialData: {
        revenue: "N/A",
        profit: "N/A",
        employees: "N/A",
      },
    },
    {
      name: "Dell",
      similarityScore: 99117,
      financialData: {
        revenue: "N/A",
        profit: "N/A",
        employees: "N/A",
      },
    },
  ],
  peerDevelopments: {
    fundingVsFounded: {
      companyData: {
        name: "Apple",
        foundedYear: "1976",
        totalFunding: 6200380000,
      },
      competitorsData: [
        {
          name: "Microsoft",
          foundedYear: "N/A",
          totalFunding: "N/A",
        },
        {
          name: "Dell",
          foundedYear: "N/A",
          totalFunding: "N/A",
        },
      ],
    },
    webtrafficVsFounded: {
      companyData: {
        name: "Apple",
        foundedYear: "1976",
        monthlyTraffic: 500100000,
      },
      competitorsData: [
        {
          name: "Bestbuy",
          foundedYear: "N/A",
          monthlyTraffic: 110000000,
        },
        {
          name: "Icloud",
          foundedYear: "N/A",
          monthlyTraffic: 110400000,
        },
      ],
    },
  },
};
