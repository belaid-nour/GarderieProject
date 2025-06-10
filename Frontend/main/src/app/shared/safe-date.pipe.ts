import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'safeDate',
  standalone: true
})
export class SafeDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined, format: string = 'dd/MM/yyyy'): string {
    if (!value) return 'N/A';
    const date = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(date.getTime())) return 'Date invalide';
    return new DatePipe('fr-FR').transform(date, format) || 'N/A';
  }
}
