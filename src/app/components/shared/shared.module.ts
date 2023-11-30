import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoaderComponent } from './loader/loader.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CaptchaComponent } from './captcha/captcha.component';
import { ProfileComponent } from './profile/profile.component';
import { CaptchaDirective } from '../../directives/captcha.directive';
import { FormsModule } from '@angular/forms';
import { SharedComponent } from './shared.component';
import { FooterComponent } from './footer/footer.component';
import { RequestAppointmentComponent } from './request-appointment/request-appointment.component';
import { RequestAppointmentSpecialtyComponent } from './request-appointment-specialty/request-appointment-specialty.component';
import { RequestAppointmentDoctorComponent } from './request-appointment-specialist/request-appointment-specialist.component';
import { RequestAppointmentDateComponent } from './request-appointment-date/request-appointment-date.component';
import { RequestAppointmentPatientComponent } from './request-appointment-patient/request-appointment-patient.component';

@NgModule({
  declarations: [
    ProfileComponent,
    LoaderComponent,
    NavbarComponent,
    CaptchaComponent,
    CaptchaDirective,
    SharedComponent,
    FooterComponent,
    RequestAppointmentComponent,
    RequestAppointmentSpecialtyComponent,
    RequestAppointmentDoctorComponent,
    RequestAppointmentDateComponent,
    RequestAppointmentPatientComponent,
  ],
  imports: [CommonModule, RouterModule, MatProgressBarModule, FormsModule],
  exports: [
    ProfileComponent,
    FooterComponent,
    NavbarComponent,
    CaptchaDirective,
    CaptchaComponent,
    RequestAppointmentComponent,
  ],
})
export class SharedModule {}
