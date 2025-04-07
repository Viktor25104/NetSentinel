import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime',
  pure: false
})
export class RelativeTimePipe implements PipeTransform {

  transform(value: string | Date): string {
    let date: Date;
    if (typeof value === 'string') {
      date = new Date(value);
    } else {
      date = value;
    }

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diff / 1000);
    const diffInMinutes = Math.floor(diff / 60 * 1000);

    // Если событие произошло менее минуты назад
    if (diffInSeconds < 60) {
      return 'только что';
    }
    // Если прошло менее 60 минут — выводим количество минут назад
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${this.pluralMinutes(diffInMinutes)} назад`;
    }

    // Если событие произошло сегодня — выводим только время (HH:mm)
    if (this.isToday(date)) {
      return this.formatTime(date);
    }

    // Если событие произошло вчера — выводим "Вчера, HH:mm"
    if (this.isYesterday(date)) {
      return `Вчера, ${this.formatTime(date)}`;
    }

    // Если событие произошло на этой неделе (но не сегодня и не вчера)
    if (this.isThisWeek(date)) {
      return `${this.getDayName(date)}, ${this.formatTime(date)}`;
    }

    // Для более старых дат — выводим полную дату и время
    return this.formatDate(date);
  }

  private isToday(date: Date): boolean {
    const now = new Date();
    return date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();
  }

  private isYesterday(date: Date): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate();
  }

  private isThisWeek(date: Date): boolean {
    const now = new Date();
    // Определяем начало недели (считаем, что неделя начинается с понедельника)
    const dayOfWeek = now.getDay();
    // В JS воскресенье = 0, поэтому для воскресенья сдвиг на -6
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    return date.getTime() >= monday.getTime();
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const time = this.formatTime(date);
    return `${day}.${month}.${year} ${time}`;
  }

  private getDayName(date: Date): string {
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return days[date.getDay()];
  }

  private pluralMinutes(minutes: number): string {
    // Правила склонения для "минута":
    // Если число оканчивается на 1, но не 11 – "минута"
    // Если число оканчивается на 2,3,4 (но не 12,13,14) – "минуты"
    // Иначе – "минут"
    if (minutes % 10 === 1 && minutes % 100 !== 11) {
      return 'минута';
    } else if ([2, 3, 4].includes(minutes % 10) && ![12, 13, 14].includes(minutes % 100)) {
      return 'минуты';
    } else {
      return 'минут';
    }
  }

}
