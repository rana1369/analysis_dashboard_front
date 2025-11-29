import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Activity, ActivityFormData } from '@core/models/activity.model';
import { ActivityService } from '@core/services/activity.service';
import { MessageService } from 'primeng/api';
import { I18nService } from '@shared/services/i18n.service';

@Component({
  selector: 'app-activity-dialog',
  template: `
    <div class="activity-dialog" [dir]="i18n.getCurrentLanguage() === 'ar' ? 'rtl' : 'ltr'">
      <h3>{{ isEditMode ? i18n.translate('activities.edit') : i18n.translate('activities.add') }}</h3>
      
      <form [formGroup]="activityForm" (ngSubmit)="onSubmit()" class="activity-form">
        <div class="form-grid">
          <div class="form-field full-width">
            <label>{{ i18n.translate('activities.name') }} *</label>
            <input 
              pInputText 
              formControlName="name"
              [placeholder]="i18n.translate('activities.name')"
              class="w-full"
            />
            <small class="p-error" *ngIf="activityForm.get('name')?.hasError('required') && activityForm.get('name')?.touched">
              {{ i18n.translate('activities.name') }} is required
            </small>
          </div>

          <div class="form-field full-width">
            <label>{{ i18n.translate('activities.description') }} *</label>
            <textarea 
              pInputTextarea 
              formControlName="description"
              [rows]="4"
              [placeholder]="i18n.translate('activities.description')"
              class="w-full"
            ></textarea>
            <small class="p-error" *ngIf="activityForm.get('description')?.hasError('required') && activityForm.get('description')?.touched">
              {{ i18n.translate('activities.description') }} is required
            </small>
          </div>

          <div class="form-field">
            <label>{{ i18n.translate('activities.safeValue') }} *</label>
            <p-inputNumber 
              formControlName="safeValue"
              [min]="0"
              [max]="100"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              [showButtons]="true"
              suffix="%"
              class="w-full"
            ></p-inputNumber>
            <small class="p-error" *ngIf="activityForm.get('safeValue')?.hasError('required') && activityForm.get('safeValue')?.touched">
              {{ i18n.translate('activities.safeValue') }} is required
            </small>
          </div>

          <div class="form-field">
            <label>{{ i18n.translate('activities.parentActivity') }}</label>
            <p-dropdown 
              [options]="parentActivities" 
              formControlName="parentActivityId"
              optionLabel="name"
              optionValue="id"
              [placeholder]="i18n.translate('activities.selectParent')"
              [showClear]="true"
              class="w-full"
              [filter]="true"
              filterBy="name"
            ></p-dropdown>
            <small class="form-hint">{{ i18n.translate('activities.parentActivityHint') }}</small>
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
            [disabled]="activityForm.invalid || saving"
            [loading]="saving"
          ></button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .activity-dialog {
      padding: 1.5rem;
      min-width: 600px;
    }

    .activity-dialog h3 {
      margin: 0 0 1.5rem 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .activity-form {
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

    .form-hint {
      color: #666;
      font-size: 0.85rem;
      font-style: italic;
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
      .activity-dialog {
        min-width: auto;
        width: 100%;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ActivityDialogComponent implements OnInit {
  activityForm!: FormGroup;
  parentActivities: Activity[] = [];
  isEditMode = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private activityService: ActivityService,
    private messageService: MessageService,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    const activity = this.config.data?.activity as Activity | null;
    this.isEditMode = !!activity;

    this.loadParentActivities();

    this.activityForm = this.fb.group({
      name: [activity?.name || '', Validators.required],
      description: [activity?.description || '', Validators.required],
      safeValue: [activity?.safeValue || 0, [Validators.required, Validators.min(0), Validators.max(100)]],
      parentActivityId: [activity?.parentActivityId || null]
    });
  }

  loadParentActivities(): void {
    this.activityService.getAllActivities().subscribe({
      next: (response) => {
        if (response.status && response.data) {
          // Filter out the current activity if editing to prevent circular reference
          const currentActivityId = this.config.data?.activity?.id;
          this.parentActivities = response.data.filter(a => a.id !== currentActivityId);
        }
      },
      error: (error) => {
        console.error('Error loading parent activities:', error);
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Failed to load parent activities'
        });
      }
    });
  }

  onSubmit(): void {
    if (this.activityForm.valid) {
      this.saving = true;
      const formData: ActivityFormData = {
        name: this.activityForm.value.name,
        description: this.activityForm.value.description,
        safeValue: this.activityForm.value.safeValue,
        parentActivityId: this.activityForm.value.parentActivityId || null
      };
      
      const operation = this.isEditMode
        ? this.activityService.updateActivity(this.config.data.activity.id, formData)
        : this.activityService.createActivity(formData);

      operation.subscribe({
        next: (response) => {
          // Handle both direct activity response and wrapped response
          const activity = response.data || response;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Activity ${this.isEditMode ? 'updated' : 'created'} successfully`
          });
          this.saving = false;
          this.ref.close(activity);
        },
        error: (error) => {
          this.saving = false;
          const errorMessage = error.error?.message || `Failed to ${this.isEditMode ? 'update' : 'create'} activity`;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage
          });
          console.error('Error saving activity:', error);
        }
      });
    }
  }
}

