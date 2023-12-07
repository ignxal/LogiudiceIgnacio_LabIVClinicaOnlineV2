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
import { MedicalHistoryService } from 'src/app/services/medicalhistory.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MedicalRecord } from 'src/app/models/medical-record';
import { UserM } from 'src/app/models/user';

@Component({
  selector: 'app-appointments-specialist',
  templateUrl: './appointments-specialist.component.html',
  styleUrls: ['./appointments-specialist.component.scss'],
})
export class AppointmentsSpecialistComponent {
  specialtiesList: any;
  selectedSpecialty: any;
  patients: any;
  selectedPatient: any;
  user: any;
  userData: any;
  appointments: any;
  specialtySelected: boolean = false;
  patientSelected: boolean = false;
  currentAppointment!: Appointment;
  appointmentsBySpecialist: any;
  appointmentStatus!: AppointmentStatus;
  appointmentComments: any;
  appointmentDiagnostic: any;
  appointmentDate: any;
  patientsFromSpecialist: any = [];

  allAppointments: any;
  searchValue: string = '';

  form: FormGroup | undefined;
  public cancelReason = new FormControl('');
  public height = new FormControl('');
  public weight = new FormControl('');
  public temp = new FormControl('');
  public pressure = new FormControl('');
  public field1Key = new FormControl('');
  public field1Value = new FormControl('');
  public field2Key = new FormControl('');
  public field2Value = new FormControl('');
  public field3Key = new FormControl('');
  public field3Value = new FormControl('');
  public field4Key = new FormControl('');
  public field5Key = new FormControl('');
  public field5Value = new FormControl('');
  public field6Key = new FormControl('');
  public comment = new FormControl('');
  public diagnostic = new FormControl('');

  field4Value: any;
  field6Value: string = 'NO';

  constructor(
    private loaderService: LoaderService,
    public auth: AuthService,
    private appointmentsService: AppointmentsService,
    private medicalHistoryService: MedicalHistoryService,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.getUserData();
    this.form = this.fb.group({
      cancelReason: ['', Validators.required],
      comment: ['', Validators.required],
      diagnostic: ['', Validators.required],
      field1Key: [''],
      field1Value: [''],
      field2Key: [''],
      field2Value: [''],
      field3Key: [''],
      field3Value: [''],
      field4Key: [''],
      field5Key: [''],
      field5Value: [''],
      field6Key: [''],
      height: [''],
      weight: [''],
      temp: [''],
      pressure: [''],
    });
  }

  getUserData() {
    this.loaderService.show();
    this.userService.getOne(this.user.uid).then((user: any) => {
      this.userData = user;
      this.specialtiesList = user.specialty;

      this.appointmentsService
        .getAppointmentsBySpecialist(this.userData.uid)
        .subscribe({
          next: (res: any) => {
            this.allAppointments = res;
            this.appointments = res;
            this.getPatients(this.allAppointments);
          },
          error: (err: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Operación erronea!',
              text: 'Error al traer datos',
            });
            console.log(err);
          },
        });
    });
  }

  getPatients(specialistAppointments: any) {
    return this.userService.getAllPatients().subscribe({
      next: (res: any) => {
        const patients = res;
        this.patientsFromSpecialist = patients.filter((x: UserM) => {
          return specialistAppointments.some(
            (appointment: Appointment) => x.uid === appointment.id_patient
          );
        });
        this.patientsFromSpecialist = this.removeDuplicates(
          this.patientsFromSpecialist
        );
        this.loaderService.hide();
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Operación erronea!',
          text: 'Error al traer datos',
        });
        console.log(err);
      },
    });
  }

  removeDuplicates(arr: any) {
    return arr.filter((item: any, index: any) => arr.indexOf(item) === index);
  }

  getAppointmentsBySpecialty() {
    this.loaderService.show();
    this.appointmentsService
      .getAppointmentsBySpecialtyForSpecialist(
        this.userData.uid,
        this.selectedSpecialty
      )
      .subscribe({
        next: (res: any) => {
          this.appointments = res;
          this.loaderService.hide();
        },
        error: (err: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Operación erronea!',
            text: 'Error al traer datos',
          });
          console.log(err);
          this.loaderService.hide();
        },
      });
  }

  getAppointmentsByPatient() {
    this.loaderService.show();
    this.appointmentsService
      .getAppointmentsBySpecialistAndPatient(
        this.selectedPatient,
        this.userData.uid
      )
      .subscribe({
        next: (res: any) => {
          this.appointments = res;
          this.loaderService.hide();
        },
        error: (err: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Operación erronea!',
            text: 'Error al traer datos',
          });
          console.log(err);
          this.loaderService.hide();
        },
      });
  }

  selectSpecialty(e: any) {
    this.specialtySelected = true;
    this.patientSelected = false;
    console.log(e.target.value);
    this.selectedSpecialty = e.target.value;
    this.getAppointmentsBySpecialty();
  }

  selectPatient(e: any) {
    this.specialtySelected = false;
    this.patientSelected = true;
    this.selectedPatient = e.target.value;
    this.getAppointmentsByPatient();
  }

  openCancelOrRejectAppointment(appointment: Appointment, status: any) {
    this.currentAppointment = appointment;
    this.appointmentStatus = status;
  }

  openCloseAppointment(appointment: Appointment, status: any) {
    this.appointmentStatus = status;
    this.currentAppointment = appointment;
  }

  cancelOrRejectAppointment() {
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
            text: 'Turno finalizado',
          });

          this.loaderService.hide();
        })
        .then(() => {
          if (this.specialtySelected) {
            this.getAppointmentsBySpecialty();
          }
          if (this.patientSelected) {
            this.getAppointmentsByPatient();
          }
        })
        .finally(() => {
          this.cancelReason.setValue('');
        });
    }
  }

  closeAppointment() {
    if (
      this.comment.value == '' ||
      this.diagnostic.value == '' ||
      this.height.value == '' ||
      this.weight.value == '' ||
      this.temp.value == '' ||
      this.pressure.value == ''
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Operación erronea!',
        text: 'Complete todos los datos obligatorios del el formulario',
      });
      return;
    }
    this.loaderService.show();

    const reason =
      'Especialista' + ' ' + this.userData.name + ': ' + this.comment.value;

    let observations = new Map<string, string>();

    if (this.field1Key.value != '' && this.field1Value.value != '') {
      observations.set(this.field1Key.value!, this.field1Value.value!);
    }

    if (this.field2Key.value != '' && this.field2Value.value != '') {
      observations.set(this.field2Key.value!, this.field2Value.value!);
    }

    if (this.field3Key.value != '' && this.field3Value.value != '') {
      observations.set(this.field3Key.value!, this.field3Value.value!);
    }

    if (this.field4Key.value != '') {
      observations.set(this.field4Key.value!, this.field4Value);
    }

    if (this.field5Key.value != '' && this.field5Value.value != '') {
      observations.set(this.field5Key.value!, this.field5Value.value!);
    }

    if (this.field6Key.value != '') {
      observations.set(this.field6Key.value!, this.field6Value.toString());
    }

    const obj = Object.fromEntries(observations);
    const record: MedicalRecord = {
      id_patient: this.userData.uid,
      date: this.currentAppointment.appointmentDate,
      height: this.height.value || '',
      weight: this.weight.value || '',
      temp: this.temp.value || '',
      pressure: this.pressure.value || '',
      observations: obj,
    };
    this.medicalHistoryService
      .addOne(record)
      .then(() => {
        this.currentAppointment.comments = reason;
        this.currentAppointment.status = this.appointmentStatus;
        this.currentAppointment.diagnosis = this.diagnostic.value || '';

        this.appointmentsService
          .update(this.currentAppointment)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Operación exitosa!',
              text: 'Turno finalizado',
            });

            if (this.specialtySelected) {
              this.getAppointmentsBySpecialty();
            }
            if (this.patientSelected) {
              this.getAppointmentsByPatient();
            }
          })
          .finally(() => {
            this.cancelReason.setValue('');
            this.loaderService.hide();
          });
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  acceptAppointment(appointment: Appointment) {
    this.loaderService.show();
    appointment.status = AppointmentStatus.Accepted;
    this.appointmentsService
      .update(appointment)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Operación exitosa!',
          text: 'Turno aceptado',
        });

        this.loaderService.hide();
      })
      .then(() => {
        if (this.specialtySelected) {
          this.getAppointmentsBySpecialty();
        }
        if (this.patientSelected) {
          this.getAppointmentsByPatient();
        }
      })
      .finally(() => {
        this.field1Key.setValue('');
        this.field1Value.setValue('');
        this.field2Key.setValue('');
        this.field2Value.setValue('');
        this.field3Key.setValue('');
        this.field3Value.setValue('');
        this.field4Key.setValue('');
        this.field4Value = '';
        this.field5Key.setValue('');
        this.field5Value.setValue('');
        this.field6Key.setValue('');
        this.field6Value = 'NO';
        this.cancelReason.setValue('');
      });
  }

  openInfoAppointment(appointment: Appointment) {
    console.log(appointment);
    this.appointmentDiagnostic = appointment.diagnosis;
    this.appointmentDate = appointment.appointmentDate;
    this.appointmentStatus = appointment.status;
    this.appointmentComments = appointment.comments;
  }

  setField4Value(e: any) {
    console.log(e.target.value);
    this.field4Value = e.target.value;
  }

  setField6Value(e: any) {
    if (this.field6Value == 'NO') {
      this.field6Value = 'SI';
    } else {
      this.field6Value = 'NO';
    }
  }

  search() {
    this.appointments = [];
    let appointmentInfo = '';
    let date = '';
    let diagnosis = '';
    let doctor = '';
    let patient = '';
    let status = '';
    let statusFormated = '';
    let specialty = '';
    let specialtyFormated = '';
    let observations = '';
    let observationsFormated = '';

    if (this.searchValue == '') {
      Swal.fire({
        icon: 'error',
        title: 'Operación erronea!',
        text: 'Ingrese un criterio de busqueda',
      });
      return;
    }

    this.allAppointments.forEach(
      (element: {
        appointmentInfo: { toString: () => string } | undefined;
        date: { toString: () => string } | undefined;
        diagnosis: { toString: () => string } | undefined;
        doctor: { toString: () => string } | undefined;
        patient: { toString: () => string } | undefined;
        specialty: string | undefined;
        status: string | undefined;
        observations: string | undefined;
      }) => {
        if (element.appointmentInfo != undefined) {
          appointmentInfo = element.appointmentInfo.toString().toLowerCase();
        }

        if (element.date != undefined) {
          date = element.date.toString().toLowerCase();
        }

        if (element.diagnosis != undefined) {
          diagnosis = element.diagnosis.toString().toLowerCase();
        }

        if (element.doctor != undefined) {
          doctor = element.doctor.toString().toLowerCase();
        }

        if (element.patient != undefined) {
          patient = element.patient.toString().toLowerCase();
        }

        if (element.specialty != undefined) {
          specialty = element.specialty.toString().toLowerCase();
        }

        if (element.status != undefined) {
          status = element.status;
          statusFormated = new AppointmentStatusPipe()
            .transform(status)!
            .toString()
            .toLowerCase();
        }

        if (element.observations != undefined) {
          observations = element.observations;
          observationsFormated = JSON.stringify(observations)
            .toString()
            .toLowerCase();
        }

        if (
          appointmentInfo.includes(this.searchValue.toLowerCase()) ||
          date.includes(this.searchValue.toLowerCase()) ||
          diagnosis.includes(this.searchValue.toLowerCase()) ||
          doctor.includes(this.searchValue.toLowerCase()) ||
          patient.includes(this.searchValue.toLowerCase()) ||
          specialtyFormated.includes(this.searchValue.toLowerCase()) ||
          statusFormated.includes(this.searchValue.toLowerCase()) ||
          observationsFormated.includes(this.searchValue.toLowerCase())
        ) {
          this.appointments.push(element);
        }
      }
    );

    this.searchValue = '';
  }
}
