import { Component, inject, signal } from '@angular/core';
import { NotificationService } from '../../shared-modules/service/notification.service';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  GetNotificationResponseDto,
  NotificationsFindAllForUserRequestParams,
  NotificationsService,
} from '../../core/data-services';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { AuthService } from '../../shared-modules/service/auth.service';

@Component({
  selector: 'app-notifications-page',
  imports: [DatePipe, RouterLink, Paginator],
  templateUrl: './notifications-page.html',
  styleUrl: './notifications-page.css',
})
export class NotificationsPage {
  private readonly api = inject(NotificationsService);
  private readonly authService = inject(AuthService);
  public notificationService = inject(NotificationService);

  public isLoading = signal(false);

  public numberOfRows = signal(10);
  public firstRow = signal(1);

  markAsRead(notification: GetNotificationResponseDto, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.notificationService.readNotification(notification._id);
  }

  loadNewNotifications(event: PaginatorState) {
    if (!event) return;

    const notificationQuery: NotificationsFindAllForUserRequestParams = {
      userId: parseInt(this.authService.tokenData?.sub ?? '0', 10),
      page: (event.page ?? 0) + 1,
      limit: event.rows,
    };

    this.isLoading.set(true);
    this.api.notificationsFindAllForUser(notificationQuery).subscribe({
      next: (result) => {
        console.log(result);
        this.notificationService.setPaginationResults(result?.data ?? null);
        this.notificationService.setCurrentNotifications(result?.data?.items ?? []);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }
}
