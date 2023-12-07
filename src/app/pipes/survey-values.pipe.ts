import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'surveyValuesPipe',
})
export class SurveyValuesPipe implements PipeTransform {
  transform(value: any): unknown {
    let returnValue = value;

    if (returnValue == 'bad') {
      returnValue = 'Mala';
    }

    if (returnValue == 'regular') {
      returnValue = 'Regular';
    }

    if (returnValue == 'good') {
      returnValue = 'Buena';
    }

    if (returnValue == 'excellent') {
      returnValue = 'Excelente';
    }

    return returnValue;
  }
}
