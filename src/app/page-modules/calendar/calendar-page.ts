import { Component } from '@angular/core';
import {
  CalendarEvent,
  ENTCalendar,
} from '../../shared-modules/app-common/entcalendar/entcalendar';

@Component({
  selector: 'app-calendar-page',
  imports: [ENTCalendar],
  templateUrl: './calendar-page.html',
  styleUrl: './calendar-page.css',
})
export class CalendarPage {
  //TODO: Get it from the Authorization service
  public isTeacher: boolean = false;

  private TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

  //TODO: Do a query to the backend
  public calendarEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'title',
      start: this.TODAY_STR,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      room: '101',
      tutor: 'MR. Tutor TEST',
    },
    {
      id: '2',
      title: 'Timed event',
      start: this.TODAY_STR + 'T08:00:00',
      end: this.TODAY_STR + 'T09:00:00',
    },
    {
      id: '3',
      title: 'Timed event',
      start: this.TODAY_STR + 'T12:00:00',
      end: this.TODAY_STR + 'T15:00:00',
    },
  ];
}
