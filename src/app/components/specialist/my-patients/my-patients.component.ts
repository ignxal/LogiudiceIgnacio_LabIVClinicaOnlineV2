import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import { SurveyValuesPipe } from 'src/app/pipes/survey-values.pipe';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { UserService } from 'src/app/services/user.service';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { MedicalHistoryService } from 'src/app/services/medicalhistory.service';
import Swal from 'sweetalert2';
import { Appointment } from 'src/app/models/appointment';
declare const Object: ObjectConstructor;
@Component({
  selector: 'app-my-patients',
  templateUrl: './my-patients.component.html',
  styleUrls: ['./my-patients.component.scss'],
})
export class MyPatientsComponent implements OnInit {
  appointmentsBySpecialist: any;
  patientsBySpecialist: any = [];
  patients: any;
  user: any;
  userData: any;
  patientAppointments: any;
  patientMedicalHistory: any;
  currentAppointment: any;

  constructor(
    public auth: AuthService,
    public userService: UserService,
    private loaderService: LoaderService,
    private appointmentsService: AppointmentsService,
    private medicalHistoryService: MedicalHistoryService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.getUserData();
  }

  getUserData() {
    this.userService
      .getOne(this.user.uid)
      .then((user: any) => {
        this.userData = user;
        this.appointmentsService
          .getAppointmentsBySpecialist(user.uid)
          .subscribe({
            next: (res: any) => {
              this.getPatients(res);
            },
            error: (err) => {
              console.error(err);
            },
          });
      })
      .catch((err: any) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Operación erronea!',
          text: 'Se produjo un error al intentar obtener datos',
        });
      });
  }

  getPatients(appointments: Appointment[]) {
    this.patientsBySpecialist = [];
    this.appointmentsBySpecialist = [];
    this.patients = '';
    this.loaderService.show();

    this.userService.getAllPatients().subscribe({
      next: (data: any) => {
        const patients = data;

        patients.forEach((patient: any) => {
          patient.appointmentDates = [];
          appointments.forEach((x: Appointment) => {
            if (patient.uid == x.id_patient) {
              this.patientsBySpecialist.push(patient);
              patient.appointmentDates.push(x.appointmentDate);
            }
          });
        });

        this.patientsBySpecialist = this.removeDuplicates(
          this.patientsBySpecialist
        );
        this.loaderService.hide();
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Operación erronea!',
          text: 'Se produjo un error al intentar obtener datos',
        });
      },
    });
  }

  removeDuplicates(arr: any) {
    return arr.filter((item: any, index: any) => arr.indexOf(item) === index);
  }

  openMedicalHistory(patient: any) {
    this.medicalHistoryService.getMedicalHistoryByPatient(patient).subscribe({
      next: (res: any) => {
        this.patientMedicalHistory = res;

        this.appointmentsService
          .getAppointmentsBySpecialistAndPatient(patient, this.userData.uid)
          .subscribe({
            next: (data: any) => {
              this.patientAppointments = data;
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

  download() {
    var today = new Date();
    var line = 20;
    today.toLocaleDateString('es-ES');
    let PDF = new jsPDF('p', 'mm', 'a4');
    let pageHeight = PDF.internal.pageSize.height - 10;

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
      `- Historial de atencion con el especialista: ${this.patientAppointments[0].doctor}`,
      10,
      line
    );
    line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
    this.patientAppointments.forEach(
      (element: {
        specialty: any;
        date: any;
        diagnosis: any;
        observations: { [x: string]: any };
        appointmentInfo: any;
      }) => {
        PDF.text(
          `----------------------------------------------------------------------`,
          15,
          line
        );
        line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
        PDF.text(`* Fecha: ${element.date}`, 15, line);
        line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
        PDF.text(`* Especialidad: ${element.specialty}`, 15, line);
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
          maxWidth: 160,
        });
        line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
      }
    );

    PDF.save(
      'historia-clinica' + '-' + this.patientMedicalHistory.patient + '.pdf'
    );
  }

  hasSurveyData(survey: any): boolean {
    return survey && Object.keys(survey).length > 0;
  }

  openSurvey(survey: any) {
    this.currentAppointment = {};

    this.currentAppointment['rate'] = survey.rate;
    this.currentAppointment['clarity'] = new SurveyValuesPipe()
      .transform(survey.clarity)!
      .toString();

    this.currentAppointment['feedback'] = survey.feedback;
  }
}
