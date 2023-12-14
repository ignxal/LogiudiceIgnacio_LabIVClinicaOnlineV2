import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { AppointmentsService } from 'src/app/services/appointments.service';
import * as Highcharts from 'highcharts';
import { RandomNumberPipe } from 'src/app/pipes/random-number.pipe';

@Component({
  selector: 'app-appointments-ended',
  templateUrl: './appointments-ended.component.html',
  styleUrls: ['./appointments-ended.component.scss'],
})
export class AppointmentsEndedComponent implements OnInit {
  appointments: any = [];
  doctors: any = [];
  chart!: Highcharts.Chart;

  constructor(
    public auth: AuthService,
    public appointmentService: AppointmentsService
  ) {}

  ngOnInit(): void {
    this.appointmentService
      .getFinishedAppointments()
      .subscribe((appointments: any) => {
        this.appointments = appointments;
        this.appointments.forEach((appointment: any) => {
          this.doctors.push(appointment.specialistName);
        });
        const result = this.doctors.reduce(
          (json: any, val: any) => ({ ...json, [val]: (json[val] | 0) + 1 }),
          {}
        );

        const amountByDoctor: { name: string; y: number }[] = Object.entries(
          result
        ).map(([key, value]) => ({
          name: key,
          y: Number(value),
        }));

        const colors = Highcharts.getOptions().colors.map((c, i) =>
          Highcharts.color(
            Highcharts.getOptions().colors[new RandomNumberPipe().transform()]
          )
            .brighten((i - 3) / 7)
            .get()
        );

        this.chart = Highcharts.chart(
          'chartContainerEnded',
          {
            chart: {
              backgroundColor: 'rgb(45, 49, 51)',
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: 'pie',
            },
            title: {
              text: '',
            },
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                colors,
                borderRadius: 5,
                opacity: 0.8,
                dataLabels: [
                  {
                    color: '#fff',
                    enabled: true,
                    format: '<b>{point.name}</b>',
                    distance: 0,
                  },
                  {
                    color: '#fff',
                    enabled: true,
                    format: '<b>{point.percentage:.1f} %</b>',
                    distance: -75,
                  },
                ],
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
                type: 'pie',
                name: 'Cantidad',
                data: amountByDoctor,
              },
            ],
          },
          () => {}
        );
      });
  }

  downloadData() {
    html2canvas(document.getElementById('chartContainerEnded')!).then(function (
      canvas
    ) {
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF();
      doc.text(`Cantidad de turnos finalizados por especialista`, 10, 10);
      doc.addImage(imgData, 'PNG', 20, 50, 200, 80);
      doc.save('turnos-finalizados-por-especialista.pdf');
    });
  }
}
