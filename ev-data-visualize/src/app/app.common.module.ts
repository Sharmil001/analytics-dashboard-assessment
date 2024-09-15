import { NgModule } from '@angular/core';
import { NgPrimeModule } from 'src/app/app.ngprime.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgPrimeModule,
    ReactiveFormsModule,
  ],
  exports: [NgPrimeModule, FormsModule, ReactiveFormsModule],
  declarations: [],
})
export class AppCommonModule {}