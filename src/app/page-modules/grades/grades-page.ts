import { Component, inject, Input, signal, WritableSignal } from '@angular/core';
import {
  DisplayTable,
  TableColumn,
  TableRow,
} from '../../shared-modules/app-common/display-table/display-table';
import {
  AttendanceResponseDto,
  AttendanceService,
  EnrollmentService,
  GradeResponseDto, GradeService,
} from '../../core/data-services';
import { FrontAuthService, Roles } from '../../shared-modules/service/front-auth.service';
import { ActivatedRoute } from '@angular/router';
import { displayName } from '../../shared-modules/utils';
import { TableLazyLoadEvent } from 'primeng/table';
import { Card } from 'primeng/card';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-grades-page',
  imports: [DisplayTable, Card, ProgressSpinner],
  templateUrl: './grades-page.html',
  styleUrl: './grades-page.css',
})
export class GradesPage {
  private readonly gradeService = inject(GradeService);
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
      key: 'student_name',
      label: 'Student',
      click: {
        baseUrl: 'profile',
        parameterColumn: 'id',
      },
    },
  ];

  public headers: WritableSignal<TableColumn[]> = signal([
    {
      key: 'grade_name',
      label: 'Grade name',
    },
    {
      key: 'grade',
      label: 'Grade',
    },
    {
      key: 'course',
      label: 'Course',
    },
    {
      key: 'semester',
      label: 'Semester',
    },
    {
      key: 'academic_year',
      label: 'Academic year',
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

  private gradesToRow(grade: GradeResponseDto): TableRow {
    let externalUserData = {};

    if (this.isExternalUser || this.isGlobalView) {
      externalUserData = {
        id: grade.enrollment.student_id,
        student_name: displayName(
          grade.enrollment.student.user.first_name,
          grade.enrollment.student.user.last_name
        ),
      };
    }

    return {
      ...externalUserData,
      grade_name: grade.name,
      grade: grade.grade,
      course: grade.enrollment.course.name,
      semester: grade.enrollment.semester,
      academic_year: grade.enrollment.academic_year,
    };
  }

  loadPayments(page: number, limit: number) {
    const request$ = this.isGlobalView
      ? this.gradeService.gradeFindAll({ page, limit })
      : this.userId
        ? this.gradeService.gradeFindByStudentId({
            studentId: this.userId,
            page,
            limit,
          })
        : null;

    if (!request$) return;

    request$.subscribe({
      next: (result) => {
        if (!result.success || !result.data) return;

        this.rows.set(result.data.items.map((item) => this.gradesToRow(item)));

        this.totalRecords.set(result.data.total);
        this.isLoaded.set(true);
      },

      error: (err) => {
        console.error('Grades load error:', err);
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
