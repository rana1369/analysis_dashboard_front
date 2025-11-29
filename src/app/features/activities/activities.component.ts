import { Component, OnInit } from '@angular/core';
import { Activity } from '@core/models/activity.model';
import { ActivityService } from '@core/services/activity.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { I18nService } from '@shared/services/i18n.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ActivityDialogComponent } from './activity-dialog/activity-dialog.component';

@Component({
  selector: 'app-activities',
  template: `
    <div class="activities-container">
      <p-toolbar>
        <div class="p-toolbar-group-start">
          <h2>{{ i18n.translate('activities.title') }}</h2>
        </div>
        <div class="p-toolbar-group-end">
          <button 
            pButton 
            label="{{ i18n.translate('activities.add') }}"
            icon="pi pi-plus"
            (click)="openAddDialog()"
            *ngIf="canEdit()"
          ></button>
        </div>
      </p-toolbar>

      <p-table 
        #dt
        [value]="activities" 
        [paginator]="true" 
        [rows]="10"
        [globalFilterFields]="['name', 'description']"
        [loading]="loading"
        styleClass="p-datatable-striped"
        [rowHover]="true"
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
            <th>{{ i18n.translate('activities.name') }}</th>
            <th>{{ i18n.translate('activities.description') }}</th>
            <th>{{ i18n.translate('activities.safeValue') }}</th>
            <th>{{ i18n.translate('activities.parentActivity') }}</th>
            <th *ngIf="canEdit()">{{ i18n.translate('common.edit') }}</th>
            <th *ngIf="canDelete()">{{ i18n.translate('common.delete') }}</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-activity>
          <tr>
            <td>{{ activity.name }}</td>
            <td>{{ activity.description }}</td>
            <td>{{ activity.safeValue | number:'1.2-2' }}%</td>
            <td>
              <span *ngIf="activity.parentActivity">{{ activity.parentActivity.name }}</span>
              <span *ngIf="!activity.parentActivity" class="text-muted">-</span>
            </td>
            <td *ngIf="canEdit()">
              <button 
                pButton 
                icon="pi pi-pencil" 
                class="p-button-rounded p-button-text"
                (click)="openEditDialog(activity)"
              ></button>
            </td>
            <td *ngIf="canDelete()">
              <button 
                pButton 
                icon="pi pi-trash" 
                class="p-button-rounded p-button-text p-button-danger"
                (click)="deleteActivity(activity)"
              ></button>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td [attr.colspan]="canEdit() ? 6 : 4" class="text-center">
              {{ i18n.translate('common.noData') }}
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [`
    .activities-container {
      padding: 2rem;
    }

    [dir="rtl"] .activities-container {
      padding: 2rem;
    }

    [dir="ltr"] .activities-container {
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

    .text-muted {
      color: #999;
      font-style: italic;
    }

    .text-center {
      text-align: center;
      padding: 2rem;
    }
  `]
})
export class ActivitiesComponent implements OnInit {
  activities: Activity[] = [];
  loading = false;
  ref: DynamicDialogRef | undefined;

  constructor(
    private activityService: ActivityService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.loading = true;
    this.activityService.getAllActivities().subscribe({
      next: (response) => {
        if (response.status && response.data) {
          this.activities = response.data;
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: response.message || 'Failed to load activities'
          });
          this.activities = [];
        }
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load activities. Please check your API connection.'
        });
        console.error('Error loading activities:', error);
      }
    });
  }

  openAddDialog(): void {
    this.ref = this.dialogService.open(ActivityDialogComponent, {
      header: this.i18n.translate('activities.add'),
      width: '70%',
      contentStyle: { 'max-height': '90vh', 'overflow': 'auto' },
      baseZIndex: 10000,
      data: { activity: null }
    });

    this.ref.onClose.subscribe((activity: Activity) => {
      if (activity) {
        this.loadActivities();
      }
    });
  }

  openEditDialog(activity: Activity): void {
    this.ref = this.dialogService.open(ActivityDialogComponent, {
      header: this.i18n.translate('activities.edit'),
      width: '70%',
      contentStyle: { 'max-height': '90vh', 'overflow': 'auto' },
      baseZIndex: 10000,
      data: { activity }
    });

    this.ref.onClose.subscribe((updatedActivity: Activity) => {
      if (updatedActivity) {
        this.loadActivities();
      }
    });
  }

  deleteActivity(activity: Activity): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${activity.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.activityService.deleteActivity(activity.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Activity deleted successfully'
            });
            this.loadActivities();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete activity'
            });
            console.error('Error deleting activity:', error);
          }
        });
      }
    });
  }

  canEdit(): boolean {
    return true; // Simplified for now - implement role-based check
  }

  canDelete(): boolean {
    return true; // Simplified for now - implement role-based check
  }
}

