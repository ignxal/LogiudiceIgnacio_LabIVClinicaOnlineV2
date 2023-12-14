import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { MedicalHistoryService } from 'src/app/services/medicalhistory.service';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { jsPDF } from 'jspdf';
import Swal from 'sweetalert2';
import { UserM } from 'src/app/models/user';
import { Appointment, AppointmentStatus } from 'src/app/models/appointment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileSpecialtiesList: any[] = [];
  user: any;
  userData: UserM;
  patientAppointments: any;
  patientAppointmentsBySpecialty: any;
  day: string | undefined;
  days: any[] = [];
  specialty: any;
  patientMedicalHistory: any[] = [];
  myAppointments!: Appointment[];
  patientSpecialists!: any[];
  selectedSpecialistId!: number;

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
      .then((user: UserM) => {
        this.userData = user;

        if (user.role == 'Specialist') {
          this.appointmentService
            .getAppointmentsBySpecialist(user.uid)
            .subscribe({
              next: (res) => {
                this.myAppointments = res;
              },
              error: (err: any) => {
                console.error(err);
                Swal.fire({
                  icon: 'error',
                  title: 'Operación erronea!',
                  text: 'Se produjo un error al obtener datos',
                });
              },
            });
        } else if (user.role == 'Patient') {
          this.appointmentService.getAppointmentsByPatient(user.uid).subscribe({
            next: (res: Appointment[]) => {
              const closedAppointments = res.filter(
                (appointment) => appointment.status === AppointmentStatus.Closed
              );

              this.patientSpecialists = closedAppointments.reduce(
                (acc, appointment: Appointment) => {
                  const existingSpecialist = acc.find(
                    (item) => Object.keys(item)[0] === appointment.id_specialist
                  );

                  if (!existingSpecialist) {
                    acc.push({
                      [appointment.id_specialist]: appointment.specialistName,
                    });
                  }

                  return acc;
                },
                []
              );
              this.myAppointments = closedAppointments;
            },

            error: (err: any) => {
              console.error(err);
              Swal.fire({
                icon: 'error',
                title: 'Operación erronea!',
                text: 'Se produjo un error al obtener datos',
              });
            },
          });
        }
      })
      .finally(() => {
        this.loaderService.hide();
      });
  }

  getKey(obj: any): any {
    return obj ? Object.keys(obj)[0] : null;
  }

  getValue(obj: any): any {
    return obj ? obj[Object.keys(obj)[0]] : null;
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
    this.patientMedicalHistory = [];
    this.appointmentService
      .getMedicalHistoryBySpecialtyAndPatient(
        specialty,
        this.userData.uid,
        'Closed'
      )
      .subscribe({
        next: (res) => {
          this.patientAppointmentsBySpecialty = res;
          this.medicalHistoryService
            .getMedicalHistoryByPatient(this.userData.uid)
            .subscribe({
              next: (mh) => {
                mh.forEach((x) => {
                  this.patientAppointmentsBySpecialty.forEach((y: any) => {
                    if (x.specialty === y.specialty) {
                      this.patientMedicalHistory.push(x);
                    }
                  });
                });

                this.patientMedicalHistory = this.removeDuplicates(
                  this.patientMedicalHistory
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
  downloadAppointmentsPatientBySpecialist() {
    this.loaderService.show();

    this.appointmentService
      .getAppointmentsClosedBySpecialistAndPatient(
        this.userData.uid,
        this.selectedSpecialistId.toString()
      )
      .subscribe({
        next: (res: Appointment[]) => {
          this.generateHistoryPDF(
            res,
            `Historial de citas realizadas del especialista ${res[0].specialistName}`,
            'registro-atenciones' +
              '-' +
              this.userData.name +
              '-' +
              res[0].specialistName +
              '.pdf'
          );
          this.loaderService.hide();
        },
      });
  }

  generateHistoryPDF(
    appointments: Appointment[],
    pdftitle: string,
    pdfname: string
  ) {
    const today = new Date();
    let line = 20;
    today.toLocaleDateString('es-ES');
    const PDF = new jsPDF('p', 'mm', 'a4');
    let pageHeight = PDF.internal.pageSize.height - 10;

    PDF.text(pdftitle, 10, 10);
    PDF.addImage(
      'https://firebasestorage.googleapis.com/v0/b/clinica-online-v2.appspot.com/o/pageIcon.png?alt=media&token=11489f28-b897-47b6-9c41-cdc60d0a63da',
      'PNG',
      150,
      10,
      50,
      50
    );
    PDF.text(
      `Fecha de emision: ${today.toLocaleDateString('es-ES')}`,
      10,
      line
    );
    line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
    appointments.forEach((x: Appointment) => {
      PDF.text(
        `-----------------------------------------------------`,
        15,
        line
      );
      line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
      PDF.text(`* Fecha: ${x.appointmentDate}`, 15, line);
      line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
      PDF.text(`* Especialidad: ${x.specialty}`, 15, line);
      line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
      PDF.text(`* Paciente: ${x.patientName}`, 15, line);
      line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
    });
    PDF.save(pdfname);
  }

  downloadAppointmentsHistory() {
    this.loaderService.show();
    this.generateHistoryPDF(
      this.myAppointments,
      `Historial de citas realizadas del especialista ${
        this.userData.name + ' ' + this.userData.lastName
      }`,
      'registro-atenciones' + '-' + this.userData.name + '.pdf'
    );
    this.loaderService.hide();
  }

  download() {
    this.loaderService.show();
    const today = new Date();
    const PDF = new jsPDF('p', 'mm', 'a4');
    const pageHeight = PDF.internal.pageSize.height - 10;
    let line = 20;
    today.toLocaleDateString('es-ES');

    PDF.addImage(
      'https://firebasestorage.googleapis.com/v0/b/clinica-online-v2.appspot.com/o/pageIcon.png?alt=media&token=11489f28-b897-47b6-9c41-cdc60d0a63da',
      'PNG',
      150,
      10,
      50,
      50
    );
    PDF.text(
      `Fecha de creacion: ${today.toLocaleDateString('es-ES')}`,
      10,
      line
    );

    line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
    PDF.text(
      `Historia clínica de ${this.patientMedicalHistory[0].patientName}`,
      10,
      line
    );
    line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
    PDF.text(`-Datos ultimo control:`, 10, line);
    line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
    PDF.text(`* Altura: ${this.patientMedicalHistory[0].height} cm`, 15, line);
    line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
    PDF.text(`* Peso: ${this.patientMedicalHistory[0].weight} kgs`, 15, line);
    line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
    PDF.text(
      `* Temperatura: ${this.patientMedicalHistory[0].temp} ºC`,
      15,
      line
    );
    line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
    PDF.text(
      `* Presión: ${this.patientMedicalHistory[0].pressure} (media)`,
      15,
      line
    );
    line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);

    for (const key in this.patientMedicalHistory[0].observations) {
      PDF.text(
        `* ${key}: ${this.patientMedicalHistory[0].observations[key]}`,
        20,
        line
      );
      line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
    }
    line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
    PDF.text(
      `- Historial de atencion de la especialidad: ${this.specialty}`,
      10,
      line
    );
    line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
    this.patientAppointmentsBySpecialty.forEach((x: any) => {
      PDF.text(
        `----------------------------------------------------------------------`,
        15,
        line
      );
      line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
      PDF.text(`* Fecha: ${x.appointmentDate}`, 15, line);
      line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
      PDF.text(`* Especialista: ${x.specialistName}`, 15, line);
      line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
      PDF.text(`* Diagnostico: ${x.diagnosis}`, 15, line);
      line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
      PDF.text(`* Observaciones:`, 15, line);
      line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);

      PDF.text(`* Comentario de ${x.comments}`, 15, line, {
        maxWidth: 180,
      });
      line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
    });

    PDF.save(
      'historia-clínica' +
        '-' +
        this.patientMedicalHistory[0].patientName +
        '-' +
        this.specialty +
        '.pdf'
    );
    this.loaderService.hide();
  }
}
