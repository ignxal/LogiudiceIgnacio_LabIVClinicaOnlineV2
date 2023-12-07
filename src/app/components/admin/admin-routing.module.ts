import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbmAdminComponent } from './abm/abm-admin.component';
import { RegisterAdminComponent } from './register/register-admin.component';
import { UserlistAdminComponent } from './userlist/userlist-admin.component';
import { AllAppointmentsComponent } from './all-appointments/all-appointments.component';

const routes: Routes = [
  { path: 'auth-specialist', component: AbmAdminComponent },
  { path: 'register', component: RegisterAdminComponent },
  { path: 'userlist', component: UserlistAdminComponent },
  { path: 'appointments', component: AllAppointmentsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
