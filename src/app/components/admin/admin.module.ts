import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { RegisterAdminComponent } from './register/register-admin.component';
import { SharedModule } from '../../components/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbmAdminComponent } from './abm/abm-admin.component';
import { UserlistAdminComponent } from './userlist/userlist-admin.component';
import { AllAppointmentsComponent } from './all-appointments/all-appointments.component';

@NgModule({
  declarations: [
    RegisterAdminComponent,
    AbmAdminComponent,
    UserlistAdminComponent,
    AllAppointmentsComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AdminModule {}
