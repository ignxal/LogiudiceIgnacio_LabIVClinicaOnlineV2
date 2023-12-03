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
import { SpecialtyService } from 'src/app/services/specialty.service';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.scss'],
})
export class MyAppointmentsComponent implements OnInit {
  specialtiesSub!: Subscription;
  appointmentsSub!: Subscription;
  specialtiesList: any;
  specialtiesByPatient: any = [];
  selectedSpecialty: any;
  doctors: any;
  doctorsByPatient: any = [];
  selectedDoctor: any;
  user: any;
  userData: any;
  appointments: any;
  appointmentsByPatient: any;
  specialtySelected: boolean = false;
  doctorSelected: boolean = false;
  appointment!: Appointment;
  appointmentNewStatus!: AppointmentStatus;
  appointmentDiagnostic!: string;
  appointmentDate!: Date;
  appointmentStatus!: AppointmentStatus;
  appointmentComments!: any;
  appointmentRate: number = 0;
  doctorClarity: string = '';
  allAppointments!: Appointment[];
  searchValue: string = '';

  form!: FormGroup;
  public cancelReason = new FormControl('');
  public personalOpinion = new FormControl('');

  constructor(
    private loaderService: LoaderService,
    public auth: AuthService,
    private userService: UserService,
    private speService: SpecialtyService,
    private appointmentsService: AppointmentsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.user = this.auth.loggedUser;
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
        this.appointmentsService
          .getAppointmentsByPatient(this.userData.uid)
          .subscribe({
            next: (res) => {
              this.allAppointments = res;
              this.loaderService.hide();
            },
            error: (err) => {
              console.error(err);
            },
          });
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

    this.specialtiesSub = this.speService.getAll().subscribe({
      next: (s) => {
        this.specialtiesList = s.map((x) => x.name);

        this.appointmentsSub = this.appointmentsService
          .getAppointmentsByPatient(this.userData.uid)
          .subscribe({
            next: (x) => {
              this.appointmentsByPatient = x;
              this.specialtiesList.forEach((specialty: any) => {
                this.appointmentsByPatient.forEach((appointment: any) => {
                  if (specialty == appointment.specialty) {
                    this.specialtiesByPatient.push(specialty);
                  }
                });
              });
              this.specialtiesByPatient = this.removeDuplicates(
                this.specialtiesByPatient
              );
              this.loaderService.hide();
            },
            error: (err) => {
              console.error(err);
              Swal.fire({
                icon: 'error',
                title: 'Operación erronea!',
                text: 'Se produjo un error al intentar obtener la lista de usuarios',
              });
            },
          });
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Operación erronea!',
          text: 'Se produjo un error al intentar obtener la lista de usuarios',
        });
      },
    });
  }

  getSpecialists() {
    this.doctorsByPatient = [];
    this.loaderService.show();
    this.userService.getAllSpecialists().subscribe({
      next: (res) => {
        this.doctors = res;

        this.appointmentsService
          .getAppointmentsByPatient(this.userData.uid)
          .subscribe({
            next: (data) => {
              this.appointmentsByPatient = data;
              this.doctors.forEach((doctor: any) => {
                this.appointmentsByPatient.forEach((appointment: any) => {
                  if (doctor.uid == appointment.id_specialist) {
                    this.doctorsByPatient.push(doctor);
                  }
                });
              });

              this.doctorsByPatient = this.removeDuplicates(
                this.doctorsByPatient
              );

              this.loaderService.hide();
            },
            error: (err) => {
              console.error(err);
            },
          });
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  removeDuplicates(arr: any) {
    return arr.filter((item: any, index: any) => arr.indexOf(item) === index);
  }

  getAppointmentsBySpecialty() {
    this.loaderService.show();

    this.appointmentsService
      .getAppointmentsBySpecialtyForPatient(
        this.userData.uid,
        this.selectedSpecialty
      )
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
      .getAppointmentsBySpecialistAndPatient(
        this.userData.uid,
        this.selectedDoctor
      )
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
    this.appointment = appointment;
    this.appointmentNewStatus = status;
  }

  cancelAppointment() {
    if (this.cancelReason.value == '') {
      Swal.fire({
        icon: 'error',
        title: 'Operación erronea!',
        text: 'Ingrese la razón de la cancelación',
      });
    } else {
      this.loaderService.show();
      var role;
      if (this.userData.role == 'Patient') {
        role = 'Paciente';
      } else if (this.userData.role == 'Doctor') {
        role = 'Especialista';
      } else if (this.userData.role == 'Admin') {
        role = 'Administrador';
      }
      const reason =
        role + ' ' + this.userData.name + ': ' + this.cancelReason.value;
      this.appointment.comments = reason;
      this.appointment.status = this.appointmentNewStatus;
      this.appointmentsService
        .update(this.appointment)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Operación exitosa!',
            text: 'El turno fue cancelado correctamente',
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
    this.loaderService.show();
    this.appointmentDiagnostic = appointment.diagnosis;
    this.appointmentDate = appointment.appointmentDate;
    this.appointmentStatus = appointment.status;
    this.appointmentComments = appointment.comments;
    this.loaderService.hide();
  }

  openSurvey(appointment: any) {
    this.appointment = appointment;
  }

  surveyAppointment() {
    if (
      this.personalOpinion.value == '' ||
      this.doctorClarity == '' ||
      this.appointmentRate == 0
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Operación erronea!',
        text: 'Falta completar campos',
      });
      return;
    }

    this.appointment.survey = {
      feedback: this.personalOpinion.value,
      clarity: this.doctorClarity,
      rate: this.appointmentRate,
    };

    this.appointmentsService
      .update(this.appointment)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Operación exitosa!',
          text: 'La encuesta fue registrada exitosamente',
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
        this.personalOpinion.setValue('');
        this.doctorClarity = '';
        this.appointmentRate = 0;
      });
  }

  openRateAppointment(appointment: any) {
    this.appointment = appointment;
  }

  rateAppointment() {
    if (this.appointmentRate == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Operación erronea!',
        text: 'Falta completar campos',
      });
      return;
    }

    this.loaderService.show();
    this.appointment.rate = this.appointmentRate;
    this.appointmentsService
      .update(this.appointment)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Operación exitosa!',
          text: 'La calificación fue registrada exitosamente',
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
      });
  }

  rate(e: any) {
    this.appointmentRate = e.target.value;
  }

  clarity(e: any) {
    console.log(e.target.value);
    this.doctorClarity = e.target.value;
  }

  search() {
    this.appointments = [];
    let date = '';
    let diagnosis = '';
    let specialistName = '';
    let status = '';
    let statusFormated = '';
    let specialty = '';
    let comments = '';
    let commentsFormated = '';

    if (this.searchValue == '') {
      Swal.fire({
        icon: 'error',
        title: 'Operación erronea!',
        text: 'Falta completar campos',
      });
      return;
    }

    this.allAppointments.forEach((element) => {
      if (element.appointmentDate) {
        date = element.appointmentDate.toString().toLowerCase();
      }

      if (element.diagnosis) {
        diagnosis = element.diagnosis.toString().toLowerCase();
      }

      if (element.specialistName) {
        specialistName = element.specialistName.toString().toLowerCase();
      }

      if (element.specialty) {
        specialty = element.specialty.toString().toLowerCase();
      }

      if (element.status) {
        status = element.status;
        statusFormated = new AppointmentStatusPipe()
          .transform(status)!
          .toString()
          .toLowerCase();
      }

      if (element.comments) {
        comments = element.comments;
        commentsFormated = JSON.stringify(comments).toString().toLowerCase();
      }

      if (
        date.includes(this.searchValue.toLowerCase()) ||
        diagnosis.includes(this.searchValue.toLowerCase()) ||
        specialistName.includes(this.searchValue.toLowerCase()) ||
        specialty.includes(this.searchValue.toLowerCase()) ||
        statusFormated.includes(this.searchValue.toLowerCase()) ||
        commentsFormated.includes(this.searchValue.toLowerCase())
      ) {
        this.appointments.push(element);
      }
    });

    this.searchValue = '';
  }
}
