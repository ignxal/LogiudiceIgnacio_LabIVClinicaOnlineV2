import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'role',
})
export class RolePipe implements PipeTransform {
  transform(value: string): unknown {
    if (value == 'Admin') {
      return 'Administrador';
    }

    if (value == 'Specialist') {
      return 'Especialista';
    }

    if (value == 'Patient') {
      return 'Paciente';
    }

    return value;
  }
}
