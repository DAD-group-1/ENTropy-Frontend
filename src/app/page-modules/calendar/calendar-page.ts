import { Component, OnInit } from '@angular/core';
import { ENTCalendar } from '../../shared-modules/app-common/entcalendar/entcalendar';

@Component({
  selector: 'app-calendar-page',
  imports: [ENTCalendar],
  templateUrl: './calendar-page.html',
  styleUrl: './calendar-page.css',
})
export class CalendarPage implements OnInit {
  ngOnInit() {}
}
