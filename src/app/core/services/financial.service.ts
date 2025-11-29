import { Injectable } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { BrandService } from './brand.service';
import { RentalService } from './rental.service';
import { FinancialAnalysis, FinancialMetrics, ProfitabilityStatus } from '../models/financial.model';
import { Rental } from '../models/rental.model';
import { Brand } from '../models/brand.model';

@Injectable({
  providedIn: 'root'
})
export class FinancialService {
  constructor(
    private brandService: BrandService,
    private rentalService: RentalService
  ) {}

 /*  getFinancialAnalysis(): Observable<FinancialAnalysis[]> {
    return combineLatest([
      this.brandService.getAllBrands(),
      this.rentalService.getAllRentals()
    ]).pipe(
      map(([brands, rentals]) => {
        return rentals.map(rental => {
        const brand = brands.find((b: Brand) => b.id === rental.brandId);
          const analysis = this.calculateProfitability(rental, brand);
          return analysis;
        });
      })
    );
  }

  getFinancialMetrics(): Observable<FinancialMetrics> {
    return this.getFinancialAnalysis().pipe(
      map(analyses => {
        const totalAnnualRentalRevenue = analyses.reduce((sum, a) => sum + a.expectedRevenue, 0);
        const totalBrands = new Set(analyses.map(a => a.brandId)).size;
        const totalContracts = analyses.length;
        const averageProfitMargin = analyses.length > 0
          ? analyses.reduce((sum, a) => sum + a.profitMargin, 0) / analyses.length
          : 0;

        const sortedByProfit = [...analyses].sort((a, b) => b.profit - a.profit);
        const topProfitableBrands = sortedByProfit.slice(0, 5);
        const leastProfitableBrands = sortedByProfit.slice(-5).reverse();

        return {
          totalAnnualRentalRevenue,
          totalBrands,
          totalContracts,
          averageProfitMargin,
          topProfitableBrands,
          leastProfitableBrands
        };
      })
    );
  }

  getAnalysisByBrandId(brandId: string): Observable<FinancialAnalysis[]> {
    return this.getFinancialAnalysis().pipe(
      map(analyses => analyses.filter(a => a.brandId === brandId))
    );
  }

  private calculateProfitability(rental: Rental, brand: Brand | undefined): FinancialAnalysis {
    const rentCost = rental.rentalAmount 
      ? rental.rentalAmount * 12 
      : (rental.annualSales || 0) * (rental.percentageValue || 0) / 100;
    
    const expectedRevenue = rental.expectedAnnualIncome;
    const profit = expectedRevenue - rentCost;
    const profitMargin = expectedRevenue > 0 ? (profit / expectedRevenue) * 100 : 0;

    let status: ProfitabilityStatus;
    if (profit > 0) {
      status = ProfitabilityStatus.Profitable;
    } else if (profit < 0) {
      status = ProfitabilityStatus.Losing;
    } else {
      status = ProfitabilityStatus.BreakingEven;
    }

    return {
      brandId: rental.brandId,
      brandName: brand?.name || rental.brandName || 'Unknown',
      rentalId: rental.id,
      rentCost,
      expectedRevenue,
      profit,
      profitMargin,
      status
    };
  } */
}

