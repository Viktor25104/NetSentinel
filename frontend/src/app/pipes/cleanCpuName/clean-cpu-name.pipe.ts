import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cleanCpuName'
})
export class CleanCpuNamePipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    if (!value) return '';

    return value
      .replace(/\(R\)/gi, '')
      .replace(/\(TM\)/gi, '')
      .replace(/\(C\)/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
