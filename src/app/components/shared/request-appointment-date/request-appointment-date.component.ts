import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { UserM } from 'src/app/models/user';
import { Appointment, AppointmentStatus } from 'src/app/models/appointment';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-request-appointment-date',
  templateUrl: './request-appointment-date.component.html',
  styleUrls: ['./request-appointment-date.component.scss'],
})
export class RequestAppointmentDateComponent implements OnInit {
  @Input() doctor = '';
  @Input() patient = '';
  @Input() specialty = '';
  doctorAvailability: any[] = [];
  selectedDate: any;
  appointments: any[] = [];
  user: any;
  specialistName: any;
  currentSpecialist!: UserM;
  patientName: any;

  constructor(
    private loaderService: LoaderService,
    public auth: AuthService,
    public appointmentService: AppointmentsService,
    public datepipe: DatePipe,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this.auth.loggedUser;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['doctor']) {
      return;
    }
    this.user = this.auth.loggedUser;
    this.doctor = changes['doctor'].currentValue;

    if (this.user.role == 'Patient') {
      this.patient = this.user.uid;
    }

    this.appointments = [];
    this.loaderService.show();

    this.userService.getOne(this.doctor).then((specialist: UserM) => {
      this.currentSpecialist = specialist;
      this.specialistName = specialist.name;
      this.doctorAvailability = specialist.serviceHours;
      this.generateDaysData(this.doctorAvailability);

      this.appointmentService.getPatientAvailability(this.user.uid).subscribe({
        next: (resPat: any) => {
          if (resPat) {
            const finalArray = this.appointments.filter((y) => {
              return y !== resPat.appointmentDate;
            });
            this.appointments = finalArray;
          }

          this.loaderService.hide();
        },
        error: (err: any) => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Operación erronea!',
            text: 'Se produjo un error al intentar obtener datos',
          });
        },
      });
    });
  }

  generateDaysData(data: string | any[]) {
    var day: any;
    var startHour: any;
    var endHour: any;

    for (let i = 0; i < data.length; i++) {
      var dayArr = data[i].split('-');
      day = dayArr[0];
      startHour = dayArr[1];
      endHour = dayArr[2];
      this.generateDays(day, startHour, endHour);
    }
  }

  generateDates(startHour: any, endHour: any) {
    var times: any[] = [];
    var startHourArr = startHour.split(':');
    var endHourArr = endHour.split(':');
    var startHourNumber = parseInt(startHourArr[0]);
    var endHourNumber = parseInt(endHourArr[0]);
    var startMinuteNumber = parseInt(startHourArr[1]);
    var hour = startHourNumber;
    var minute = startMinuteNumber;
    var time = '';

    while (hour < endHourNumber) {
      if (minute == 0) {
        time = hour + ':' + minute + '0';
      } else {
        time = hour + ':' + minute;
      }
      times.push(time);
      minute += 30;
      if (minute == 60) {
        hour += 1;
        minute = 0;
      }
    }
    return times;
  }

  generateDays(day: any, startHour: any, endHour: any) {
    var hours = this.generateDates(startHour, endHour);
    var date = new Date();
    var dayOfWeek = date.getDay();
    var dayOfWeekNumber = this.getDayOfWeekNumber(day);
    var daysToAdd = dayOfWeekNumber - dayOfWeek;
    if (daysToAdd < 0) {
      daysToAdd += 7;
    }
    date.setDate(date.getDate() + daysToAdd);
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < hours.length; j++) {
        this.appointments.push(
          new Date(date).toLocaleDateString('af-ZA', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          }) +
            ' ' +
            hours[j]
        );
      }
      date.setDate(date.getDate() + 7);
    }
  }

  getDayOfWeekNumber(day: any) {
    switch (day) {
      case 'monday':
        return 1;
      case 'tuesday':
        return 2;
      case 'wednesday':
        return 3;
      case 'thursday':
        return 4;
      case 'friday':
        return 5;
      case 'saturday':
        return 6;
      default:
        return 0;
    }
  }

  selectApointment(e: any) {
    this.selectedDate = e.target.value;
  }

  createAppointment() {
    if (!this.specialistName || !this.selectedDate) {
      Swal.fire({
        icon: 'error',
        title: 'Operación erronea!',
        text: 'Seleccione todos los campos',
      });
      return;
    }

    this.loaderService.show();
    const newAppointment: Appointment = {
      id: '',
      specialty: this.specialty,
      id_patient: this.patient,
      id_specialist: this.currentSpecialist.uid,
      specialistName: this.specialistName,
      diagnosis: '',
      appointmentDate: this.selectedDate,
      status: AppointmentStatus.Pending,
      rate: 0,
      comments: '',
      survey: {},
    };
    this.appointmentService
      .reserve(newAppointment)
      .then((res) => {
        if (!res) {
          Swal.fire({
            icon: 'error',
            title: 'Operación erronea!',
            text: 'El horario se encuentra ocupado',
          });
        }
        Swal.fire({
          icon: 'success',
          title: 'Operación exitosa!',
          text: 'Se creo la cita correctamente',
        });
      })
      .catch((error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Operación erronea!',
          text: error,
        });
      })
      .finally(() => {
        location.reload();
        this.loaderService.hide();
      });
  }
}
