import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appointmentStatus',
})
export class AppointmentStatusPipe implements PipeTransform {
  transform(value: any): unknown {
    if (value == 'Pending') {
      return 'Pendiente';
    }

    if (value == 'Canceled') {
      return 'Cancelado';
    }

    if (value == 'Rejected') {
      return 'Rechazado';
    }

    if (value == 'Accepted') {
      return 'Aceptado';
    }

    if (value == 'Closed') {
      return 'Finalizado';
    }

    return value;
  }
}
