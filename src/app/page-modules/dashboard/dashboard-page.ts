import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { Roles } from '../../shared-modules/service/front-auth.service';
import {
  CourseService,
  EnrollmentService,
  InstructorService,
  PaymentService,
  StudentService,
} from '../../core/data-services';

import { catchError, of } from 'rxjs';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-dashboard-page',
  imports: [Skeleton],
  templateUrl: './dashboard-page.html',
  styleUrls: ['./dashboard-page.css'],
})
export class DashboardPage implements OnInit {
  @Input() userRole!: Roles;

  studentService = inject(StudentService);
  instructorService = inject(InstructorService);
  enrollmentService = inject(EnrollmentService);
  paymentService = inject(PaymentService);
  coursesService = inject(CourseService);

  // values
  studentTotal = signal(0);
  instructorTotal = signal(0);
  enrollmentTotal = signal(0);
  paymentTotal = signal(0);
  courseTotal = signal(0);

  // loading states
  studentLoading = signal(true);
  instructorLoading = signal(true);
  enrollmentLoading = signal(true);
  paymentLoading = signal(true);
  courseLoading = signal(true);

  errors = signal<string[]>([]);

  ngOnInit() {
    this.loadDashboardData();
  }

  private addError(message: string) {
    console.error(message);
    this.errors.update((current) => [...current, message]);
  }

  private loadDashboardData(): void {
    // STUDENTS
    this.studentService
      .studentFindAll()
      .pipe(
        catchError(() => {
          this.addError('Failed to load students');
          return of({ data: { total: 0 } });
        }),
      )
      .subscribe((result) => {
        this.studentTotal.set(result.data?.total ?? 0);
        this.studentLoading.set(false);
      });

    // INSTRUCTORS
    this.instructorService
      .instructorFindAll()
      .pipe(
        catchError(() => {
          this.addError('Failed to load instructors');
          return of({ data: { total: 0 } });
        }),
      )
      .subscribe((result) => {
        this.instructorTotal.set(result.data?.total ?? 0);
        this.instructorLoading.set(false);
      });

    // ENROLLMENTS
    this.enrollmentService
      .enrollmentFindAll()
      .pipe(
        catchError(() => {
          this.addError('Failed to load enrollments');
          return of({ data: { total: 0 } });
        }),
      )
      .subscribe((result) => {
        this.enrollmentTotal.set(result.data?.total ?? 0);
        this.enrollmentLoading.set(false);
      });

    // PAYMENTS
    this.paymentService
      .paymentFindAll()
      .pipe(
        catchError(() => {
          this.addError('Failed to load payments');
          return of({ data: { total: 0 } });
        }),
      )
      .subscribe((result) => {
        this.paymentTotal.set(result.data?.total ?? 0);
        this.paymentLoading.set(false);
      });

    // COURSES
    this.coursesService
      .courseFindAll()
      .pipe(
        catchError(() => {
          this.addError('Failed to load courses');
          return of({ data: { total: 0 } });
        }),
      )
      .subscribe((result) => {
        this.courseTotal.set(result.data?.total ?? 0);
        this.courseLoading.set(false);
      });
  }
}
