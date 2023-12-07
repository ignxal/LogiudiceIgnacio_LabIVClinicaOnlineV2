import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeSpecialistComponent } from './home-specialist/home-specialist.component';
import { AppointmentsSpecialistComponent } from './appointments-specialist/appointments-specialist.component';
import { MyPatientsComponent } from './my-patients/my-patients.component';

const routes: Routes = [
  { path: '', component: HomeSpecialistComponent },
  { path: 'appointments', component: AppointmentsSpecialistComponent },
  { path: 'patients', component: MyPatientsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpecialistRoutingModule {}
