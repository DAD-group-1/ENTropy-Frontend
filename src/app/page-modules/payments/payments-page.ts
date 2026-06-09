import { Component, inject, signal, WritableSignal } from '@angular/core';
import {
  DisplayTable,
  TableColumn,
  TableRow,
} from '../../shared-modules/app-common/display-table/display-table';
import { PaymentResponseDto, PaymentService } from '../../core/data-services';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TableLazyLoadEvent } from 'primeng/table';
import { FrontAuthService, Roles } from '../../shared-modules/service/front-auth.service';
import { ActivatedRoute } from '@angular/router';
import { Card } from 'primeng/card';
import { displayName } from '../../shared-modules/utils';

class OnInit {}

@Component({
  selector: 'app-payments-page',
  imports: [DisplayTable, ProgressSpinner, Card],
  templateUrl: './payments-page.html',
  styleUrl: './payments-page.css',
})
export class PaymentsPage implements OnInit {
  private readonly paymentService = inject(PaymentService);
  private readonly frontAuthService = inject(FrontAuthService);
  private readonly route = inject(ActivatedRoute);

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
      key: 'invoice_date',
      label: 'Invoice date',
      dateFormat: 'yyyy-MM-dd',
    },
    {
      key: 'due_date',
      label: 'Due date',
      sort: {
        sortField: true,
        sortOrder: -1,
      },
      dateFormat: 'yyyy-MM-dd',
    },
    {
      key: 'payment_date',
      label: 'Payment date',
      dateFormat: 'yyyy-MM-dd',
    },
    {
      key: 'amount',
      label: 'Amount',
    },
    {
      key: 'academic_year',
      label: 'Academic year',
    },
    {
      key: 'semester',
      label: 'Semester',
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

  private paymentToRow(payment: PaymentResponseDto): TableRow {
    let externalUserData = {};

    if (this.isExternalUser || this.isGlobalView) {
      externalUserData = {
        id: payment.student_id,
        name: displayName(payment.user.first_name, payment.user.last_name),
      };
    }

    return {
      ...externalUserData,
      invoice_date: payment.invoice_date,
      due_date: payment.due_date,
      payment_date: payment.payment_date ?? null,
      amount: payment.amount,
      academic_year: payment.academic_year,
      semester: payment.semester,
    };
  }

  loadPayments(page: number, limit: number) {
    const request$ = this.isGlobalView
      ? this.paymentService.paymentFindAll({ page, limit })
      : this.userId
        ? this.paymentService.paymentFindByStudentId({
            studentId: this.userId,
            page,
            limit,
          })
        : null;

    if (!request$) return;

    request$.subscribe({
      next: (result) => {
        if (!result.success || !result.data) return;

        this.rows.set(result.data.items.map((item) => this.paymentToRow(item)));

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
