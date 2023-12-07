import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { LoaderService } from 'src/app/services/loader.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { UserM } from 'src/app/models/user';
import { Appointment } from 'src/app/models/appointment';
import { RolePipe } from 'src/app/pipes/role.pipe';

@Component({
  selector: 'app-userlist-admin',
  templateUrl: './userlist-admin.component.html',
  styleUrls: ['./userlist-admin.component.scss'],
})
export class UserlistAdminComponent implements OnInit {
  usersData: any[] = [];
  patientMedicalHistory: any;
  userData: any;
  patientAppointments: any;
  appointmentsBySpecialist: any;
  patientsBySpecialist: any = [];
  patients: any;
  users: any[] = [];
  isCard = true;

  constructor(
    private userService: UserService,
    private loaderService: LoaderService,
    private appointmentsService: AppointmentsService
  ) {}

  ngOnInit(): void {
    this.getUsersData();
  }

  getUsersData() {
    this.loaderService.show();

    this.userService.getAllUsers().subscribe({
      next: (users: any) => {
        this.usersData = users.filter((x: UserM) => {
          return x.role !== 'Admin';
        });
        this.loaderService.hide();
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Operación erronea!',
          text: 'Se produjo un error al intentar obtener la lista de usuarios',
        });
        this.loaderService.hide();
      },
    });
  }

  downloadData() {
    this.loaderService.show();
    var table_elt = document.getElementById('users-table');
    var workbook = XLSX.utils.table_to_book(table_elt);
    var ws = workbook.Sheets['Sheet1'];
    XLSX.utils.sheet_add_aoa(ws, [['Created ' + new Date().toISOString()]], {
      origin: -1,
    });
    XLSX.writeFile(workbook, 'lista-usuarios.xlsx');
    this.loaderService.hide();
  }

  downloadAppointments(user: UserM) {
    this.loaderService.show();
    if (user.role == 'Specialist') {
      this.appointmentsService.getAppointmentsBySpecialist(user.uid).subscribe({
        next: (res) => {
          this.generatePDF(res, user.name, user.role);
        },
        error: (err) => {
          console.error(err);
        },
      });
    }

    if (user.role == 'Patient') {
      this.appointmentsService.getAppointmentsByPatient(user.uid).subscribe({
        next: (res) => {
          this.generatePDF(res, user.name, user.role);
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

  generatePDF(data: any, name: any, role: any) {
    if (role == 'Specialist') {
      var today = new Date();
      var line = 20;
      today.toLocaleDateString('es-ES');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let pageHeight = PDF.internal.pageSize.height - 10;

      PDF.text(`Historial de citas del especialista ${name}`, 10, 10);
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
      data.forEach((x: Appointment) => {
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
      PDF.save('registro-atenciones' + '-' + name + '.pdf');
    }

    if (role == 'Patient') {
      var today = new Date();
      var line = 20;
      today.toLocaleDateString('es-ES');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let pageHeight = PDF.internal.pageSize.height - 10;

      PDF.text(`Historial de citas del paciente ${name}`, 10, 10);
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
      data.forEach((x: Appointment) => {
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
        PDF.text(`* Especialista: ${x.specialistName}`, 15, line);
        line > pageHeight ? (PDF.addPage(), (line = 20)) : (line += 10);
      });
      PDF.save('registro-atenciones' + '-' + name + '.pdf');
    }
    this.loaderService.hide();
  }

  changeStyle() {
    this.isCard = !this.isCard;
  }
}
