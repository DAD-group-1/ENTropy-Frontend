import { Component, inject, Input, signal } from '@angular/core';
import {
  CalendarEvent,
  ENTCalendar,
} from '../../shared-modules/app-common/entcalendar/entcalendar';
import {
  ScheduleFindByDateRangeDefaultResponse,
  ScheduleResponseDto,
  ScheduleService,
  StudentService,
} from '../../core/data-services';
import { FrontAuthService, Roles } from '../../shared-modules/service/front-auth.service';
import { FrontNavigationService } from '../../shared-modules/service/front-navigation.service';
import { Observable, of, switchMap } from 'rxjs';
import { displayName } from '../../shared-modules/utils';
import { Card } from 'primeng/card';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-calendar-page',
  imports: [ENTCalendar, Card, ProgressSpinner],
  templateUrl: './calendar-page.html',
  styleUrl: './calendar-page.css',
})
export class CalendarPage {
  private readonly frontNavigationService = inject(FrontNavigationService);
  private readonly frontAuthService = inject(FrontAuthService);
  private readonly schedulesService = inject(ScheduleService);
  private readonly studentService = inject(StudentService);

  @Input() isHomepage = false;

  public loading = signal(true);
  private startDate!: Date;
  private endDate!: Date;

  public calendarEvents = signal<CalendarEvent[]>([]);

  loadSchedule(startDate?: Date, endDate?: Date) {
    const role = this.frontAuthService.tokenPersonalizedData?.role;

    if (!role) {
      this.frontNavigationService.navigate('/forbidden');
      return;
    }

    if (startDate) this.startDate = startDate;
    if (endDate) this.endDate = endDate;

    if (!this.startDate || !this.endDate) {
      this.frontNavigationService.navigate('/error');
      return;
    }

    const startDateRequest = this.startDate.toISOString();
    const endDateRequest = this.endDate.toISOString();
    const dateObj = {
      startDate: startDateRequest,
      endDate: endDateRequest,
    };

    let request$: Observable<ScheduleFindByDateRangeDefaultResponse> | undefined;

    this.loading.set(true);

    switch (role) {
      case Roles.STUDENT: {
        request$ = this.studentService.studentFindOne({ id: this.frontAuthService.userId! }).pipe(
          switchMap((result) => {
            return this.schedulesService.scheduleFindByDateRange({
              programId: String(result.data?.program_id),
              ...dateObj,
            });
          }),
        );
        break;
      }

      case Roles.INSTRUCTOR: {
        request$ = this.schedulesService.scheduleFindByInstructorId({
          instructorId: this.frontAuthService.userId!,
          ...dateObj,
        });
        break;
      }

      default: {
        request$ = of({
          success: true,
          data: [],
        } as ScheduleFindByDateRangeDefaultResponse);
        break;
      }
    }

    request$?.subscribe({
      next: (result: ScheduleFindByDateRangeDefaultResponse) => {
        this.calendarEvents.set((result.data ?? []).map(this.scheduleToCalendarEvent));
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.frontNavigationService.navigate('error');
      },
    });
  }

  onRangeChange = (start: Date, end: Date) => {
    this.loadSchedule(start, end);
  };

  scheduleToCalendarEvent(schedule: ScheduleResponseDto): CalendarEvent {
    return {
      id: String(schedule.id),
      title: schedule.course.name,
      start: schedule.start_date,
      end: schedule.end_date,
      room: schedule.room.name,
      instructor: displayName(
        schedule.instructor.user.first_name,
        schedule.instructor.user.last_name,
      ),
    };
  }
}

