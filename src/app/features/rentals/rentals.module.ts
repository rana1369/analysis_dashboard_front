import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { RentalsComponent } from './rentals.component';
import { RentalDialogComponent } from './rental-dialog/rental-dialog.component';
import { SaleRentComponent } from './sale-rent.component';
import { SentRentDialogComponent } from './sale-rent-dialog/sale-rent-dialog.component';

@NgModule({
  declarations: [
    RentalsComponent,
    RentalDialogComponent,
    SaleRentComponent,
    SentRentDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: RentalsComponent },
      {path:'sale-rant/:tenantId',component:SaleRentComponent}
    ])
  ]
})
export class RentalsModule { }

