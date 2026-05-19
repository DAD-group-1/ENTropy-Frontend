import { Component } from '@angular/core';
import { ENTCalendar } from '../../shared-modules/app-common/entcalendar/entcalendar';

@Component({
  selector: 'app-calendar-page',
  imports: [ENTCalendar],
  templateUrl: './calendar-page.html',
  styleUrl: './calendar-page.css',
})
export class CalendarPage  {
  //TODO: Get it from the Authorization service
  public isTeacher: boolean = false;
}
