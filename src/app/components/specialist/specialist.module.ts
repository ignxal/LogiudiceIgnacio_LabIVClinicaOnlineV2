import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeSpecialistComponent } from './home-specialist/home-specialist.component';
import { SpecialistRoutingModule } from './specialist-routing.module';

@NgModule({
  declarations: [HomeSpecialistComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    SpecialistRoutingModule,
  ],
})
export class SpecialistModule {}
