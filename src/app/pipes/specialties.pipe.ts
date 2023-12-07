import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'specialties',
})
export class SpecialtiesPipe implements PipeTransform {
  transform(value: any): unknown {
    let specialty = value.toLowerCase();

    if (specialty == 'cardiology') {
      specialty = 'Cardiologia';
    }

    if (specialty == 'dentist') {
      specialty = 'Odontologia';
    }

    if (specialty == 'gastroenterology') {
      specialty = 'Gastroenterologia';
    }

    if (specialty == 'neurology') {
      specialty = 'Neurologia';
    }

    if (specialty == 'oftalmology') {
      specialty = 'Oftalmologia';
    }

    if (specialty == 'radiology') {
      specialty = 'Radiologia';
    }

    if (specialty == 'urology') {
      specialty = 'Urologia';
    }

    if (specialty == 'traumatology') {
      specialty = 'Traumatologia';
    }

    return specialty;
  }
}
