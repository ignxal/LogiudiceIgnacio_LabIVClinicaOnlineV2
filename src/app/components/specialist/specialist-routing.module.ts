import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeSpecialistComponent } from './home-specialist/home-specialist.component';
import { AppointmentsSpecialistComponent } from './appointments-specialist/appointments-specialist.component';

const routes: Routes = [
  { path: '', component: HomeSpecialistComponent },
  { path: 'appointments', component: AppointmentsSpecialistComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpecialistRoutingModule {}
