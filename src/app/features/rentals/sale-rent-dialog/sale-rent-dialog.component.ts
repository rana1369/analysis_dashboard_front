import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Rental, RentalFormData, RentalType } from '@core/models/rental.model';
import { RentalService } from '@core/services/rental.service';
import { BrandService } from '@core/services/brand.service';
import { Brand } from '@core/models/brand.model';
import { MessageService } from 'primeng/api';
import { I18nService } from '@shared/services/i18n.service';
import { ActivityService } from '@app/core/services/activity.service';
import { Activity } from '@app/core/models/activity.model';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-sale-rent-dialog',
    template: `
    <div class="rental-dialog" [dir]="i18n.getCurrentLanguage() === 'ar' ? 'rtl' : 'ltr'">
      <h3>{{ isEditMode ? i18n.translate('rentals.edit') : i18n.translate('rentals.sale') }}</h3>
      
     <form [formGroup]="saleRentForm" (ngSubmit)="onSubmit()" class="rental-form">
      <div class="form-grid-two">
  <div class="form-field">
    <label>Sales Value *</label>
    <input type="text" pInputText formControlName="salesValue" class="w-full" />
  </div>
<div class="form-field">
    <label>Rent Value *</label>
    <input type="text" pInputText formControlName="rentValue" class="w-full" />
  </div>
      </div>
<div class="form-field">
    <label>period*</label>
    <input type="text" pInputText formControlName="period" class="w-full" />
  </div>
  <div class="form-actions">
    <button pButton type="button" label="Cancel" class="p-button-secondary" (click)="ref.close()"></button>
    <button pButton type="submit" label="Save" [disabled]="saleRentForm.invalid"></button>
  </div>
</form>

    </div>
  `,
    styles: [`
  .form-grid-two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 768px) {
  .form-grid-two {
    grid-template-columns: 1fr; 
  }
}

    .rental-dialog {
      padding: 1.5rem;
      min-width: 600px;
    }

    .rental-dialog h3 {
      margin: 0 0 1.5rem 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .rental-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-field.full-width {
      grid-column: 1 / -1;
    }

    .form-field label {
      font-weight: 500;
      color: #333;
    }

    .income-display {
      padding: 1rem;
      background: #f0f9ff;
      border-radius: 4px;
      border-left: 4px solid #3b82f6;
    }

    [dir="rtl"] .income-display {
      border-left: none;
      border-right: 4px solid #3b82f6;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;
    }

    .w-full {
      width: 100%;
    }

    [dir="rtl"] .form-actions {
      justify-content: flex-start;
    }

    [dir="rtl"] .form-field {
      text-align: right;
    }

    @media (max-width: 768px) {
      .rental-dialog {
        min-width: auto;
        width: 100%;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SentRentDialogComponent implements OnInit {
    saleRentForm!: FormGroup;
    isEditMode = false;
    expectedAnnualIncome = 0;
    TenantId: any;
    constructor(
        private fb: FormBuilder,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private rentalService: RentalService,
        private activatedRoute: ActivatedRoute,
        private messageService: MessageService,
        public i18n: I18nService
    ) { }

    ngOnInit(): void {
        this.TenantId = this.config.data?.rental;
console.log("Dialog TenantId = ", this.TenantId);
          this.saleRentForm = this.fb.group({
      salesValue: ['', Validators.required],
      rentValue: ['', Validators.required],
      period: ['', Validators.required],
    });
    }








    onSubmit(): void {
   if (!this.saleRentForm.valid || !this.TenantId) return;

    const formValues = this.saleRentForm.value;

    // Rent API body
    const rentBody = {
      rentValue: formValues.rentValue,
      period: formValues.period,
      tenantId: this.TenantId
    };

    const salesBody = {
      salesValue: formValues.salesValue,
      period: formValues.period,
      tenantId: this.TenantId
    };

    forkJoin({
      rent: this.rentalService.createRents(rentBody),
      sales: this.rentalService.createSales(salesBody)
    }).subscribe({
      next: (results) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Sales & Rent created successfully'
        });
        
        this.ref.close(results);
        
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create rent or sales'
        });
      }
    });
  }
}

