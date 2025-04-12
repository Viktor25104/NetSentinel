import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'humanStatus'
})
export class HumanStatusPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'online': return 'Онлайн';
      case 'offline': return 'Офлайн';
      case 'maintenance': return 'Обслуживание';
      default: return value;
    }
  }
}
