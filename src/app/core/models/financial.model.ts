export enum ProfitabilityStatus {
  Profitable = 'Profitable',
  Losing = 'Losing',
  BreakingEven = 'BreakingEven'
}

export interface FinancialAnalysis {
  brandId: string;
  brandName: string;
  rentalId: string;
  rentCost: number;
  expectedRevenue: number | 0;
  profit: number;
  profitMargin: number; // percentage
  status: ProfitabilityStatus;
}

export interface FinancialMetrics {
  totalAnnualRentalRevenue: number;
  totalBrands: number;
  totalContracts: number;
  averageProfitMargin: number;
  topProfitableBrands: FinancialAnalysis[];
  leastProfitableBrands: FinancialAnalysis[];
}

