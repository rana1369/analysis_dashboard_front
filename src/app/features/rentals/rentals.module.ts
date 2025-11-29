import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { RentalsComponent } from './rentals.component';
import { RentalDialogComponent } from './rental-dialog/rental-dialog.component';

@NgModule({
  declarations: [
    RentalsComponent,
    RentalDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: RentalsComponent }
    ])
  ]
})
export class RentalsModule { }

