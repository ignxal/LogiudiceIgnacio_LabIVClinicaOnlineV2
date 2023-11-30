import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyAppointmentsComponent } from './my-appointments/my-appointments.component';
import { RequestAppointmentsComponent } from './request-appointments/request-appointments.component';
import { PatientHomeComponent } from './patient-home/patient-home.component';

const routes: Routes = [
  {
    path: 'request-appointment',
    component: RequestAppointmentsComponent,
  },
  {
    path: 'my-appointment',
    component: MyAppointmentsComponent,
  },
  {
    path: '',
    component: PatientHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientRoutingModule {}
