import { Component, OnInit } from '@angular/core';
import { I18nService } from '@shared/services/i18n.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <h2 class="dashboard-title">{{ i18n.translate('dashboard.title') }}</h2>

      <!-- Metrics Cards -->
      <div class="metrics-cards">
        <p-card class="metric-card revenue">
          <div class="metric-content">
            <div class="metric-icon"><i class="pi pi-dollar"></i></div>
            <div class="metric-info">
              <h3>{{ i18n.translate('financial.totalRevenue') }}</h3>
              <p class="metric-value">{{ metrics.totalAnnualRentalRevenue | currency }}</p>
            </div>
          </div>
        </p-card>

        <p-card class="metric-card brands">
          <div class="metric-content">
            <div class="metric-icon"><i class="pi pi-building"></i></div>
            <div class="metric-info">
              <h3>{{ i18n.translate('financial.totalBrands') }}</h3>
              <p class="metric-value">{{ metrics.totalBrands }}</p>
            </div>
          </div>
        </p-card>

        <p-card class="metric-card contracts">
          <div class="metric-content">
            <div class="metric-icon"><i class="pi pi-file"></i></div>
            <div class="metric-info">
              <h3>{{ i18n.translate('financial.totalContracts') }}</h3>
              <p class="metric-value">{{ metrics.totalContracts }}</p>
            </div>
          </div>
        </p-card>

        <p-card class="metric-card margin">
          <div class="metric-content">
            <div class="metric-icon"><i class="pi pi-chart-line"></i></div>
            <div class="metric-info">
              <h3>{{ i18n.translate('financial.averageMargin') }}</h3>
              <p class="metric-value">{{ metrics.averageProfitMargin | number:'1.2-2' }}%</p>
            </div>
          </div>
        </p-card>
      </div>

      <!-- Charts Grid: 2 per row -->
      <div class="charts-grid">
        <p-card class="chart-card">
          <ng-template pTemplate="header"><h3>Profitability Distribution</h3></ng-template>
          <p-chart type="doughnut" [data]="profitabilityChartData" [options]="chartOptions"></p-chart>
        </p-card>

        <p-card class="chart-card">
          <ng-template pTemplate="header"><h3>Monthly Revenue Trends</h3></ng-template>
          <p-chart type="line" [data]="revenueChartData" [options]="lineChartOptions"></p-chart>
        </p-card>

        <p-card class="chart-card">
          <ng-template pTemplate="header"><h3>Contract Expiry Timeline</h3></ng-template>
          <p-chart type="bar" [data]="expiryChartData" [options]="chartOptions"></p-chart>
        </p-card>

        <p-card class="chart-card">
          <ng-template pTemplate="header"><h3>Rental Type Comparison</h3></ng-template>
          <p-chart type="pie" [data]="rentalTypeChartData" [options]="chartOptions"></p-chart>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f6fa;
      min-height: 100vh;
    }

    .dashboard-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 2rem;
      color: #333;
      text-align: center;
    }

    /* Metrics Cards */
    .metrics-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .metric-card {
      padding: 1rem;
      border-radius: 15px;
      box-shadow: 0 6px 15px rgba(0,0,0,0.08);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .metric-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.12);
    }

    .metric-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .metric-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;
    }

    .metric-card.revenue .metric-icon { background: #667eea; }
    .metric-card.brands .metric-icon { background: #f093fb; }
    .metric-card.contracts .metric-icon { background: #4facfe; }
    .metric-card.margin .metric-icon { background: #43e97b; }

    .metric-info h3 {
      margin: 0;
      color: #555;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .metric-value {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 700;
      color: #222;
    }

    /* Charts Grid */
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
    }

    .chart-card {
      border-radius: 15px;
      box-shadow: 0 6px 15px rgba(0,0,0,0.08);
      padding: 1rem;
      transition: transform 0.3s, box-shadow 0.3s;
      background-color: #fff;
    }

    .chart-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.12);
    }

    .chart-card h3 {
      margin-bottom: 1rem;
      font-size: 1.1rem;
      color: #444;
      text-align: center;
    }
  `]
})
export class DashboardComponent implements OnInit {

  metrics = {
    totalAnnualRentalRevenue: 1500000,
    totalBrands: 12,
    totalContracts: 25,
    averageProfitMargin: 18.5
  };

  profitabilityChartData = {
    labels: ['Profitable', 'Losing', 'Breaking Even'],
    datasets: [{ data: [10, 5, 10], backgroundColor: ['#10b981', '#ef4444', '#f59e0b'] }]
  };

  revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Monthly Revenue',
      data: [120000, 150000, 130000, 140000, 160000, 170000, 155000, 165000, 180000, 175000, 160000, 190000],
      borderColor: '#667eea',
      backgroundColor: 'rgba(102,126,234,0.1)',
      tension: 0.4
    }]
  };

  expiryChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{ label: 'Contracts Expiring', data: [1,2,0,3,2,4,3,1,2,3,1,2], backgroundColor: '#f59e0b' }]
  };

  rentalTypeChartData = {
    labels: ['Monthly Rent', 'Percentage of Sales'],
    datasets: [{ data: [15, 10], backgroundColor: ['#667eea', '#10b981'] }]
  };

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };

  lineChartOptions = {
    ...this.chartOptions,
    scales: { y: { beginAtZero: true } }
  };

  constructor(public i18n: I18nService) {}

  ngOnInit(): void {}
}
