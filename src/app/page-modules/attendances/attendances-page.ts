import { Component, inject, Input, signal, WritableSignal } from '@angular/core';
import {
  DisplayTable,
  TableColumn,
  TableRow,
} from '../../shared-modules/app-common/display-table/display-table';
import {
  AttendanceResponseDto,
  AttendanceService,
} from '../../core/data-services';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TableLazyLoadEvent } from 'primeng/table';
import { FrontAuthService, Roles } from '../../shared-modules/service/front-auth.service';
import { ActivatedRoute } from '@angular/router';
import { Card } from 'primeng/card';
import { displayName } from '../../shared-modules/utils';

@Component({
  selector: 'app-attendances-page',
  imports: [DisplayTable, Card, ProgressSpinner],
  templateUrl: './attendances-page.html',
  styleUrl: './attendances-page.css',
})
export class AttendancesPage {
  private readonly attendancesService = inject(AttendanceService);
  private readonly frontAuthService = inject(FrontAuthService);
  private readonly route = inject(ActivatedRoute);

  @Input() isHomepage = false;

  public isLoaded = signal(false);
  public totalRecords = signal(0);

  public externalHeaders: TableColumn[] = [
    {
      key: 'id',
      label: 'Student id',
      hide: true,
    },
    {
      key: 'name',
      label: 'Name',
      click: {
        baseUrl: 'profile',
        parameterColumn: 'id',
      },
    },
  ];

  public headers: WritableSignal<TableColumn[]> = signal([
    {
      key: 'course_name',
      label: 'Course name',
    },
    {
      key: 'schedule_start_date',
      label: 'Schedule start date',
      dateFormat: 'yyyy-MM-dd HH:mm',
    },
    {
      key: 'schedule_end_date',
      label: 'Schedule end date',
      dateFormat: 'yyyy-MM-dd HH:mm',
    },
    {
      key: 'status',
      label: 'Status',
    },
    {
      key: 'note',
      label: 'Note',
    },
  ]);

  public rows: WritableSignal<TableRow[]> = signal([]);

  public userId: string | null | undefined;
  public isExternalUser = false;
  public isGlobalView = false;

  ngOnInit() {
    const routeUserId = this.route.snapshot.paramMap.get('id');
    const currentUserId = this.frontAuthService.userId;

    this.userId = currentUserId;
    if (routeUserId) {
      this.userId = routeUserId;
    } else {
      if (this.frontAuthService.tokenPersonalizedData?.role != Roles.STUDENT) {
        this.isGlobalView = true;
      }
    }

    this.isExternalUser = !!routeUserId && routeUserId !== currentUserId;

    if (this.isExternalUser || this.isGlobalView) {
      this.headers.update((headers) => [...this.externalHeaders, ...headers]);
    }

    this.loadPayments(1, 10);
  }

  private attendanceToRow(attendance: AttendanceResponseDto): TableRow {
    let externalUserData = {};

    if (this.isExternalUser || this.isGlobalView) {
      externalUserData = {
        id: attendance.student_id,
        name: displayName(attendance.user.first_name, attendance.user.last_name),
      };
    }

    return {
      ...externalUserData,
      course_name: attendance.schedule.course.name ?? null,
      schedule_start_date: attendance.schedule.start_date,
      schedule_end_date: attendance.schedule.end_date,
      status: attendance.status,
      note: attendance.note,
    };
  }

  loadPayments(page: number, limit: number) {
    const request$ = this.isGlobalView
      ? this.attendancesService.attendanceFindAll({ page, limit })
      : this.userId
        ? this.attendancesService.attendanceFindByStudentId({
            studentId: this.userId,
            page,
            limit,
          })
        : null;

    if (!request$) return;

    request$.subscribe({
      next: (result) => {
        if (!result.success || !result.data) return;

        this.rows.set(result.data.items.map((item) => this.attendanceToRow(item)));

        this.totalRecords.set(result.data.total);
        this.isLoaded.set(true);
      },

      error: (err) => {
        console.error('Payment load error:', err);
        this.isLoaded.set(false);
      },
    });
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    const first = event.first ?? 0;
    const rows = event.rows ?? 10;

    const page = Math.floor(first / rows) + 1;

    this.loadPayments(page, rows);
  }
}
