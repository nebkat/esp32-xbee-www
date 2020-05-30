import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mac48'
})
export class Mac48Pipe implements PipeTransform {
  transform(value: number): string {
    return value.toString(16)
      .toUpperCase()
      .padStart(12, '0')
      .match(/../g)
      .reverse()
      .slice(0, 6)
      .reverse()
      .join(':');
  }
}
