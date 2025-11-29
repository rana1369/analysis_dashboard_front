import { Injectable } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { BrandService } from './brand.service';
import { RentalService } from './rental.service';
import { FinancialService } from './financial.service';
import { Rental } from '../models/rental.model';
import { Brand } from '../models/brand.model';
import { FinancialAnalysis } from '../models/financial.model';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export interface ReportData {
  brandName: string;
  contractType: string;
  rentalAmount: number | null;
  percentageValue: number | null;
  startDate: Date;
  endDate: Date;
  annualRevenue: number;
  profitLossStatus: string;
  profit: number;
  profitMargin: number;
}

export interface ReportFilters {
  brandId?: string;
  contractType?: string;
  profitabilityStatus?: string;
  startDate?: Date;
  endDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(
    private brandService: BrandService,
    private rentalService: RentalService,
    private financialService: FinancialService
  ) {}

  /* generateReport(filters?: ReportFilters): Observable<ReportData[]> {
    return combineLatest([
      this.brandService.getAllBrands(),
      this.rentalService.getAllRentals(),
      this.financialService.getFinancialAnalysis()
    ]).pipe(
      map(([brands, rentals, analyses]) => {
        let filteredRentals = [...rentals];
        let filteredAnalyses = [...analyses];

        if (filters) {
          if (filters.brandId) {
            filteredRentals = filteredRentals.filter(r => r.brandId === filters.brandId);
            filteredAnalyses = filteredAnalyses.filter(a => a.brandId === filters.brandId);
          }

          if (filters.contractType) {
            filteredRentals = filteredRentals.filter(r => r.rentalType === filters.contractType);
          }

          if (filters.profitabilityStatus) {
            filteredAnalyses = filteredAnalyses.filter(a => a.status === filters.profitabilityStatus);
            filteredRentals = filteredRentals.filter(r => 
              filteredAnalyses.some(a => a.rentalId === r.id)
            );
          }

          if (filters.startDate) {
            filteredRentals = filteredRentals.filter(r => r.startDate >= filters.startDate!);
          }

          if (filters.endDate) {
            filteredRentals = filteredRentals.filter(r => r.endDate <= filters.endDate!);
          }
        }

        return filteredRentals.map(rental => {
           const brand = brands.find((b: Brand) => b.id === rental.brandId);
          const analysis = filteredAnalyses.find(a => a.rentalId === rental.id);

          return {
            brandName: brand?.name || 'Unknown',
            contractType: rental.rentalType,
            rentalAmount: rental.rentalAmount || null,
            percentageValue: rental.percentageValue || null,
            startDate: rental.startDate,
            endDate: rental.endDate,
            annualRevenue: rental.expectedAnnualIncome,
            profitLossStatus: analysis?.status || 'Unknown',
            profit: analysis?.profit || 0,
            profitMargin: analysis?.profitMargin || 0
          };
        });
      })
    );
  }
 */
  exportToPDF(data: ReportData[]): void {
    const doc = new jsPDF();
    
    doc.text('Rental Management Report', 14, 15);
    
    const tableData = data.map(item => [
      item.brandName,
      item.contractType,
      item.rentalAmount?.toString() || item.percentageValue?.toString() + '%' || 'N/A',
      item.startDate.toLocaleDateString(),
      item.endDate.toLocaleDateString(),
      item.annualRevenue.toFixed(2),
      item.profitLossStatus,
      item.profit.toFixed(2),
      item.profitMargin.toFixed(2) + '%'
    ]);

    (doc as any).autoTable({
      head: [['Brand', 'Contract Type', 'Rental Value', 'Start Date', 'End Date', 'Annual Revenue', 'Status', 'Profit', 'Margin %']],
      body: tableData,
      startY: 20
    });

    doc.save('rental-report.pdf');
  }

  exportToExcel(data: ReportData[]): void {
    const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
      'Brand Name': item.brandName,
      'Contract Type': item.contractType,
      'Rental Amount': item.rentalAmount,
      'Percentage Value': item.percentageValue,
      'Start Date': item.startDate.toLocaleDateString(),
      'End Date': item.endDate.toLocaleDateString(),
      'Annual Revenue': item.annualRevenue,
      'Profit/Loss Status': item.profitLossStatus,
      'Profit': item.profit,
      'Profit Margin %': item.profitMargin
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rentals Report');
    XLSX.writeFile(workbook, 'rental-report.xlsx');
  }

  exportToCSV(data: ReportData[]): void {
    const headers = ['Brand Name', 'Contract Type', 'Rental Amount', 'Percentage Value', 'Start Date', 'End Date', 'Annual Revenue', 'Profit/Loss Status', 'Profit', 'Profit Margin %'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        item.brandName,
        item.contractType,
        item.rentalAmount || '',
        item.percentageValue || '',
        item.startDate.toLocaleDateString(),
        item.endDate.toLocaleDateString(),
        item.annualRevenue,
        item.profitLossStatus,
        item.profit,
        item.profitMargin
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'rental-report.csv';
    link.click();
  }
}

