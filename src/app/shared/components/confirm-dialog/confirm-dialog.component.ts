import { Component } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="confirm-dialog">
      <h3>{{ config.data?.title || 'Confirm Action' }}</h3>
      <p>{{ config.data?.message || 'Are you sure you want to proceed?' }}</p>
      <div class="dialog-actions">
        <button pButton label="Cancel" (click)="ref.close(false)" class="p-button-secondary"></button>
        <button pButton label="Confirm" (click)="ref.close(true)" class="p-button-danger"></button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      padding: 1rem;
    }

    .confirm-dialog h3 {
      margin-bottom: 1rem;
    }

    .confirm-dialog p {
      margin-bottom: 1.5rem;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}
}

