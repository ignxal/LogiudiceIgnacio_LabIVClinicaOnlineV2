import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SpecialtiesPipe } from 'src/app/pipes/specialties.pipe';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { Appointment } from 'src/app/models/appointment';
import * as Highcharts from 'highcharts';
import { CapitalizeFirstLetterPipe } from 'src/app/pipes/capitalize-first-letter.pipe';

@Component({
  selector: 'app-appointments-specialty',
  templateUrl: './appointments-specialty.component.html',
  styleUrls: ['./appointments-specialty.component.scss'],
})
export class AppointmentsSpecialtyComponent implements OnInit {
  appointments: any = [];
  specialties: any = [];

  chart!: Highcharts.Chart;

  constructor(
    public auth: AuthService,
    public appointmentsService: AppointmentsService
  ) {}

  ngOnInit() {
    this.appointmentsService
      .getAppointments()
      .subscribe((appointments: any) => {
        this.appointments = appointments;
        this.appointments.forEach((appointment: Appointment) => {
          const specialty = new SpecialtiesPipe().transform(
            appointment.specialty
          );
          this.specialties.push(specialty);
        });
        const result = this.specialties.reduce(
          (json: any, val: any) => ({ ...json, [val]: (json[val] | 0) + 1 }),
          {}
        );

        const data2: { name: string; y: number }[] = Object.entries(result).map(
          ([key, value]) => ({
            name: new CapitalizeFirstLetterPipe().transform(key),
            y: Number(value),
          })
        );

        const colors = Highcharts.getOptions().colors.map((c, i) =>
          Highcharts.color(Highcharts.getOptions().colors[0])
            .brighten((i - 3) / 7)
            .get()
        );

        this.chart = Highcharts.chart(
          'chartContainer',
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
                data: data2,
              },
            ],
          },
          () => {}
        );
      });
  }

  downloadData() {
    html2canvas(document.getElementById('chartContainer')!).then(function (
      canvas
    ) {
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF();
      doc.text(`Cantidad de turnos solicitados por especialidad`, 10, 10);
      doc.addImage(imgData, 'PNG', 20, 50, 200, 80);
      doc.save('turnos-solicitados.pdf');
    });
  }
}
