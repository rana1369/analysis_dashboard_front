export enum RentalModel {
  FixedMonthly = 'FixedMonthly',
  PercentageOfSales = 'PercentageOfSales'
}

export interface Brand {
  id: string;
  name: string;
  description:string;
}

export interface BrandFormData {
  name: string;
  description:string;
 /*  branchLocation: string;
  contactPerson: string;
  contactEmail?: string;
  contactPhone?: string;
  contractDuration: number;
  rentalModel: RentalModel;
  rentalValue: number;
  notes?: string; */
}

