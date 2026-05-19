import { Component, Input, signal, ViewChild, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateInput, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { DialogModule } from 'primeng/dialog';

interface eventDataAdditions {
  description?: string;
  room?: string;
  tutor?: string;
}

type eventsCalendarData = (EventInput & eventDataAdditions)[];

@Component({
  selector: 'app-entcalendar',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule, DialogModule],
  templateUrl: './entcalendar.html',
  styleUrl: './entcalendar.css',
})
export class ENTCalendar {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  @Input() public defaultLayout: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek' =
    'timeGridWeek';

  private TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

  public clickedEvent: WritableSignal<EventInput | null> = signal(null);
  public showModal: WritableSignal<boolean> = signal(false);

  toDate(value: DateInput | null | undefined): Date | null {
    if (value == null) return null;

    if (typeof value === 'string') {
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    }

    if (typeof value === 'number') {
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    }

    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }

    if (Array.isArray(value)) {
      return null;
    }

    return null;
  }

  private WINDOW_PC_WIDTH: number = 1024;
  getInitialView(): string {
    return window.innerWidth >= this.WINDOW_PC_WIDTH ? this.defaultLayout : 'timeGridDay';
  }

  //TODO: Do a query to the backend
  public initialEvents: eventsCalendarData = [
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

  public calendarOptions!: CalendarOptions;

  ngOnInit() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      initialView: this.getInitialView(),
      weekends: false,
      headerToolbar: {
        left: 'title',
        center: 'prev,next today',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      nowIndicator: true,
      stickyHeaderDates: false,
      height: '100%',
      slotMinTime: '08:00:00',
      slotMaxTime: '18:00:00',
      windowResize: () => {
        const view = this.getInitialView();

        this.calendarComponent.getApi().changeView(view);
      },
      initialEvents: this.initialEvents,
      eventClick: (event) => {
        this.clickedEvent.set(event.event as EventInput);
        this.showModal.set(true);
      },
    };

    //   document.querySelector('style')!.textContent +=
    //     '@media screen and (max-width:767px) { .fc-toolbar.fc-header-toolbar {flex-direction:column;} .fc-toolbar-chunk { display: table-row; text-align:center; padding:5px 0; } }';
    //
  }
}
