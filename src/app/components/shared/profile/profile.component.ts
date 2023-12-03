import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { MedicalHistoryService } from 'src/app/services/medicalhistory.service';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { jsPDF } from 'jspdf';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileSpecialtiesList: any[] = [];
  user: any;
  userData: any;
  patientAppointments: any;
  patientAppointmentsBySpecialty: any;
  day: string | undefined;
  days: any[] = [];
  specialty: any;
  patientMedicalHistory: any;

  daysData: Array<any> = [
    { name: 'Lunes', value: 'Lunes' },
    { name: 'Martes', value: 'Martes' },
    { name: 'Miercoles', value: 'Miercoles' },
    { name: 'Jueves', value: 'Jueves' },
    { name: 'Viernes', value: 'Viernes' },
    { name: 'Sabado', value: 'Sabado' },
    { name: 'Domingo', value: 'Domingo' },
  ];

  constructor(
    public auth: AuthService,
    private loaderService: LoaderService,
    private userService: UserService,
    private appointmentService: AppointmentsService,
    private medicalHistoryService: MedicalHistoryService
  ) {}

  ngOnInit(): void {
    this.loaderService.show();
    this.user = this.auth.loggedUser;
    this.userService
      .getOne(this.user.uid)
      .then((user: any) => {
        this.userData = user;
      })
      .finally(() => {
        this.loaderService.hide();
      });
  }

  removeDuplicates(arr: any) {
    return arr.filter((item: any, index: any) => arr.indexOf(item) === index);
  }

  onCheckboxChange(event: any) {
    if (event.target.checked) {
      this.checkDay(event.target.value);
      return;
    }

    this.days = this.days.filter((item) => item !== event.target.value);
  }

  checkDay(day: any) {
    const currentDate = day.split('-');

    if (!currentDate[1] || !currentDate[2]) {
      Swal.fire({
        icon: 'error',
        title: 'Operación erronea!',
        text: 'Debe completar los horarios de atención',
      });
      return;
    }

    if (currentDate[1] > currentDate[2]) {
      Swal.fire({
        icon: 'error',
        title: 'Operación erronea!',
        text: 'La hora de inicio no puede ser mayor a la hora de fin',
      });
      return;
    }

    if (currentDate[1] == currentDate[2]) {
      Swal.fire({
        icon: 'error',
        title: 'Operación erronea!',
        text: 'La hora de inicio no puede ser igual a la hora de fin',
      });
      return;
    }

    if (currentDate[1] < '08:00' || currentDate[2] > '18:00') {
      Swal.fire({
        icon: 'error',
        title: 'Operación erronea!',
        text: 'La hora de inicio no puede ser por fuera del horario de atencion',
      });
    }

    this.days.push(day);
  }

  updateServiceHours() {
    this.loaderService.show();
    this.userData.serviceHours = this.days;

    this.userService
      .update(this.userData)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Operación exitosa!',
          text: 'Horarios de atención actualizados',
        });

        this.userService.getOne(this.userData.uid).then((user: any) => {
          this.userData = user;
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

  loadMedicalHistory() {
    console.log(this.userData.uid);
    this.appointmentService
      .getAppointmentsByPatient(this.userData.uid)
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res.length < 1) {
            Swal.fire({
              icon: 'error',
              title: 'No se encontro historial médico!',
              text: 'Obtenga el suyo atentiendose con los profesionales',
            });
            return;
          }

          this.patientAppointments = res;
          this.patientAppointments.forEach((element: { specialty: any }) => {
            this.profileSpecialtiesList.push(element.specialty);
          });
          this.profileSpecialtiesList = this.removeDuplicates(
            this.profileSpecialtiesList
          );
          this.loaderService.hide();
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Operación erronea!',
            text: err,
          });
        },
      });
  }

  createMedicalHistoryBySpecialty(specialty: any) {
    this.specialty = specialty;

    this.appointmentService
      .getMedicalHistoryBySpecialtyAndPatient(
        specialty,
        this.userData.uid,
        'closed'
      )
      .subscribe({
        next: (res) => {
          this.patientAppointmentsBySpecialty = res;
          this.medicalHistoryService
            .getMedicalHistoryByPatient(this.userData.uid)
            .subscribe({
              next: (mh) => {
                this.patientMedicalHistory = mh;
                this.loaderService.hide();
              },
              error: (err: any) => {
                console.error(err);
                Swal.fire({
                  icon: 'error',
                  title: 'Operación erronea!',
                  text: err,
                });
              },
            });
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Operación erronea!',
            text: err,
          });
        },
      });
  }

  download() {
    var today = new Date();
    var line = 20;
    today.toLocaleDateString('es-ES');
    let PDF = new jsPDF('p', 'mm', 'a4');
    let pageHeight = PDF.internal.pageSize.height - 10;

    PDF.addImage('../../../assets/common/logo.png', 'PNG', 150, 10, 50, 50);
    PDF.text(
      `Fecha de creacion: ${today.toLocaleDateString('es-ES')}`,
      10,
      line
    );
    line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
    PDF.text(
      `Historia clínica de ${this.patientMedicalHistory.patient}`,
      10,
      line
    );
    line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
    PDF.text(`-Datos ultimo control:`, 10, line);
    line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
    PDF.text(`* Altura: ${this.patientMedicalHistory.height} cm`, 15, line);
    line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
    PDF.text(`* Peso: ${this.patientMedicalHistory.weight} kgs`, 15, line);
    line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
    PDF.text(`* Temperatura: ${this.patientMedicalHistory.temp} ºC`, 15, line);
    line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
    PDF.text(
      `* Presión: ${this.patientMedicalHistory.pressure} (media)`,
      15,
      line
    );
    line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
    PDF.text(
      `- Historial de atencion de la especialidad: ${this.specialty}`,
      10,
      line
    );
    line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
    this.patientAppointmentsBySpecialty.forEach((element: any) => {
      PDF.text(
        `----------------------------------------------------------------------`,
        15,
        line
      );
      line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
      PDF.text(`* Fecha: ${element.date}`, 15, line);
      line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
      PDF.text(`* Especialista: ${element.doctor}`, 15, line);
      line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
      PDF.text(`* Diagnostico: ${element.diagnosis}`, 15, line);
      line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
      PDF.text(`* Observaciones:`, 15, line);
      line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
      for (var key in element.observations) {
        PDF.text(`* ${key}: ${element.observations[key]}`, 20, line);
        line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
      }
      PDF.text(`* Comentario de ${element.appointmentInfo}`, 15, line, {
        maxWidth: 180,
      });
      line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
    });

    PDF.save(
      'historia-clínica' +
        '-' +
        this.patientMedicalHistory.patient +
        '-' +
        this.specialty +
        '.pdf'
    );
  }
}