import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { LoaderService } from 'src/app/services/loader.service';
import { UserM } from '../../../models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-request-appointment-patient',
  templateUrl: './request-appointment-patient.component.html',
  styleUrls: ['./request-appointment-patient.component.scss'],
})
export class RequestAppointmentPatientComponent implements OnInit {
  patients!: any;
  @Output() selectedPatientEvent = new EventEmitter<string>();

  constructor(
    private loaderService: LoaderService,
    public auth: AuthService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.loaderService.show();
    this.userService.getAllPatients().subscribe({
      next: (x: any) => {
        this.patients = x;
        this.loaderService.hide();
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Operación erronea!',
          text: 'Se produjo un error al intentar obtener la lista de pacientes',
        });
        this.loaderService.hide();
      },
    });
  }

  selectPatient(e: any) {
    this.selectedPatientEvent.emit(e.target.value);
  }
}
