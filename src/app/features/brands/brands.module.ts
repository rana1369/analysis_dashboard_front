import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { BrandsComponent } from './brands.component';
import { BrandDialogComponent } from './brand-dialog/brand-dialog.component';

@NgModule({
  declarations: [
    BrandsComponent,
    BrandDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: BrandsComponent }
    ])
  ]
})
export class BrandsModule { }

