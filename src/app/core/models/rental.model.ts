import { RentalModel } from './brand.model';

export enum RentalType {
  MonthlyRent = 'MonthlyRent',
  PercentageOfSales = 'PercentageOfSales'
}

export interface Rental {
  id: string;

  // Backend fields
  name: string;
  unitNumber: string;
  description: string;
  imageUrl?: string | null;

  rentValue: number;
  rentType: string;             // Fixed, Monthly, etc.
  salesCollectType: string;     
  rentCollectType: string;

  activityId: string;
  activity?: {
    id: string;
    name: string;
    description: string;
    safeValue: number;
    parentActivityId?: string | null;
  };

  brandId: string;
  brand?: {
    id: string;
    name: string;
    description: string;
  };

  parentTenantId?: string | null;

  createdOn: Date;
  rentalAmount :number | 0;
  // --- Optional fields used by your table (UI only) ---
  startDate?: Date;
  endDate?: Date;
  expectedAnnualIncome?: number;
   contractDuration?: number;
  responsiblePerson?: string;
  location?: string;
    annualSales?: number;
  percentageValue?: number;
expectedRevenue?:number | 0;
}



export interface RentalFormData {
  // Basic info
  name: string;
  unitNumber: string;
  description?: string;

  // Rental financials
  rentValue?: number;          // For Fixed rent
  rentType: 1 | 2;             // 1 = Fixed, 2 = Percentage
  percentageValue?: number;    // For Percentage rent
  annualSales?: number;        // Required if rentType = Percentage

  // Associations
  brandId: string;
  activityId: string;

  // Collection types
   salesCollectType: 1 | 2 | 3 | 4;    // Matches SalesPeriodType enum
  rentCollectType: 1 | 2 | 3 | 4;  

  // Contract info
  location: string;
  contractDuration: number;
  responsiblePerson: string;

  // Optional dates
  startDate?: Date;
  endDate?: Date;
  renewalDate?: Date;
}


