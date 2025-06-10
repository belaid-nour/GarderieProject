import { formatDate } from '@angular/common';

export class Calendar {
  id: string;
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  details: string;

  constructor(calendar?: Partial<Calendar>) {
    this.id = calendar?.id ?? this.getRandomID();
    this.title = calendar?.title ?? '';
    this.category = calendar?.category ?? '';
    this.startDate = calendar?.startDate
      ? new Date(calendar.startDate).toISOString()
      : new Date().toISOString();
    this.endDate = calendar?.endDate
      ? new Date(calendar.endDate).toISOString()
      : new Date().toISOString();
    this.details = calendar?.details ?? '';
  }

  private getRandomID(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
