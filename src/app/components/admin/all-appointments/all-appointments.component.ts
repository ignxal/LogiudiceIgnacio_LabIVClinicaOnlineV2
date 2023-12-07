import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AppointmentStatusPipe } from 'src/app/pipes/appointment-status.pipe';
import { AppointmentStatus, Appointment } from 'src/app/models/appointment';
import { LoaderService } from 'src/app/services/loader.service';
import { AuthService } from 'src/app/services/auth.service';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { SpecialtyService } from 'src/app/services/specialty.service';
import { MedicalHistoryService } from 'src/app/services/medicalhistory.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MedicalRecord } from 'src/app/models/medical-record';
import { UserM } from 'src/app/models/user';

@Component({
  selector: 'app-all-appointments',
  templateUrl: './all-appointments.component.html',
  styleUrls: ['./all-appointments.component.scss'],
})
export class AllAppointmentsComponent {
  specialtiesList: any;
  selectedSpecialty: any;
  doctors: any;
  selectedDoctor: any;
  user: any;
  userData: any;
  appointments: any;
  specialtySelected: boolean = false;
  doctorSelected: boolean = false;
  appointmentUID: any;
  appointmentInfo: any;
  appointmentDiagnostic: any;
  appointmentDate: any;
  appointmentStatus: any;
  appointmentComments: any;
  currentAppointment!: Appointment;

  form: FormGroup | undefined;
  public cancelReason = new FormControl('');
  public personalOpinion = new FormControl('');

  constructor(
    private loaderService: LoaderService,
    public auth: AuthService,
    private appointmentsService: AppointmentsService,
    private speService: SpecialtyService,
    private medicalHistoryService: MedicalHistoryService,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.getUserData();
    this.form = this.fb.group({
      cancelReason: ['', Validators.required],
      personalOpinion: ['', Validators.required],
    });
  }

  getUserData() {
    this.userService
      .getOne(this.user.uid)
      .then((user: any) => {
        this.userData = user;

        this.getSpecialists();
        this.getSpecialties();
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Operación erronea!',
          text: 'Se produjo un error al intentar obtener los datos de usuarios',
        });
      });
  }

  getSpecialties() {
    this.loaderService.show();
    this.speService.getAll().subscribe({
      next: (s) => {
        this.specialtiesList = s.map((x) => x.name);
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Operación erronea!',
          text: 'Se produjo un error al intentar obtener la lista de especialidades',
        });
      },
    });
  }

  getSpecialists() {
    this.loaderService.show();
    this.userService.getAllSpecialists().subscribe({
      next: (res) => {
        this.doctors = res;
        this.loaderService.hide();
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Operación erronea!',
          text: 'Se produjo un error al intentar obtener la lista de especialistas',
        });
      },
    });
  }

  getAppointmentsBySpecialty() {
    this.loaderService.show();

    this.appointmentsService
      .getAppointmentsBySpecialty(this.selectedSpecialty)
      .subscribe({
        next: (res) => {
          this.appointments = res;
          this.loaderService.hide();
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  getAppointmentsBySpecialist() {
    this.loaderService.show();

    this.appointmentsService
      .getAppointmentsBySpecialist(this.selectedDoctor)
      .subscribe({
        next: (res) => {
          this.appointments = res;
          this.loaderService.hide();
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  selectSpecialty(e: any) {
    this.specialtySelected = true;
    this.doctorSelected = false;
    console.log(e.target.value);
    this.selectedSpecialty = e.target.value;
    this.getAppointmentsBySpecialty();
  }

  selectDoctor(e: any) {
    this.specialtySelected = false;
    this.doctorSelected = true;
    this.selectedDoctor = e.target.value;
    this.getAppointmentsBySpecialist();
  }

  openCancelOrRejectAppointment(appointment: any, status: any) {
    this.currentAppointment = appointment;
    this.appointmentStatus = status;
  }

  cancelAppointment() {
    if (this.cancelReason.value == '') {
      Swal.fire({
        icon: 'error',
        title: 'Operación erronea!',
        text: 'Ingrese el motivo de la cancelación/rechazo',
      });
    } else {
      this.loaderService.show();

      this.currentAppointment.comments =
        this.userData.role +
        ' ' +
        this.userData.name +
        ': ' +
        this.cancelReason.value;
      this.currentAppointment.status = this.appointmentStatus;
      this.appointmentsService
        .update(this.currentAppointment)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Operación exitosa!',
            text: 'Turno Cancelado',
          });

          this.loaderService.hide();
        })
        .then(() => {
          if (this.specialtySelected) {
            this.getAppointmentsBySpecialty();
          }
          if (this.doctorSelected) {
            this.getAppointmentsBySpecialist();
          }
        })
        .finally(() => {
          this.cancelReason.setValue('');
        });
    }
  }

  openInfoAppointment(appointment: any) {
    console.log(appointment);
    this.appointmentDiagnostic = appointment.diagnosis;
    this.appointmentDate = appointment.appointmentDate;
    this.appointmentStatus = appointment.status;
    this.appointmentComments = appointment.comments;
  }
}
