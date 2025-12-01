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

@Component({
  selector: 'app-rental-dialog',
  template: `
    <div class="rental-dialog" [dir]="i18n.getCurrentLanguage() === 'ar' ? 'rtl' : 'ltr'">
      <h3>{{ isEditMode ? i18n.translate('rentals.edit') : i18n.translate('rentals.add') }}</h3>
      
     <form [formGroup]="rentalForm" (ngSubmit)="onSubmit()" class="rental-form">
      <div class="form-grid-two">
  <div class="form-field">
    <label>Name *</label>
    <input type="text" pInputText formControlName="name" class="w-full" />
  </div>

  <div class="form-field">
    <label>Unit Number *</label>
    <input type="text" pInputText formControlName="unitNumber" class="w-full" />
  </div>
      </div>
  <div class="form-field">
    <label>Description</label>
    <textarea     pInputTextarea
              [rows]="4"
formControlName="description" class="w-full"></textarea>
  </div>
<div class="form-grid-two">
  <div class="form-field">
    <label>Brand *</label>
    <p-dropdown [options]="brands" formControlName="brandId" optionLabel="name" optionValue="id" class="w-full"></p-dropdown>
  </div>

  <div class="form-field">
    <label>Activity *</label>
    <p-dropdown [options]="activities" formControlName="activityId" optionLabel="name" optionValue="id" class="w-full"></p-dropdown>
  </div>
</div>
<div class="form-grid-two">
  <div class="form-field">
    <label>Location *</label>
    <input type="text" pInputText formControlName="location" class="w-full" />
  </div>

  <div class="form-field">
    <label>Responsible Person *</label>
    <input type="text" pInputText formControlName="responsiblePerson" class="w-full" />
  </div>
</div>
<div class="form-field">
    <label>Rent Type *</label>
    <p-dropdown [options]="rentTypeOptions" formControlName="rentType" optionLabel="label" optionValue="value" class="w-full"></p-dropdown>
  </div>
<div class="form-grid-two">
  <div class="form-field">
    <label>Contract Duration (months) *</label>
    <p-inputNumber formControlName="contractDuration" [min]="1" [showButtons]="true" class="w-full"></p-inputNumber>
  </div>

   <div class="form-field" *ngIf="rentalForm.get('rentType')?.value === 1">
    <label>Rent Value *</label>
    <p-inputNumber formControlName="rentValue" [min]="0" [showButtons]="true" class="w-full"></p-inputNumber>
  </div>
</div>
<div class="form-grid-two">
 

  <div class="form-field" *ngIf="rentalForm.get('rentType')?.value === 2">
    <label>Percentage Value (%) *</label>
    <p-inputNumber formControlName="percentageValue" [min]="0" [max]="100" [showButtons]="true" class="w-full"></p-inputNumber>

    <label>Annual Sales *</label>
    <p-inputNumber formControlName="annualSales" [min]="0" [showButtons]="true" prefix="$" class="w-full"></p-inputNumber>
  </div>
</div>
<div class="form-grid-two">
  <div class="form-field">
    <label>Sales Collect Type *</label>
    <p-dropdown [options]="salesCollectOptions" formControlName="salesCollectType" optionLabel="label" optionValue="value" class="w-full"></p-dropdown>
  </div>

  <div class="form-field">
    <label>Rent Collect Type *</label>
    <p-dropdown [options]="rentCollectOptions" formControlName="rentCollectType" optionLabel="label" optionValue="value" class="w-full"></p-dropdown>
  </div>
</div>
  

  

 

  <div class="form-actions">
    <button pButton type="button" label="Cancel" class="p-button-secondary" (click)="ref.close()"></button>
    <button pButton type="submit" label="Save" [disabled]="rentalForm.invalid"></button>
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
export class RentalDialogComponent implements OnInit {
  rentalForm!: FormGroup;
  brands: Brand[] = [];
  activities: Activity[] = [];

  isEditMode = false;
  expectedAnnualIncome = 0;
   rentTypeOptions = [
    { label: 'Fixed', value: 1 },
    { label: 'Percentage', value: 2 }
  ];

 salesCollectOptions = [
  { label: 'Monthly', value: 1 },
  { label: 'Quarterly', value: 2 },
  { label: 'Bi-Annual', value: 3 },
  { label: 'Annual', value: 4 },
];

rentCollectOptions = [
  { label: 'Monthly', value: 1 },
  { label: 'Quarterly', value: 2 },
  { label: 'Bi-Annual', value: 3 },
  { label: 'Annual', value: 4 },
];


  rentalTypeOptions = [
    { label: 'Monthly Rent', value: RentalType.MonthlyRent },
    { label: 'Percentage of Annual Sales', value: RentalType.PercentageOfSales }
  ];

  constructor(
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private rentalService: RentalService,
    private brandService: BrandService,
    private activityService:ActivityService,
    private messageService: MessageService,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    const rental = this.config.data?.rental as Rental | null;
    this.isEditMode = !!rental;

    this.loadBrands();
  this.loadActivities();
   this.rentalForm = this.fb.group({
  name: [rental?.name || '', Validators.required],
  unitNumber: [rental?.unitNumber || '', Validators.required],
  description: [rental?.description || ''],

  rentValue: [rental?.rentValue || null, Validators.required],
  rentType: [rental?.rentType || 1, Validators.required], // 1 = Fixed, 2 = Percentage

  activityId: [rental?.activityId || '', Validators.required],
  brandId: [rental?.brandId || '', Validators.required],

  salesCollectType: [rental?.salesCollectType || 1, Validators.required],
  rentCollectType: [rental?.rentCollectType || 1, Validators.required],

  location: [rental?.location || '', Validators.required],
  contractDuration: [rental?.contractDuration || null, Validators.required],

  responsiblePerson: [rental?.responsiblePerson || '', Validators.required]
});


    this.updateValidators();
    this.calculateExpectedIncome();

    this.rentalForm.valueChanges.subscribe(() => {
      this.calculateExpectedIncome();
    });
  }

  loadBrands(): void {
    this.brandService.getAllBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
      }
    });
  }
  loadActivities(): void {
    this.activityService.getAllActivities().subscribe({
     next: (response) => {
      this.activities = response.data; 
    }
    });
  }

  onRentalTypeChange(): void {
    this.updateValidators();
    this.calculateExpectedIncome();
  }

  updateValidators(): void {
    const rentalType = this.rentalForm.get('rentalType')?.value;
    
    if (rentalType === RentalType.MonthlyRent) {
      this.rentalForm.get('rentalAmount')?.setValidators([Validators.required]);
      this.rentalForm.get('percentageValue')?.clearValidators();
      this.rentalForm.get('annualSales')?.clearValidators();
    } else {
      this.rentalForm.get('rentalAmount')?.clearValidators();
      this.rentalForm.get('percentageValue')?.setValidators([Validators.required]);
      this.rentalForm.get('annualSales')?.setValidators([Validators.required]);
    }

    this.rentalForm.get('rentalAmount')?.updateValueAndValidity();
    this.rentalForm.get('percentageValue')?.updateValueAndValidity();
    this.rentalForm.get('annualSales')?.updateValueAndValidity();
  }

  calculateExpectedIncome(): void {
    const formValue = this.rentalForm.value;
    
    if (formValue.rentalType === RentalType.MonthlyRent && formValue.rentalAmount && formValue.startDate && formValue.endDate) {
      const months = this.getMonthsBetween(formValue.startDate, formValue.endDate);
      this.expectedAnnualIncome = formValue.rentalAmount * months;
    } else if (formValue.rentalType === RentalType.PercentageOfSales && formValue.percentageValue && formValue.annualSales) {
      this.expectedAnnualIncome = (formValue.annualSales * formValue.percentageValue) / 100;
    } else {
      this.expectedAnnualIncome = 0;
    }
  }

  private getMonthsBetween(start: Date, end: Date): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                   (endDate.getMonth() - startDate.getMonth());
    return Math.max(1, months);
  }

  onSubmit(): void {
    if (this.rentalForm.valid) {
      const formData: RentalFormData = {
        ...this.rentalForm.value,
       
      };
      
      const operation = this.isEditMode
        ? this.rentalService.updateRental(this.config.data.rental.id, formData)
        : this.rentalService.createRental(formData);

      operation.subscribe({
        next: (rental) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Rental ${this.isEditMode ? 'updated' : 'created'} successfully`
          });
          this.ref.close(rental);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to ${this.isEditMode ? 'update' : 'create'} rental`
          });
        }
      });
    }
  }
}

