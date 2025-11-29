import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Brand, BrandFormData, RentalModel } from '@core/models/brand.model';
import { BrandService } from '@core/services/brand.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { I18nService } from '@shared/services/i18n.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BrandDialogComponent } from './brand-dialog/brand-dialog.component';

@Component({
  selector: 'app-brands',
  template: `
    <div class="brands-container">
      <p-toolbar>
        <div class="p-toolbar-group-start">
          <h2>{{ i18n.translate('brands.title') }}</h2>
        </div>
        <div class="p-toolbar-group-end">
          <button 
            pButton 
            label="{{ i18n.translate('brands.add') }}"
            icon="pi pi-plus"
            (click)="openAddDialog()"
            *ngIf="canEdit()"
          ></button>
        </div>
      </p-toolbar>

      <p-table 
        #dt
        [value]="brands" 
        [paginator]="true" 
        [rows]="10"
        [globalFilterFields]="['name', 'branchLocation', 'contactPerson']"
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
            <th>{{ i18n.translate('brands.name') }}</th>
            <th>{{ i18n.translate('brands.description') }}</th>
           <!--  <th>{{ i18n.translate('brands.contactPerson') }}</th>
            <th>{{ i18n.translate('brands.contractDuration') }}</th>
            <th>{{ i18n.translate('brands.rentalModel') }}</th>
            <th>{{ i18n.translate('brands.rentalValue') }}</th> -->
            <th *ngIf="canEdit()">{{ i18n.translate('common.edit') }}</th>
            <th *ngIf="canDelete()">{{ i18n.translate('common.delete') }}</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-brand>
          <tr>
            <td>{{ brand.name }}</td>
            <td>{{ brand.description }}</td>
           <!--  <td>{{ brand.contactPerson }}</td>
            <td>{{ brand.contractDuration }} months</td>
            <td>
              <p-tag 
                [value]="brand.rentalModel === 'FixedMonthly' ? 'Fixed Monthly' : 'Percentage'"
                [severity]="brand.rentalModel === 'FixedMonthly' ? 'info' : 'success'"
              ></p-tag>
            </td>
            <td>
              {{ brand.rentalModel === 'FixedMonthly' ? (brand.rentalValue | currency) : brand.rentalValue + '%' }}
            </td> -->
            <td *ngIf="canEdit()">
              <button 
                pButton 
                icon="pi pi-pencil" 
                class="p-button-rounded p-button-text"
                (click)="openEditDialog(brand)"
              ></button>
            </td>
            <td *ngIf="canDelete()">
              <button 
                pButton 
                icon="pi pi-trash" 
                class="p-button-rounded p-button-text p-button-danger"
                (click)="deleteBrand(brand)"
              ></button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [`
    .brands-container {
      padding: 2rem;
    }

    [dir="rtl"] .brands-container {
      padding: 2rem;
    }

    [dir="ltr"] .brands-container {
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
export class BrandsComponent implements OnInit {
  brands: Brand[] = [];
  loading = false;
  ref: DynamicDialogRef | undefined;

  constructor(
    private brandService: BrandService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.loading = true;
    this.brandService.getAllBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load brands'
        });
      }
    });
  }

  openAddDialog(): void {
    this.ref = this.dialogService.open(BrandDialogComponent, {
      header: this.i18n.translate('brands.add'),
      width: '70%',
      contentStyle: { 'max-height': '90vh', 'overflow': 'auto' },
      baseZIndex: 10000,
      data: { brand: null }
    });

    this.ref.onClose.subscribe((brand: Brand) => {
      if (brand) {
        this.loadBrands();
      }
    });
  }

  openEditDialog(brand: Brand): void {
    this.ref = this.dialogService.open(BrandDialogComponent, {
      header: this.i18n.translate('brands.edit'),
      width: '70%',
      contentStyle: { 'max-height': '90vh', 'overflow': 'auto' },
      baseZIndex: 10000,
      data: { brand }
    });

    this.ref.onClose.subscribe((updatedBrand: Brand) => {
      if (updatedBrand) {
        this.loadBrands();
      }
    });
  }

  deleteBrand(brand: Brand): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${brand.name}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.brandService.deleteBrand(brand.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Brand deleted successfully'
            });
            this.loadBrands();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete brand'
            });
          }
        });
      }
    });
  }

  canEdit(): boolean {
    // Check user role - Admin and Finance can edit
    return true; // Simplified for now
  }

  canDelete(): boolean {
    // Check user role - Only Admin can delete
    return true; // Simplified for now
  }

}

