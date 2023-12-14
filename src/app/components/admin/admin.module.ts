import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { RegisterAdminComponent } from './register/register-admin.component';
import { SharedModule } from '../../components/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbmAdminComponent } from './abm/abm-admin.component';
import { UserlistAdminComponent } from './userlist/userlist-admin.component';
import { AllAppointmentsComponent } from './all-appointments/all-appointments.component';
import { AdminRequestAppointmentComponent } from './admin-request-appointment/admin-request-appointment.component';
import { AppStatsComponent } from './app-stats/app-stats.component';
import { AppointmentsEndedComponent } from './app-stats/appointments-ended/appointments-ended.component';
import { AppointmentsSpecialtyComponent } from './app-stats/appointments-specialty/appointments-specialty.component';
import { AppointmentsPerDayComponent } from './app-stats/appointments-per-day/appointments-per-day.component';
import { AppointmentsBySpecialistComponent } from './app-stats/appointments-by-specialist/appointments-by-specialist.component';
import { SystemLogsComponent } from './app-stats/system-logs/system-logs.component';

@NgModule({
  declarations: [
    RegisterAdminComponent,
    AbmAdminComponent,
    UserlistAdminComponent,
    AllAppointmentsComponent,
    AdminRequestAppointmentComponent,
    AppointmentsEndedComponent,
    AppStatsComponent,
    AppointmentsSpecialtyComponent,
    AppointmentsPerDayComponent,
    AppointmentsBySpecialistComponent,
    SystemLogsComponent,
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
