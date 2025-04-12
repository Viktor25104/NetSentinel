import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatBytes',
  standalone: true
})
export class FormatBytesPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) return '—';

    const units = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
    let i = 0;

    while (value >= 1024 && i < units.length - 1) {
      value /= 1024;
      i++;
    }

    return `${value.toFixed(1)} ${units[i]}`;
  }
}
