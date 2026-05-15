import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  start_time: string;
  end_time: string;
  room?: string;
  building?: string;
  instructor?: string;
  description?: string;
  color: string;
}

type ViewMode = 'month' | 'week' | 'day';

interface DayCell {
  date: Date;
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

@Component({
  selector: 'app-entcalendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entcalendar.html',
  styleUrl: './entcalendar.css',
})
export class ENTCalendar implements OnInit {
  // ── State ──────────────────────────────────────────────────────────────────
  viewDate = signal<Date>(new Date());
  viewMode = signal<ViewMode>('month');

  events = signal<CalendarEvent[]>([
    {
      id: '1',
      title: 'Team standup',
      date: this.todayStr(),
      start_time: '09:00',
      end_time: '11:00',
      room: 'S103',
      building: 'Spider Building',
      instructor: 'G. Ferrand',
      description: 'Daily sync with the engineering team.',
      color: '#6366f1',
    },
    {
      id: '2',
      title: 'Design review',
      date: this.offsetDate(2),
      start_time: '14:00',
      end_time: '16:00',
      description: 'Review new UI mockups with the product team.',
      color: '#10b981',
    },
    {
      id: '3',
      title: 'Release v3.0 🚀',
      date: this.offsetDate(5),
      start_time: '17:00',
      end_time: '19:00',
      description: 'Production deployment scheduled.',
      color: '#f59e0b',
    },
  ]);

  // ── Modal state ────────────────────────────────────────────────────────────
  selectedEvent = signal<CalendarEvent | null>(null);
  showEventModal = signal(false);
  showAddModal = signal(false);

  newEvent: Partial<CalendarEvent> = {};
  addForDate = '';

  colorOptions = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

  ngOnInit() {
    // TODO: Fetch events from backend here
  }

  // TODO: Check with the backend if the user has permissions to modify events.
  r: boolean = Math.random() < 0.5;
  canModify(): boolean {
    return this.r; // Randomly allow modifications for demo purposes
  }

  // ── Computed ───────────────────────────────────────────────────────────────
  calendarDays = computed<DayCell[]>(() => {
    const date = this.viewDate();
    const evts = this.events();
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;
    const days: DayCell[] = [];
    const start = new Date(firstDay);
    start.setDate(start.getDate() - startOffset);
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dateStr = this.toDateStr(d);
      days.push({
        date: d,
        dateStr,
        isCurrentMonth: d.getMonth() === month,
        isToday: dateStr === this.todayStr(),
        events: evts.filter((e) => e.date === dateStr),
      });
    }
    return days;
  });

  weekDays = computed<DayCell[]>(() => {
    const date = this.viewDate();
    const evts = this.events();
    const day = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((day + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = this.toDateStr(d);
      return {
        date: d,
        dateStr,
        isCurrentMonth: true,
        isToday: dateStr === this.todayStr(),
        events: evts.filter((e) => e.date === dateStr),
      };
    });
  });

  dayEvents = computed(() => {
    const dateStr = this.toDateStr(this.viewDate());
    return this.events().filter((e) => e.date === dateStr);
  });

  headerLabel = computed(() => {
    const d = this.viewDate();
    const month = d.toLocaleString('default', { month: 'long' });
    const year = d.getFullYear();
    if (this.viewMode() === 'month') return `${month} ${year}`;
    if (this.viewMode() === 'week') {
      const week = this.weekDays();
      return `${week[0].date.getDate()} – ${week[6].date.getDate()} ${month} ${year}`;
    }
    return d.toLocaleDateString('default', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  });

  weekDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

  // ── Navigation ─────────────────────────────────────────────────────────────
  prev() {
    const d = new Date(this.viewDate());
    if (this.viewMode() === 'month') d.setMonth(d.getMonth() - 1);
    else if (this.viewMode() === 'week') d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    this.viewDate.set(d);
  }

  next() {
    const d = new Date(this.viewDate());
    if (this.viewMode() === 'month') d.setMonth(d.getMonth() + 1);
    else if (this.viewMode() === 'week') d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    this.viewDate.set(d);
  }

  today() {
    this.viewDate.set(new Date());
  }
  setView(mode: ViewMode) {
    this.viewMode.set(mode);
  }

  // ── Add event ──────────────────────────────────────────────────────────────
  openAddModal(dateStr = '') {
    this.addForDate = dateStr || this.toDateStr(this.viewDate());
    this.newEvent = { date: this.addForDate, color: '#6366f1' };
    this.showAddModal.set(true);
  }

  confirmAdd() {
    if (!this.newEvent.title?.trim()) return;
    this.events.update((evts) => [
      ...evts,
      {
        id: crypto.randomUUID(),
        title: this.newEvent.title!.trim(),
        date: this.newEvent.date || this.addForDate,
        start_time: this.newEvent.start_time!,
        end_time: this.newEvent.end_time!,
        description: this.newEvent.description,
        color: this.newEvent.color || '#6366f1',
      },
    ]);
    this.showAddModal.set(false);
    this.newEvent = {};
  }

  cancelAdd() {
    this.showAddModal.set(false);
    this.newEvent = {};
  }

  // ── Event modal ────────────────────────────────────────────────────────────
  openEvent(event: CalendarEvent, e: MouseEvent) {
    e.stopPropagation();
    this.selectedEvent.set(event);
    this.showEventModal.set(true);
  }

  closeEventModal() {
    this.showEventModal.set(false);
    this.selectedEvent.set(null);
  }

  deleteSelectedEvent() {
    const ev = this.selectedEvent();
    if (!ev) return;
    this.events.update((evts) => evts.filter((e) => e.id !== ev.id));
    this.closeEventModal();
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  toDateStr(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  todayStr(): string {
    return this.toDateStr(new Date());
  }

  offsetDate(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return this.toDateStr(d);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('default', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  trackById(_: number, e: CalendarEvent) {
    return e.id;
  }
  trackByDate(_: number, d: DayCell) {
    return d.dateStr;
  }

  /**
   * Calculates the top vertical position (in pixels) for an event on the calendar grid based on its start time.
   *
   * It assumes that each hour block is 48 pixels in height. The calculation splits the "HH:MM"
   * string, applies 48px per hour, and a proportional amount of 48px based on the minutes.
   *
   * @param time - The start time of the event formatted as "HH:MM". Can be undefined.
   * @returns A string representing the calculated CSS `top` or `margin-top` property in pixels (e.g., "696px").
   *          If no time is provided, defaults to "'4px'".
   */
  protected calculateEventPosition(time: string | undefined) {
    if (!time) return '4px';

    const fullTime: string[] = time.split(':');
    const hours = +fullTime[0];
    const minutes = +fullTime[1];

    return hours * 48 + (minutes / 60) * 48 + 'px';
  }
}
