import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { environment } from '../../environments/environment';

export function displayName(first_name: string, last_name: string) {
  return `${first_name} ${last_name.toUpperCase()}`;
}

export type DateFormat =
  | 'yyyy-MM-dd'
  | 'dd/MM/yyyy'
  | 'MM/dd/yyyy'
  | 'yyyy-MM-dd HH:mm'
  | 'dd/MM/yyyy HH:mm'
  | 'full'
  | 'short'
  | string;

@Pipe({
  name: 'personalDate',
  standalone: true,
})
export class PersonalDatePipe implements PipeTransform {
  private datePipe = new DatePipe('en-US');

  transform(value: Date | string | number | null | undefined, format = 'HH:mm'): string | null {
    return this.datePipe.transform(value, format, environment.timezone);
  }
}
