import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportService, ReportData, ReportFilters } from '@core/services/report.service';
import { BrandService } from '@core/services/brand.service';
import { Brand } from '@core/models/brand.model';
import { I18nService } from '@shared/services/i18n.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reports',
  template: `
    <div class="reports-container">
      <h2>{{ i18n.translate('reports.title') }}</h2>

      <p-card>
        <ng-template pTemplate="header">
          <h3>Filters</h3>
        </ng-template>
        <form [formGroup]="filterForm" class="filter-form">
          <div class="form-row">
            <div class="form-field">
              <label>Brand</label>
              <p-dropdown 
                [options]="brands" 
                optionLabel="name" 
                optionValue="id"
                formControlName="brandId"
                [showClear]="true"
                placeholder="All Brands"
              ></p-dropdown>
            </div>

            <div class="form-field">
              <label>Contract Type</label>
              <p-dropdown 
                [options]="contractTypes" 
                formControlName="contractType"
                [showClear]="true"
                placeholder="All Types"
              ></p-dropdown>
            </div>

            <div class="form-field">
              <label>Profitability Status</label>
              <p-dropdown 
                [options]="profitabilityStatuses" 
                formControlName="profitabilityStatus"
                [showClear]="true"
                placeholder="All Statuses"
              ></p-dropdown>
            </div>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label>Start Date</label>
              <p-calendar 
                formControlName="startDate"
                [showIcon]="true"
                dateFormat="yy-mm-dd"
              ></p-calendar>
            </div>

            <div class="form-field">
              <label>End Date</label>
              <p-calendar 
                formControlName="endDate"
                [showIcon]="true"
                dateFormat="yy-mm-dd"
              ></p-calendar>
            </div>
          </div>

          <div class="form-actions">
            <button 
              pButton 
              label="{{ i18n.translate('reports.generate') }}"
              icon="pi pi-search"
              (click)="generateReport()"
            ></button>
            <button 
              pButton 
              label="Clear"
              icon="pi pi-times"
              class="p-button-secondary"
              (click)="clearFilters()"
            ></button>
          </div>
        </form>
      </p-card>

      <p-card *ngIf="reportData.length > 0" class="report-results">
        <ng-template pTemplate="header">
          <div class="report-header">
            <h3>Report Results ({{ reportData.length }} records)</h3>
            <div class="export-buttons">
              <button 
                pButton 
                label="{{ i18n.translate('reports.exportPDF') }}"
                icon="pi pi-file-pdf"
                class="p-button-danger"
                (click)="exportPDF()"
              ></button>
              <button 
                pButton 
                label="{{ i18n.translate('reports.exportExcel') }}"
                icon="pi pi-file-excel"
                class="p-button-success"
                (click)="exportExcel()"
              ></button>
              <button 
                pButton 
                label="{{ i18n.translate('reports.exportCSV') }}"
                icon="pi pi-file"
                class="p-button-info"
                (click)="exportCSV()"
              ></button>
            </div>
          </div>
        </ng-template>

        <p-table [value]="reportData" [paginator]="true" [rows]="20">
          <ng-template pTemplate="header">
            <tr>
              <th>Brand Name</th>
              <th>Contract Type</th>
              <th>Rental Value</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Annual Revenue</th>
              <th>Status</th>
              <th>Profit</th>
              <th>Margin %</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-data>
            <tr>
              <td>{{ data.brandName }}</td>
              <td>{{ data.contractType }}</td>
              <td>{{ data.rentalAmount ? (data.rentalAmount | currency) : (data.percentageValue + '%') }}</td>
              <td>{{ data.startDate | date:'shortDate' }}</td>
              <td>{{ data.endDate | date:'shortDate' }}</td>
              <td>{{ data.annualRevenue | currency }}</td>
              <td>
                <p-tag 
                  [value]="data.profitLossStatus"
                  [severity]="getStatusSeverity(data.profitLossStatus)"
                ></p-tag>
              </td>
              <td>{{ data.profit | currency }}</td>
              <td>{{ data.profitMargin | number:'1.2-2' }}%</td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
  styles: [`
    .reports-container {
      padding: 2rem;
    }

    [dir="rtl"] .reports-container {
      padding: 2rem;
    }

    [dir="ltr"] .reports-container {
      padding: 2rem;
    }

    .filter-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
    }

    .form-field label {
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    [dir="rtl"] .form-actions {
      flex-direction: row-reverse;
    }

    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    [dir="rtl"] .report-header {
      flex-direction: row-reverse;
    }

    .export-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .report-results {
      margin-top: 2rem;
    }
  `]
})
export class ReportsComponent implements OnInit {
  filterForm!: FormGroup;
  brands: Brand[] = [];
  reportData: ReportData[] = [];
  contractTypes = ['MonthlyRent', 'PercentageOfSales'];
  profitabilityStatuses = ['Profitable', 'Losing', 'BreakingEven'];

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private brandService: BrandService,
    private messageService: MessageService,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      brandId: [null],
      contractType: [null],
      profitabilityStatus: [null],
      startDate: [null],
      endDate: [null]
    });

    this.loadBrands();
  }

  loadBrands(): void {
    this.brandService.getAllBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
      }
    });
  }

  generateReport(): void {
    const filters: ReportFilters = {
      brandId: this.filterForm.value.brandId,
      contractType: this.filterForm.value.contractType,
      profitabilityStatus: this.filterForm.value.profitabilityStatus,
      startDate: this.filterForm.value.startDate,
      endDate: this.filterForm.value.endDate
    };

   /*  this.reportService.generateReport(filters).subscribe({
      next: (data) => {
        this.reportData = data;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Report generated with ${data.length} records`
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to generate report'
        });
      }
    }); */
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.reportData = [];
  }

  exportPDF(): void {
    if (this.reportData.length > 0) {
      this.reportService.exportToPDF(this.reportData);
    }
  }

  exportExcel(): void {
    if (this.reportData.length > 0) {
      this.reportService.exportToExcel(this.reportData);
    }
  }

  exportCSV(): void {
    if (this.reportData.length > 0) {
      this.reportService.exportToCSV(this.reportData);
    }
  }

 getStatusSeverity(
  status: string
): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" {

  const severities: Record<string,
    "success" | "secondary" | "info" | "warning" | "danger" | "contrast"
  > = {
    "Profitable": "success",
    "Losing": "danger",
    "BreakingEven": "warning"
  };

  return severities[status] ?? "info";
}

}

