import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uptime'
})
export class UptimePipe implements PipeTransform {

  transform(value: string): string {
    const seconds = parseInt(value, 10);
    if (isNaN(seconds)) return value;

    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const parts = [];
    if (days > 0) parts.push(`${days}д`);
    if (hours > 0 || days > 0) parts.push(`${hours}ч`);
    parts.push(`${minutes}м`);

    return parts.join(' ');
  }
}
