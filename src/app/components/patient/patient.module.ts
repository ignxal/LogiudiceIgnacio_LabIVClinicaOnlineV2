import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientRoutingModule } from './patient-routing.module';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyAppointmentsComponent } from './my-appointments/my-appointments.component';
import { PatientHomeComponent } from './patient-home/patient-home.component';
import { RequestAppointmentsComponent } from './request-appointments/request-appointments.component';

@NgModule({
  declarations: [MyAppointmentsComponent, PatientHomeComponent, RequestAppointmentsComponent],
  imports: [
    CommonModule,
    PatientRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class PatientModule {}
