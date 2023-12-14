import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { AppointmentsService } from 'src/app/services/appointments.service';
import * as Highcharts from 'highcharts';
import { LoaderService } from 'src/app/services/loader.service';
import Swal from 'sweetalert2';
import { Appointment } from 'src/app/models/appointment';

@Component({
  selector: 'app-appointments-per-day',
  templateUrl: './appointments-per-day.component.html',
  styleUrls: ['./appointments-per-day.component.scss'],
})
export class AppointmentsPerDayComponent implements OnInit {
  appointments: any = [];
  doctors: any = [];
  chart!: Highcharts.Chart;

  constructor(
    public auth: AuthService,
    public appointmentService: AppointmentsService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (appointments: Appointment[]) => {
        this.appointments = appointments;

        const dates = this.appointments.map((appointment: Appointment) => {
          const dateOnly = new Date(appointment.appointmentDate)
            .toISOString()
            .split('T')[0];
          return new Date(dateOnly);
        });

        const result = dates.reduce((json: any, val: Date) => {
          const utcTimestamp = Date.UTC(
            val.getUTCFullYear(),
            val.getUTCMonth(),
            val.getUTCDate()
          );

          return { ...json, [utcTimestamp]: (json[utcTimestamp] || 0) + 1 };
        }, {});

        const formattedData = Object.entries(result).map(([key, value]) => {
          return [Number(key), value];
        });

        this.chart = Highcharts.chart(
          'chartContainerPerDay',
          {
            xAxis: {
              type: 'datetime',
            },
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: 'bar',
            },
            title: {
              text: '',
            },
            plotOptions: {
              bar: {
                allowPointSelect: true,
                cursor: 'pointer',
                borderRadius: 5,
                opacity: 0.8,
              },
            },
            legend: {
              layout: 'vertical',
              floating: false,
              borderRadius: 0,
              borderWidth: 0,
            },
            series: [
              {
                type: 'bar',
                name: 'Cantidad',
                data: formattedData,
              },
            ],
          },
          () => {}
        );
      },
      error: (error: any) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Operación erronea!',
          text: 'Error al cargar datos',
        });
        this.loaderService.hide();
      },
    });
  }

  downloadData() {
    html2canvas(document.getElementById('chartContainerPerDay')!).then(
      function (canvas) {
        const imgData = canvas.toDataURL('image/png');
        const doc = new jsPDF();
        doc.text(`Cantidad de turnos por dia`, 10, 10);
        doc.addImage(imgData, 'PNG', 20, 50, 200, 80);
        doc.save('turnos-por-dia.pdf');
      }
    );
  }
}
