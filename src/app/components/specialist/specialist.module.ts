import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeSpecialistComponent } from './home-specialist/home-specialist.component';
import { SpecialistRoutingModule } from './specialist-routing.module';
import { AppointmentsSpecialistComponent } from './appointments-specialist/appointments-specialist.component';
import { MyPatientsComponent } from './my-patients/my-patients.component';

@NgModule({
  declarations: [HomeSpecialistComponent, AppointmentsSpecialistComponent, MyPatientsComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    SpecialistRoutingModule,
  ],
})
export class SpecialistModule {}
