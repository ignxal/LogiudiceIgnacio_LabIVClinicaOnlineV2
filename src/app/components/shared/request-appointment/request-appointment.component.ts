import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-request-appointment',
  templateUrl: './request-appointment.component.html',
  styleUrls: ['./request-appointment.component.scss'],
})
export class RequestAppointmentComponent implements OnInit {
  user: any;
  specialty: any;
  doctor: any;
  patient: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.setUserType();
  }

  setUserType() {
    this.user = this.authService.loggedUser?.role;
  }

  selectedSpecialty(code: string) {
    this.specialty = code;
  }

  selectedDoctor(code: string) {
    this.doctor = code;
  }

  selectedPatient(code: string) {
    this.patient = code;
  }
}
