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

interface EventDataAdditions {
  id?: string;
  description?: string;
  room?: string;
  tutor?: string;
}

interface EventDataAdditions {
  id?: string;
  description?: string;
  room?: string;
  tutor?: string;
}

export interface CalendarEvent extends EventDataAdditions {
  title: string;
  start: Date | string;
  end?: Date | string;
}

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

  @Input({ required: true }) public calendarEvents: CalendarEvent[] = [];

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
      eventClick: (event) => {
        this.clickedEvent.set(event.event as EventInput);
        this.showModal.set(true);
      },
    };
  }
}
