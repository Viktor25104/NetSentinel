import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyBytes',
  standalone: true
})
export class PrettyBytesPipe implements PipeTransform {

  transform(value: number | null | undefined, unitSuffix: string = '/с'): string {
    if (value === null || value === undefined || isNaN(value)) return '—';

    const units = ['КБ', 'МБ', 'ГБ', 'ТБ'];
    let i = 0;

    while (value >= 1024 && i < units.length - 1) {
      value /= 1024;
      i++;
    }

    return `${value.toFixed(1)} ${units[i]}${unitSuffix}`;
  }
}
