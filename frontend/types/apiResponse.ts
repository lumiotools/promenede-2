import type { CompanyOverviewItem, CompanyProfiles, TimelineEvent, WebTrafficItem, ProductsServices} from "./company"
import type { QAItem } from "./qa"

export type ApiResponse<T> = {
  success: boolean
  company_name: string
  data?: T
}

export type CompanyData = {
  company_overview: CompanyOverviewItem,
  company_profile: CompanyProfiles,
  company_timeline: TimelineEvent,
  web_traffic: WebTrafficItem,
  products_services: ProductsServices,
  qa: QAItem[]
}

export type CompanyApiResponse = ApiResponse<CompanyData | null>

