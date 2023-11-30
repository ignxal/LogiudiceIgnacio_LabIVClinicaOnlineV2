import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appointmentStatus',
})
export class AppointmentStatusPipe implements PipeTransform {
  transform(value: any): unknown {
    var status = value;

    if (status == 'Pending') {
      status = 'Pendiente';
    }

    if (status == 'Canceled') {
      status = 'Cancelado';
    }

    if (status == 'Rejected') {
      status = 'Rechazado';
    }

    if (status == 'Accepted') {
      status = 'Aceptado';
    }

    if (status == 'Closed') {
      status = 'Finalizado';
    }

    return status;
  }
}
