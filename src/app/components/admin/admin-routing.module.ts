import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbmAdminComponent } from './abm/abm-admin.component';
import { RegisterAdminComponent } from './register/register-admin.component';
import { UserlistAdminComponent } from './userlist/userlist-admin.component';
import { AllAppointmentsComponent } from './all-appointments/all-appointments.component';
import { AdminRequestAppointmentComponent } from './admin-request-appointment/admin-request-appointment.component';
import { AppStatsComponent } from './app-stats/app-stats.component';

const routes: Routes = [
  {
    path: 'auth-specialist',
    component: AbmAdminComponent,
    data: { state: 'auth-specialist' },
  },
  {
    path: 'register',
    component: RegisterAdminComponent,
    data: { state: 'register' },
  },
  { path: 'userlist', component: UserlistAdminComponent },
  { path: 'appointments', component: AllAppointmentsComponent },
  { path: 'request-appointments', component: AdminRequestAppointmentComponent },
  { path: 'stats', component: AppStatsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
