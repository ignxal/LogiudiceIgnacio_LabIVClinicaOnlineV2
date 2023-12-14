import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'specialties',
})
export class SpecialtiesPipe implements PipeTransform {
  transform(value: any): unknown {
    const specialty = value.toLowerCase();

    if (specialty == 'cardiology') {
      return 'Cardiologia';
    }

    if (specialty == 'dentist') {
      return 'Odontologia';
    }

    if (specialty == 'gastroenterology') {
      return 'Gastroenterologia';
    }

    if (specialty == 'neurology') {
      return 'Neurologia';
    }

    if (specialty == 'oftalmology') {
      return 'Oftalmologia';
    }

    if (specialty == 'radiology') {
      return 'Radiologia';
    }

    if (specialty == 'urology') {
      return 'Urologia';
    }

    if (specialty == 'traumatology') {
      return 'Traumatologia';
    }

    return specialty;
  }
}
