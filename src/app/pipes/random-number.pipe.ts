import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'randomNumber',
})
export class RandomNumberPipe implements PipeTransform {
  transform(): number {
    return Math.floor(Math.random() * 3) + 1;
  }
}
