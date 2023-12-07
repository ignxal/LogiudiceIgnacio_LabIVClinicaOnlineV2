import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { UserM } from 'src/app/models/user';
import { Appointment, AppointmentStatus } from 'src/app/models/appointment';
import { Availability } from 'src/app/models/availability';

@Component({
  selector: 'app-request-appointment-date',
  templateUrl: './request-appointment-date.component.html',
  styleUrls: ['./request-appointment-date.component.scss'],
})
export class RequestAppointmentDateComponent implements OnInit {
  @Input() doctor = '';
  @Input() patient = '';
  @Input() specialty = '';
  selectedDate: any;
  appointments: any[] = [];
  user: any;
  specialistName: any;
  currentSpecialist!: UserM;
  patientName!: string;

  constructor(
    private loaderService: LoaderService,
    public auth: AuthService,
    public appointmentService: AppointmentsService,
    public datepipe: DatePipe,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this.auth.loggedUser;
    this.patientName = this.user.name;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['doctor']) {
      this.appointments = [];
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
      this.generateDaysData(specialist.serviceHours);

      this.appointmentService
        .getAppointmentsBySpecialist(specialist.uid)
        .subscribe({
          next: (specialistAppointments: any) => {
            const datesSpecialist = specialistAppointments.map((x: any) => {
              return x.appointmentDate;
            });

            if (specialistAppointments) {
              this.appointments = this.appointments.filter((y) => {
                return !specialistAppointments.includes(y);
              });
            }

            this.appointmentService
              .getPatientAvailability(this.user.uid)
              .subscribe({
                next: (resPat: any) => {
                  const datesPatient = resPat.map((x: any) => {
                    return x.appointmentDate;
                  });

                  if (datesPatient) {
                    this.appointments = this.appointments.filter((y) => {
                      return !datesPatient.includes(y);
                    });
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

  generateDaysData(availabilityList: string[]) {
    availabilityList.forEach((availability) => {
      const [day, startHour, endHour] = availability.split('-');
      this.generateDays(day, startHour, endHour);
    });
  }

  generateDates(startHour: string, endHour: string): string[] {
    const times: string[] = [];
    const [startHourNumber, startMinuteNumber] = startHour
      .split(':')
      .map(Number);
    const [endHourNumber] = endHour.split(':').map(Number);

    let hour = startHourNumber;
    let minute = startMinuteNumber;

    while (hour < endHourNumber) {
      const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;
      times.push(`${hour}:${formattedMinute}`);

      minute += 30;

      if (minute === 60) {
        hour += 1;
        minute = 0;
      }
    }

    return times;
  }

  generateDays(day: string, startHour: string, endHour: string) {
    const hours = this.generateDates(startHour, endHour);
    const date = new Date();
    const dayOfWeek = date.getDay();
    const dayOfWeekNumber = this.getDayOfWeekNumber(day);
    let daysToAdd = dayOfWeekNumber - dayOfWeek;

    if (daysToAdd < 0) {
      daysToAdd += 7;
    }

    date.setDate(date.getDate() + daysToAdd);

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < hours.length; j++) {
        const formattedDate = new Date(date).toLocaleDateString('af-ZA', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        });
        this.appointments.push(`${formattedDate} ${hours[j]}`);
      }
      date.setDate(date.getDate() + 7);
    }
  }

  getDayOfWeekNumber(day: string): number {
    switch (day.toLowerCase()) {
      case 'lunes':
        return 1;
      case 'martes':
        return 2;
      case 'miercoles':
        return 3;
      case 'jueves':
        return 4;
      case 'viernes':
        return 5;
      case 'sabado':
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
      patientName: this.patientName,
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
        }).then(() => {
          location.reload();
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
        this.loaderService.hide();
      });
  }
}
