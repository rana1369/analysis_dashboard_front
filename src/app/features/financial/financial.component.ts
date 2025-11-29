import { Component, OnInit } from '@angular/core';
import { FinancialService } from '@core/services/financial.service';
import { FinancialMetrics, FinancialAnalysis, ProfitabilityStatus } from '@core/models/financial.model';
import { I18nService } from '@shared/services/i18n.service';

@Component({
  selector: 'app-financial',
  template: `
    <div class="financial-container">
      <h2>{{ i18n.translate('financial.title') }}</h2>

      <div class="metrics-grid" *ngIf="metrics">
        <p-card class="metric-card">
          <ng-template pTemplate="header"></ng-template>
          <div class="metric-content">
            <h3>{{ i18n.translate('financial.totalRevenue') }}</h3>
            <p class="metric-value">{{ metrics.totalAnnualRentalRevenue | currency }}</p>
          </div>
        </p-card>

        <p-card class="metric-card">
          <ng-template pTemplate="header"></ng-template>
          <div class="metric-content">
            <h3>{{ i18n.translate('financial.totalBrands') }}</h3>
            <p class="metric-value">{{ metrics.totalBrands }}</p>
          </div>
        </p-card>

        <p-card class="metric-card">
          <ng-template pTemplate="header"></ng-template>
          <div class="metric-content">
            <h3>{{ i18n.translate('financial.totalContracts') }}</h3>
            <p class="metric-value">{{ metrics.totalContracts }}</p>
          </div>
        </p-card>

        <p-card class="metric-card">
          <ng-template pTemplate="header"></ng-template>
          <div class="metric-content">
            <h3>{{ i18n.translate('financial.averageMargin') }}</h3>
            <p class="metric-value">{{ metrics.averageProfitMargin | number:'1.2-2' }}%</p>
          </div>
        </p-card>
      </div>

      <div class="analysis-sections">
        <p-card class="analysis-card">
          <ng-template pTemplate="header">
            <h3>{{ i18n.translate('financial.topProfitable') }}</h3>
          </ng-template>
          <p-table [value]="metrics?.topProfitableBrands || []">
            <ng-template pTemplate="header">
              <tr>
                <th>Brand</th>
                <th>Revenue</th>
                <th>Cost</th>
                <th>Profit</th>
                <th>Margin</th>
                <th>Status</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-analysis>
              <tr>
                <td>{{ analysis.brandName }}</td>
                <td>{{ analysis.expectedRevenue | currency }}</td>
                <td>{{ analysis.rentCost | currency }}</td>
                <td>{{ analysis.profit | currency }}</td>
                <td>{{ analysis.profitMargin | number:'1.2-2' }}%</td>
                <td>
                  <p-tag 
                    [value]="getStatusLabel(analysis.status)"
                    [severity]="getStatusSeverity(analysis.status)"
                  ></p-tag>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </p-card>

        <p-card class="analysis-card">
          <ng-template pTemplate="header">
            <h3>{{ i18n.translate('financial.leastProfitable') }}</h3>
          </ng-template>
          <p-table [value]="metrics?.leastProfitableBrands || []">
            <ng-template pTemplate="header">
              <tr>
                <th>Brand</th>
                <th>Revenue</th>
                <th>Cost</th>
                <th>Profit</th>
                <th>Margin</th>
                <th>Status</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-analysis>
              <tr>
                <td>{{ analysis.brandName }}</td>
                <td>{{ analysis.expectedRevenue | currency }}</td>
                <td>{{ analysis.rentCost | currency }}</td>
                <td>{{ analysis.profit | currency }}</td>
                <td>{{ analysis.profitMargin | number:'1.2-2' }}%</td>
                <td>
                  <p-tag 
                    [value]="getStatusLabel(analysis.status)"
                    [severity]="getStatusSeverity(analysis.status)"
                  ></p-tag>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .financial-container {
      padding: 2rem;
    }

    [dir="rtl"] .financial-container {
      padding: 2rem;
    }

    [dir="ltr"] .financial-container {
      padding: 2rem;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .metric-card {
      text-align: center;
    }

    .metric-content h3 {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .metric-value {
      font-size: 2rem;
      font-weight: bold;
      color: #333;
      margin: 0;
    }

    .analysis-sections {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 2rem;
    }

    .analysis-card h3 {
      margin: 0;
      padding: 1rem;
    }
  `]
})
export class FinancialComponent implements OnInit {
  metrics: FinancialMetrics | null = null;
  loading = false;

  constructor(
    private financialService: FinancialService,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.loadMetrics();
  }

  loadMetrics(): void {
    this.loading = true;
   /*  this.financialService.getFinancialMetrics().subscribe({
      next: (metrics) => {
        this.metrics = metrics;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    }); */
  }

  getStatusLabel(status: ProfitabilityStatus): string {
    const labels: Record<ProfitabilityStatus, string> = {
      [ProfitabilityStatus.Profitable]: this.i18n.translate('financial.profitable'),
      [ProfitabilityStatus.Losing]: this.i18n.translate('financial.losing'),
      [ProfitabilityStatus.BreakingEven]: this.i18n.translate('financial.breakingEven')
    };
    return labels[status];
  }

  getStatusSeverity(
  status: ProfitabilityStatus
): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" {

  const severities: Record<
    ProfitabilityStatus,
    "success" | "secondary" | "info" | "warning" | "danger" | "contrast"
  > = {
    [ProfitabilityStatus.Profitable]: "success",
    [ProfitabilityStatus.Losing]: "danger",
    [ProfitabilityStatus.BreakingEven]: "warning"
  };

  return severities[status];
}

}

