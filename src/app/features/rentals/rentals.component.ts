import { Component, OnInit } from '@angular/core';
import { Rental } from '@core/models/rental.model';
import { RentalService } from '@core/services/rental.service';
import { BrandService } from '@core/services/brand.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { I18nService } from '@shared/services/i18n.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RentalDialogComponent } from './rental-dialog/rental-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rentals',
  template: `
    <div class="rentals-container">
      <p-toolbar>
        <div class="p-toolbar-group-start">
          <h2>{{ i18n.translate('rentals.title') }}</h2>
        </div>
        <div class="p-toolbar-group-end">
          <button 
            pButton 
            label="{{ i18n.translate('rentals.add') }}"
            icon="pi pi-plus"
            (click)="openAddDialog()"
            *ngIf="canEdit()"
          ></button>
        </div>
      </p-toolbar>

      <p-table 
        #dt
        [value]="rentals" 
        [paginator]="true" 
        [rows]="10"
        [globalFilterFields]="['brandName', 'rentalType']"
        [loading]="loading"
        styleClass="p-datatable-striped"
      >
        <ng-template pTemplate="caption">
          <div class="table-header">
            <span class="p-input-icon-left">
              <i class="pi pi-search"></i>
              <input 
                pInputText 
                type="text" 
                [placeholder]="i18n.translate('common.search')"
                (input)="dt.filterGlobal($any($event.target).value, 'contains')"
              />
            </span>
          </div>
        </ng-template>

        <ng-template pTemplate="header">
          <tr>
            <th>{{ i18n.translate('rentals.brand') }}</th>
             <th>{{ i18n.translate('rentals.unitNumber') }}</th>

            <th>{{ i18n.translate('rentals.rentalType') }}</th>
            <th>{{ i18n.translate('rentals.rentalAmount') }}</th>
            <th>{{ i18n.translate('rentals.startDate') }}</th>
<!--             <th>{{ i18n.translate('rentals.endDate') }}</th>
 -->            <th>{{ i18n.translate('rentals.expectedAnnualIncome') }}</th>
            <th *ngIf="canEdit()">{{ i18n.translate('common.edit') }}</th>
            <th *ngIf="canDelete()">{{ i18n.translate('common.delete') }}</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-rental>
          <tr>
            <td>{{ rental.name }}</td>
                        <td>{{ rental.unitNumber }}</td>

             <td>
              <p-tag 
                [value]="rental.rentType === 'Fixed' ? 'Monthly Rent' : 'Percentage'"
                [severity]="rental.rentType === 'MonthlyRent' ? 'info' : 'success'"
              ></p-tag>
            </td> 
            <td>
              {{ rental.rentValue ? (rental.rentValue | currency) : (rental.percentageValue + '%') }}
            </td>
            <td>{{ rental.createdOn | date:'shortDate' }}</td>
           <!--  <td>{{ rental.endDate | date:'shortDate' }}</td> -->
            <td>{{ rental.expectedAnnualIncome | currency }}</td>
            <td *ngIf="canEdit()">
              <button 
                pButton 
                icon="pi pi-pencil" 
                class="p-button-rounded p-button-text"
                  (click)="navigateToSaleRent(rental)"

              ></button>
            </td>
            <td *ngIf="canDelete()">
              <button 
                pButton 
                icon="pi pi-trash" 
                class="p-button-rounded p-button-text p-button-danger"
                (click)="deleteRental(rental)"
              ></button>
            </td>
          </tr>
        </ng-template>
      </p-table>
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
  `]
})
export class RentalsComponent implements OnInit {
  rentals: Rental[] = [];
  loading = false;
  ref: DynamicDialogRef | undefined;

  constructor(
    private rentalService: RentalService,
    private brandService: BrandService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    public i18n: I18nService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRentals();
  }

loadRentals(): void {
  this.loading = true;

  this.rentalService.getAllRentals().subscribe({
    next: (data: any[]) => {
      this.rentals = data.map(item => ({
        id: item.id,
        name: item.name ?? item.brand?.name ?? '',
        description: item.description ?? item.activity?.name ?? '',
        unitNumber: item.unitNumber ?? '',
        imageUrl: item.imageUrl ?? null,

        rentValue: item.rentValue,
        rentalAmount: item.rentValue,    // required field
        rentType: item.rentType,
        salesCollectType: item.salesCollectType ?? '',
        rentCollectType: item.rentCollectType ?? '',

        activityId: item.activityId ?? '',
        activity: item.activity ?? undefined,

        brandId: item.brandId ?? '',
        brand: item.brand ?? undefined,

        parentTenantId: item.parentTenantId ?? null,

        createdOn: new Date(item.createdOn),

        // optional UI fields
        startDate: new Date(item.createdOn),
        // endDate: undefined,      // optional, can be omitted
        expectedAnnualIncome: item.rentValue ?? 0,
        contractDuration: item.contractDuration ?? undefined,
        responsiblePerson: item.responsiblePerson ?? undefined,
        location: item.location ?? undefined,
        annualSales: item.annualSales ?? undefined,
        percentageValue: item.percentageValue ?? undefined,
        expectedRevenue: item.expectedRevenue ?? 0
      }));

      this.loading = false;
    },
    error: () => {
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load rentals'
      });
    }
  });
}

navigateToSaleRent(rental: any) {
  const id = rental?.tenantId || rental?.id || rental?.tenantID;

  if (!id) {
    console.error("No tenant ID found in rental object", rental);
    return;
  }

  this.router.navigate(['/rentals/sale-rant', id]);
}


  openAddDialog(): void {
    this.ref = this.dialogService.open(RentalDialogComponent, {
      header: this.i18n.translate('rentals.add'),
      width: '70%',
      contentStyle: { 'max-height': '90vh', 'overflow': 'auto' },
      baseZIndex: 10000,
      data: { rental: null }
    });

    this.ref.onClose.subscribe((rental: Rental) => {
      if (rental) {
        this.loadRentals();
      }
    });
  }

  openEditDialog(rental: Rental): void {
    this.ref = this.dialogService.open(RentalDialogComponent, {
      header: this.i18n.translate('rentals.edit'),
      width: '70%',
      contentStyle: { 'max-height': '90vh', 'overflow': 'auto' },
      baseZIndex: 10000,
      data: { rental }
    });

    this.ref.onClose.subscribe((updatedRental: Rental) => {
      if (updatedRental) {
        this.loadRentals();
      }
    });
  }

  deleteRental(rental: Rental): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this rental?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.rentalService.deleteRental(rental.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Rental deleted successfully'
            });
            this.loadRentals();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete rental'
            });
          }
        });
      }
    });
  }

  canEdit(): boolean {
    return true;
  }

  canDelete(): boolean {
    return true;
  }
}

