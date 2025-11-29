import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Brand, BrandFormData, RentalModel } from '@core/models/brand.model';
import { BrandService } from '@core/services/brand.service';
import { MessageService } from 'primeng/api';
import { I18nService } from '@shared/services/i18n.service';

@Component({
  selector: 'app-brand-dialog',
  template: `
    <div class="brand-dialog" [dir]="i18n.getCurrentLanguage() === 'ar' ? 'rtl' : 'ltr'">
      <h3>{{ isEditMode ? i18n.translate('brands.edit') : i18n.translate('brands.add') }}</h3>
      
      <form [formGroup]="brandForm" (ngSubmit)="onSubmit()" class="brand-form">
        <div class="form-grid">
          <div class="form-field">
            <label>{{ i18n.translate('brands.name') }} *</label>
            <input 
              pInputText 
              formControlName="name"
              [placeholder]="i18n.translate('brands.name')"
              class="w-full"
            />
            <small class="p-error" *ngIf="brandForm.get('name')?.hasError('required') && brandForm.get('name')?.touched">
              {{ i18n.translate('brands.name') }} is required
            </small>
          </div>

         <!--  <div class="form-field">
            <label>{{ i18n.translate('brands.branchLocation') }} *</label>
            <input 
              pInputText 
              formControlName="branchLocation"
              [placeholder]="i18n.translate('brands.branchLocation')"
              class="w-full"
            />
            <small class="p-error" *ngIf="brandForm.get('branchLocation')?.hasError('required') && brandForm.get('branchLocation')?.touched">
              {{ i18n.translate('brands.branchLocation') }} is required
            </small>
          </div>

          <div class="form-field">
            <label>{{ i18n.translate('brands.contactPerson') }} *</label>
            <input 
              pInputText 
              formControlName="contactPerson"
              [placeholder]="i18n.translate('brands.contactPerson')"
              class="w-full"
            />
            <small class="p-error" *ngIf="brandForm.get('contactPerson')?.hasError('required') && brandForm.get('contactPerson')?.touched">
              {{ i18n.translate('brands.contactPerson') }} is required
            </small>
          </div>

          <div class="form-field">
            <label>{{ i18n.translate('brands.contactEmail') }}</label>
            <input 
              pInputText 
              type="email"
              formControlName="contactEmail"
              [placeholder]="i18n.translate('brands.contactEmail')"
              class="w-full"
            />
          </div>
 -->
         <!--  <div class="form-field">
            <label>{{ i18n.translate('brands.contactPhone') }}</label>
            <input 
              pInputText 
              formControlName="contactPhone"
              [placeholder]="i18n.translate('brands.contactPhone')"
              class="w-full"
            />
          </div>

          <div class="form-field">
            <label>{{ i18n.translate('brands.contractDuration') }} *</label>
            <p-inputNumber 
              formControlName="contractDuration"
              [min]="1"
              [max]="120"
              [showButtons]="true"
              class="w-full"
            ></p-inputNumber>
            <small class="p-error" *ngIf="brandForm.get('contractDuration')?.hasError('required') && brandForm.get('contractDuration')?.touched">
              {{ i18n.translate('brands.contractDuration') }} is required
            </small>
          </div> -->

          <!-- <div class="form-field">
            <label>{{ i18n.translate('brands.rentalModel') }} *</label>
            <p-dropdown 
              [options]="rentalModelOptions" 
              formControlName="rentalModel"
              optionLabel="label"
              optionValue="value"
              [placeholder]="i18n.translate('brands.rentalModel')"
              class="w-full"
            ></p-dropdown>
            <small class="p-error" *ngIf="brandForm.get('rentalModel')?.hasError('required') && brandForm.get('rentalModel')?.touched">
              {{ i18n.translate('brands.rentalModel') }} is required
            </small>
          </div> -->

          <!-- <div class="form-field">
            <label>{{ i18n.translate('brands.rentalValue') }} *</label>
            <p-inputNumber 
              formControlName="rentalValue"
              [min]="0"
              [showButtons]="true"
              [prefix]="brandForm.get('rentalModel')?.value === 'FixedMonthly' ? '$' : ''"
              [suffix]="brandForm.get('rentalModel')?.value === 'PercentageOfSales' ? '%' : ''"
              class="w-full"
            ></p-inputNumber>
            <small class="p-error" *ngIf="brandForm.get('rentalValue')?.hasError('required') && brandForm.get('rentalValue')?.touched">
              {{ i18n.translate('brands.rentalValue') }} is required
            </small>
          </div> -->

          <div class="form-field full-width">
            <label>{{ i18n.translate('brands.description') }}</label>
            <textarea 
              pInputTextarea 
              formControlName="description"
              [rows]="3"
              [placeholder]="i18n.translate('brands.description')"
              class="w-full"
            ></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button 
            pButton 
            type="button"
            label="{{ i18n.translate('common.cancel') }}"
            class="p-button-secondary"
            (click)="ref.close()"
          ></button>
          <button 
            pButton 
            type="submit"
            label="{{ i18n.translate('common.save') }}"
            [disabled]="brandForm.invalid"
          ></button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .brand-dialog {
      padding: 1.5rem;
      min-width: 600px;
    }

    .brand-dialog h3 {
      margin: 0 0 1.5rem 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .brand-form {
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
      .brand-dialog {
        min-width: auto;
        width: 100%;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BrandDialogComponent implements OnInit {
  brandForm!: FormGroup;
  isEditMode = false;
  rentalModelOptions = [
    { label: 'Fixed Monthly Rent', value: RentalModel.FixedMonthly },
    { label: 'Percentage of Annual Sales', value: RentalModel.PercentageOfSales }
  ];

  constructor(
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private brandService: BrandService,
    private messageService: MessageService,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    const brand = this.config.data?.brand as Brand | null;
    this.isEditMode = !!brand;

    this.brandForm = this.fb.group({
      name: [brand?.name || '', Validators.required],
      description:[brand?.description || '',Validators.required]
    });
  }

  onSubmit(): void {
    if (this.brandForm.valid) {
      const formData: BrandFormData = this.brandForm.value;
      
      const operation = this.isEditMode
        ? this.brandService.updateBrand(this.config.data.brand.id, formData)
        : this.brandService.createBrand(formData);

      operation.subscribe({
        next: (brand) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Brand ${this.isEditMode ? 'updated' : 'created'} successfully`
          });
          this.ref.close(brand);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to ${this.isEditMode ? 'update' : 'create'} brand`
          });
        }
      });
    }
  }
}

