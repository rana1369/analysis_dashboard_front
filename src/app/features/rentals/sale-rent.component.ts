
import { Component, OnInit } from '@angular/core';
import { Rental } from '@core/models/rental.model';
import { RentalService } from '@core/services/rental.service';
import { BrandService } from '@core/services/brand.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { I18nService } from '@shared/services/i18n.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RentalDialogComponent } from './rental-dialog/rental-dialog.component';
import { SharedModule } from '@app/shared/shared.module';
import { ToolbarModule } from 'primeng/toolbar';
import { ActivatedRoute } from '@angular/router';
import { SentRentDialogComponent } from './sale-rent-dialog/sale-rent-dialog.component';
@Component({
  selector: 'app-sale-rent',
  template: `
   <div class="rentals-container">
  <p-toolbar>
        <div class="p-toolbar-group-start">
          <h2>{{ i18n.translate('rentals.title') }}</h2>
        </div>
        <div class="p-toolbar-group-end">
          <button 
            pButton 
            label="{{ i18n.translate('rentals.sale') }}"
            icon="pi pi-plus"
            (click)="openAddDialog()"
            
          ></button>
        </div>
      </p-toolbar>
  <div class="tables-wrapper">

    <!-- RENT TABLE -->
    <div class="table-box">
      <h3>Rent Details</h3>
      <p-table [value]="Rent" styleClass="p-datatable-gridlines">
        <ng-template pTemplate="header">
          <tr>
            <th>Period</th>
            <th>Rent Value</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-item>
          <tr>
            <td>{{ item.period | date:'MMMM yyyy' }}</td>
            <td>{{ item.rentValue | currency }}</td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <!-- SALES TABLE -->
    <div class="table-box">
      <h3>Sales Details</h3>
      <p-table [value]="Sales" styleClass="p-datatable-gridlines">
        <ng-template pTemplate="header">
          <tr>
            <th>Label</th>
            <th>Sales Value</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-item>
          <tr>
            <td>{{ item.label }}</td>
            <td>{{ item.salesValue | currency }}</td>
          </tr>
        </ng-template>
      </p-table>
    </div>

  </div>

</div>

  `,
  styles: [`
    .rentals-container {
      padding: 2rem;
    }

    [dir="rtl"] .rentals-container {
      padding: 2rem;
    }

    [dir="ltr"] .rentals-container {
      padding: 2rem;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    [dir="rtl"] .table-header {
      flex-direction: row-reverse;
    }
  `],
})
export class SaleRentComponent implements OnInit {

  Rent: any[] = [];
  Sales: any[] = [];
  TenantId: any;
  loading = false;
  ref: DynamicDialogRef | undefined;

  constructor(
    private rentalService: RentalService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    public i18n: I18nService,
    private dialogService: DialogService,


  ) {}

  ngOnInit() {
    this.TenantId = this.activatedRoute.snapshot.paramMap.get('tenantId');
    console.log("TenantId:", this.TenantId);

    this.loadRent();
    this.loadSales();
  }

  // ---------------- RENT --------------------

  loadRent(): void {
  this.loading = true;

  this.rentalService.getAllRent(this.TenantId).subscribe({
    next: (res: any) => {

      this.Rent =
        res?.years?.[0]?.rentTypes?.[0]?.items || [];

      console.log("Rent items:", this.Rent);

      this.loading = false;
    },
    error: () => {
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load rent data'
      });
    }
  });
}


  // ---------------- SALES --------------------

  loadSales(): void {
    this.loading = true;

    this.rentalService.getAllSales(this.TenantId).subscribe({
      next: (res: any) => {

        // Extract array: years → salesTypes → items
        this.Sales = res?.years?.[0]?.salesTypes?.[0]?.items || [];
        
        console.log("Sales items:", this.Sales);

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load sales data'
        });
      }
    });
  }
 openAddDialog(): void {
    this.ref = this.dialogService.open(SentRentDialogComponent, {
      header: this.i18n.translate('rentals.sale'),
      width: '70%',
      contentStyle: { 'max-height': '90vh', 'overflow': 'auto' },
      baseZIndex: 10000,
      data: { rental: this.TenantId }
    });

    this.ref.onClose.subscribe((rental: Rental) => {
      if (rental) {
        this.loadSales();
        this.loadRent();
      }
    });
  }
}


