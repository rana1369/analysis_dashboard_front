import { Component, OnInit } from '@angular/core';
import { I18nService } from '@shared/services/i18n.service';

@Component({
  selector: 'app-financial',
  template: `
    <div class="financial-container" [dir]="i18n.getCurrentLanguage() === 'ar' ? 'rtl' : 'ltr'">
      <h2 class="financial-title">{{ i18n.translate('financial.title') }}</h2>

      <!-- Metrics Cards -->
      <div class="metrics-grid">
        <p-card class="metric-card revenue">
          <div class="metric-content">
            <h3>{{ i18n.translate('financial.totalRevenue') }}</h3>
            <p class="metric-value">{{ metrics.totalAnnualRentalRevenue | currency:i18n.getCurrentLanguage() === 'ar' ? 'AED' : 'USD' }}</p>
          </div>
        </p-card>

        <p-card class="metric-card brands">
          <div class="metric-content">
            <h3>{{ i18n.translate('financial.totalBrands') }}</h3>
            <p class="metric-value">{{ metrics.totalBrands }}</p>
          </div>
        </p-card>

        <p-card class="metric-card contracts">
          <div class="metric-content">
            <h3>{{ i18n.translate('financial.totalContracts') }}</h3>
            <p class="metric-value">{{ metrics.totalContracts }}</p>
          </div>
        </p-card>

        <p-card class="metric-card margin">
          <div class="metric-content">
            <h3>{{ i18n.translate('financial.averageMargin') }}</h3>
            <p class="metric-value">{{ metrics.averageProfitMargin | number:'1.2-2' }}%</p>
          </div>
        </p-card>
      </div>

      <!-- Analysis Tables -->
      <div class="analysis-sections">
        <p-card class="analysis-card">
          <ng-template pTemplate="header"><h3>{{ i18n.translate('financial.topProfitable') }}</h3></ng-template>
          <p-table [value]="topProfitableBrands">
            <ng-template pTemplate="header">
              <tr>
                <th>{{ i18n.translate('brands.name') }}</th>
                <th>{{ i18n.translate('financial.totalRevenue') }}</th>
                <th>{{ i18n.translate('financial.rentalValue') }}</th>
                <th>{{ i18n.translate('financial.profit') }}</th>
                <th>{{ i18n.translate('financial.averageMargin') }}</th>
                <th>{{ i18n.translate('financial.status') }}</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-analysis>
              <tr>
                <td>{{ analysis.brandName }}</td>
                <td>{{ analysis.expectedRevenue | currency:i18n.getCurrentLanguage() === 'ar' ? 'AED' : 'USD' }}</td>
                <td>{{ analysis.rentCost | currency:i18n.getCurrentLanguage() === 'ar' ? 'AED' : 'USD' }}</td>
                <td>{{ analysis.profit | currency:i18n.getCurrentLanguage() === 'ar' ? 'AED' : 'USD' }}</td>
                <td>{{ analysis.profitMargin | number:'1.2-2' }}%</td>
                <td>
                  <p-tag [value]="getStatusLabel(analysis.status)" [severity]="getStatusSeverity(analysis.status)"></p-tag>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </p-card>

        <p-card class="analysis-card">
          <ng-template pTemplate="header"><h3>{{ i18n.translate('financial.leastProfitable') }}</h3></ng-template>
          <p-table [value]="leastProfitableBrands">
            <ng-template pTemplate="header">
              <tr>
                <th>{{ i18n.translate('brands.name') }}</th>
                <th>{{ i18n.translate('financial.totalRevenue') }}</th>
                <th>{{ i18n.translate('financial.rentalValue') }}</th>
                <th>{{ i18n.translate('financial.profit') }}</th>
                <th>{{ i18n.translate('financial.averageMargin') }}</th>
                <th>{{ i18n.translate('financial.status') }}</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-analysis>
              <tr>
                <td>{{ analysis.brandName }}</td>
                <td>{{ analysis.expectedRevenue | currency:i18n.getCurrentLanguage() === 'ar' ? 'AED' : 'USD' }}</td>
                <td>{{ analysis.rentCost | currency:i18n.getCurrentLanguage() === 'ar' ? 'AED' : 'USD' }}</td>
                <td>{{ analysis.profit | currency:i18n.getCurrentLanguage() === 'ar' ? 'AED' : 'USD' }}</td>
                <td>{{ analysis.profitMargin | number:'1.2-2' }}%</td>
                <td>
                  <p-tag [value]="getStatusLabel(analysis.status)" [severity]="getStatusSeverity(analysis.status)"></p-tag>
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
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f6fa;
      min-height: 100vh;
    }

    .financial-title {
      text-align: center;
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 2rem;
      color: #333;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .metric-card {
      border-radius: 15px;
      padding: 1rem;
      text-align: center;
      box-shadow: 0 6px 15px rgba(0,0,0,0.08);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .metric-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.12);
    }

    .metric-content h3 {
      color: #555;
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }

    .metric-value {
      font-size: 1.8rem;
      font-weight: 700;
      color: #222;
    }

    .metric-card.revenue { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
    .metric-card.brands { background: linear-gradient(135deg, #f093fb, #f5576c); color: white; }
    .metric-card.contracts { background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; }
    .metric-card.margin { background: linear-gradient(135deg, #43e97b, #38f9d7); color: white; }

    .analysis-sections {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .analysis-card {
      border-radius: 15px;
      box-shadow: 0 6px 15px rgba(0,0,0,0.08);
      padding: 1rem;
      background-color: #fff;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .analysis-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.12);
    }

    .analysis-card h3 {
      text-align: center;
      font-size: 1.1rem;
      margin-bottom: 1rem;
      color: #444;
    }
  `]
})
export class FinancialComponent implements OnInit {

  constructor(public i18n: I18nService) {}

  // Static data with language support
  get topProfitableBrands() {
    return [
      {
        brandName: this.i18n.getCurrentLanguage() === 'ar' ? 'العلامة أ' : 'Brand A',
        expectedRevenue: 50000,
        rentCost: 20000,
        profit: 30000,
        profitMargin: 60,
        status: 'Profitable'
      },
      {
        brandName: this.i18n.getCurrentLanguage() === 'ar' ? 'العلامة ب' : 'Brand B',
        expectedRevenue: 40000,
        rentCost: 25000,
        profit: 15000,
        profitMargin: 37.5,
        status: 'Profitable'
      }
    ];
  }

  get leastProfitableBrands() {
    return [
      {
        brandName: this.i18n.getCurrentLanguage() === 'ar' ? 'العلامة س' : 'Brand X',
        expectedRevenue: 15000,
        rentCost: 20000,
        profit: -5000,
        profitMargin: -33.3,
        status: 'Losing'
      },
      {
        brandName: this.i18n.getCurrentLanguage() === 'ar' ? 'العلامة ص' : 'Brand Y',
        expectedRevenue: 20000,
        rentCost: 25000,
        profit: -5000,
        profitMargin: -25,
        status: 'Losing'
      }
    ];
  }

  metrics = {
    totalAnnualRentalRevenue: 1200000,
    totalBrands: 15,
    totalContracts: 30,
    averageProfitMargin: 17.5
  };

  ngOnInit(): void {}

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' {
    switch(status) {
      case 'Profitable': return 'success';
      case 'Losing': return 'danger';
      case 'BreakingEven': return 'warning';
      default: return 'info';
    }
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'Profitable': this.i18n.getCurrentLanguage() === 'ar' ? 'مربح' : 'Profitable',
      'Losing': this.i18n.getCurrentLanguage() === 'ar' ? 'خاسر' : 'Losing',
      'BreakingEven': this.i18n.getCurrentLanguage() === 'ar' ? 'متعادل' : 'Breaking Even'
    };
    return labels[status] || status;
  }
}
