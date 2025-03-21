export interface EmployeeCount {
  employees_count: number | null;
  date: string | null;
}

export interface CountChange {
  current: number | null;
  change_monthly: number | null;
  change_monthly_percentage: number | null;
  change_quarterly: number | null;
  change_quarterly_percentage: number | null;
  change_yearly: number | null;
  change_yearly_percentage: number | null;
}

export interface DepartmentBreakdown {
  [key: string]: number | null;
}

export interface MonthlyDepartmentBreakdown {
  employees_count_breakdown_by_department: DepartmentBreakdown | null;
  date: string | null;
}

export interface CountryBreakdown {
  country: string | null;
  employee_count: number | null;
}

export interface RegionBreakdown {
  [key: string]: number | null;
}

export interface SeniorityBreakdown {
  [key: string]: number | null;
}

export interface EmployeesTrend {
  count_by_month: EmployeeCount[] | null;
  count_change: CountChange | null;
  breakdown_by_department: DepartmentBreakdown | null;
  breakdown_by_department_by_month: MonthlyDepartmentBreakdown[] | null;
  breakdown_by_country?: CountryBreakdown[] | null;
  breakdown_by_region?: RegionBreakdown | null;
  breakdown_by_seniority?: SeniorityBreakdown | null;
}

export interface DepartmentData {
  key: string | null;
  name: string | null;
  value: number | null;
  displayValue: number | null;
}
export interface KeyMember {
  member_id: number | null;
  member_full_name: string | null;
  member_position_title: string | null;
}
