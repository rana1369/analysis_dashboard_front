import { Component, OnInit } from '@angular/core';
import { FinancialService } from '@core/services/financial.service';
import { RentalService } from '@core/services/rental.service';
import { FinancialMetrics } from '@core/models/financial.model';
import { Rental } from '@core/models/rental.model';
import { I18nService } from '@shared/services/i18n.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <h2>{{ i18n.translate('dashboard.title') }}</h2>

      <div class="metrics-cards">
        <p-card *ngIf="metrics" class="metric-card">
          <div class="metric-content">
            <div class="metric-icon revenue">
              <i class="pi pi-dollar"></i>
            </div>
            <div class="metric-info">
              <h3>{{ i18n.translate('financial.totalRevenue') }}</h3>
              <p class="metric-value">{{ metrics.totalAnnualRentalRevenue | currency }}</p>
            </div>
          </div>
        </p-card>

        <p-card *ngIf="metrics" class="metric-card">
          <div class="metric-content">
            <div class="metric-icon brands">
              <i class="pi pi-building"></i>
            </div>
            <div class="metric-info">
              <h3>{{ i18n.translate('financial.totalBrands') }}</h3>
              <p class="metric-value">{{ metrics.totalBrands }}</p>
            </div>
          </div>
        </p-card>

        <p-card *ngIf="metrics" class="metric-card">
          <div class="metric-content">
            <div class="metric-icon contracts">
              <i class="pi pi-file"></i>
            </div>
            <div class="metric-info">
              <h3>{{ i18n.translate('financial.totalContracts') }}</h3>
              <p class="metric-value">{{ metrics.totalContracts }}</p>
            </div>
          </div>
        </p-card>

        <p-card *ngIf="metrics" class="metric-card">
          <div class="metric-content">
            <div class="metric-icon margin">
              <i class="pi pi-chart-line"></i>
            </div>
            <div class="metric-info">
              <h3>{{ i18n.translate('financial.averageMargin') }}</h3>
              <p class="metric-value">{{ metrics.averageProfitMargin | number:'1.2-2' }}%</p>
            </div>
          </div>
        </p-card>
      </div>

      <div class="charts-grid">
        <p-card class="chart-card">
          <ng-template pTemplate="header">
            <h3>Profitability Distribution</h3>
          </ng-template>
          <p-chart type="doughnut" [data]="profitabilityChartData" [options]="chartOptions"></p-chart>
        </p-card>

        <p-card class="chart-card">
          <ng-template pTemplate="header">
            <h3>Monthly Revenue Trends</h3>
          </ng-template>
          <p-chart type="line" [data]="revenueChartData" [options]="lineChartOptions"></p-chart>
        </p-card>

        <p-card class="chart-card">
          <ng-template pTemplate="header">
            <h3>Contract Expiry Timeline</h3>
          </ng-template>
          <p-chart type="bar" [data]="expiryChartData" [options]="chartOptions"></p-chart>
        </p-card>

        <p-card class="chart-card">
          <ng-template pTemplate="header">
            <h3>Rental Type Comparison</h3>
          </ng-template>
          <p-chart type="pie" [data]="rentalTypeChartData" [options]="chartOptions"></p-chart>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
    }

    [dir="rtl"] .dashboard-container {
      padding: 2rem;
    }

    [dir="ltr"] .dashboard-container {
      padding: 2rem;
    }

    .metrics-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .metric-card {
      height: 100%;
    }

    .metric-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .metric-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;
    }

    .metric-icon.revenue {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .metric-icon.brands {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .metric-icon.contracts {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .metric-icon.margin {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .metric-info h3 {
      margin: 0 0 0.5rem 0;
      color: #666;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .metric-value {
      margin: 0;
      font-size: 1.8rem;
      font-weight: bold;
      color: #333;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
    }

    .chart-card {
      height: 100%;
    }

    .chart-card h3 {
      margin: 0;
      padding: 1rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  metrics: FinancialMetrics | null = null;
  rentals: Rental[] = [];
  
  profitabilityChartData: any;
  revenueChartData: any;
  expiryChartData: any;
  rentalTypeChartData: any;

  chartOptions: any;
  lineChartOptions: any;

  constructor(
    private financialService: FinancialService,
    private rentalService: RentalService,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.initializeChartOptions();
  }

  loadData(): void {
   /*  this.financialService.getFinancialMetrics().subscribe({
      next: (metrics) => {
        this.metrics = metrics;
        this.updateProfitabilityChart(metrics);
      }
    }); */

    this.rentalService.getAllRentals().subscribe({
      next: (rentals) => {
        this.rentals = rentals;
        this.updateRevenueChart(rentals);
        this.updateExpiryChart(rentals);
       // this.updateRentalTypeChart(rentals);
      }
    });
  }

  initializeChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    };

    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  }

  updateProfitabilityChart(metrics: FinancialMetrics): void {
    const profitable = metrics.topProfitableBrands.length;
    const losing = metrics.leastProfitableBrands.filter(b => b.status === 'Losing').length;
    const breakingEven = metrics.totalContracts - profitable - losing;

    this.profitabilityChartData = {
      labels: ['Profitable', 'Losing', 'Breaking Even'],
      datasets: [{
        data: [profitable, losing, breakingEven],
        backgroundColor: ['#10b981', '#ef4444', '#f59e0b']
      }]
    };
  }

  updateRevenueChart(rentals: Rental[]): void {
    // Group by month
    const monthlyData: Record<number, number> = {};
    rentals.forEach(rental => {
     /*  const month = new Date(rental.startDate).getMonth();
      monthlyData[month] = (monthlyData[month] || 0) + rental.expectedAnnualIncome / 12; */
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenue = months.map((_, index) => monthlyData[index] || 0);

    this.revenueChartData = {
      labels: months,
      datasets: [{
        label: 'Monthly Revenue',
        data: revenue,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4
      }]
    };
  }

  updateExpiryChart(rentals: Rental[]): void {
    const currentYear = new Date().getFullYear();
    const expiryByMonth: Record<number, number> = {};

    rentals.forEach(rental => {
      /* const expiryDate = new Date(rental.endDate);
      if (expiryDate.getFullYear() === currentYear) {
        const month = expiryDate.getMonth();
        expiryByMonth[month] = (expiryByMonth[month] || 0) + 1;
      } */
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const counts = months.map((_, index) => expiryByMonth[index] || 0);

    this.expiryChartData = {
      labels: months,
      datasets: [{
        label: 'Contracts Expiring',
        data: counts,
        backgroundColor: '#f59e0b'
      }]
    };
  }

 /*  updateRentalTypeChart(rentals: Rental[]): void {
    const monthlyCount = rentals.filter(r => r.rentalType === 'MonthlyRent').length;
    const percentageCount = rentals.filter(r => r.rentalType === 'PercentageOfSales').length;

    this.rentalTypeChartData = {
      labels: ['Monthly Rent', 'Percentage of Sales'],
      datasets: [{
        data: [monthlyCount, percentageCount],
        backgroundColor: ['#667eea', '#10b981']
      }]
    };
  } */
}

