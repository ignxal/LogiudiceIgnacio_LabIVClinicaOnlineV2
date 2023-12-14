import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'surveyValuesPipe',
})
export class SurveyValuesPipe implements PipeTransform {
  transform(value: any): unknown {
    let returnValue = value;

    if (returnValue == 'bad') {
      returnValue = 'Mala';
    } else if (returnValue == 'regular') {
      returnValue = 'Regular';
    } else if (returnValue == 'good') {
      returnValue = 'Buena';
    } else if (returnValue == 'excellent') {
      returnValue = 'Excelente';
    }

    return returnValue;
  }
}
