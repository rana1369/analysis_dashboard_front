import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { TenantService } from './tenant.service';

export interface TenantResponse {
  data: any[];
  message: string | null;
  status: boolean;
}

export interface ReportData {
  brandName: string;
  contractType: string;
  rentalAmount: number | null;
  percentageValue?: number | null;
  startDate: Date;
  endDate: Date | null;
  annualRevenue: number;
  profitLossStatus: string;
  profit: number;
  profitMargin: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private tenantService: TenantService) {}

  // ⚡ Call Real API via TenantService
  getTenantsFromRealApi(filters: any) {
    return this.tenantService.filterTenants(filters);
  }

  // -------------------------------------------------------
  // 📌 PDF Export
  // -------------------------------------------------------
  exportToPDF(data: ReportData[]): void {
    const doc = new jsPDF();

    doc.text('Rental Report', 14, 15);

    const tableData = data.map(item => [
      item.brandName,
      item.contractType,
      item.rentalAmount ?? (item.percentageValue + '%'),
      new Date(item.startDate).toLocaleDateString(),
      item.endDate ? new Date(item.endDate).toLocaleDateString() : '—',
      item.annualRevenue.toFixed(2),
      item.profitLossStatus,
      item.profit.toFixed(2),
      item.profitMargin.toFixed(2) + '%'
    ]);

    (doc as any).autoTable({
      head: [[
        'Brand', 'Contract Type', 'Rental', 'Start', 'End',
        'Annual Revenue', 'Status', 'Profit', 'Margin'
      ]],
      body: tableData,
      startY: 20
    });

    doc.save('rental-report.pdf');
  }

  // -------------------------------------------------------
  // 📌 Export Excel
  // -------------------------------------------------------
  exportToExcel(data: ReportData[]): void {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map(item => ({
        Brand: item.brandName,
        ContractType: item.contractType,
        RentalAmount: item.rentalAmount,
        Percentage: item.percentageValue,
        StartDate: new Date(item.startDate).toLocaleDateString(),
        EndDate: item.endDate ? new Date(item.endDate).toLocaleDateString() : '',
        AnnualRevenue: item.annualRevenue,
        Status: item.profitLossStatus,
        Profit: item.profit,
        ProfitMargin: item.profitMargin
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, 'rental-report.xlsx');
  }

  // -------------------------------------------------------
  // 📌 Export CSV
  // -------------------------------------------------------
  exportToCSV(data: ReportData[]): void {
    const headers = [
      'Brand', 'ContractType', 'RentalAmount', 'Percentage',
      'StartDate', 'EndDate', 'AnnualRevenue', 'Status',
      'Profit', 'ProfitMargin'
    ];

    const csvData = [
      headers.join(','),
      ...data.map(i => [
        i.brandName,
        i.contractType,
        i.rentalAmount ?? '',
        i.percentageValue ?? '',
        new Date(i.startDate).toLocaleDateString(),
        i.endDate ? new Date(i.endDate).toLocaleDateString() : '',
        i.annualRevenue,
        i.profitLossStatus,
        i.profit,
        i.profitMargin
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'rental-report.csv';
    a.click();
  }
}
