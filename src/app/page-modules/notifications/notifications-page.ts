import { Component, inject, signal } from '@angular/core';
import { FrontNotificationService } from '../../shared-modules/service/front-notification.service';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  GetNotificationResponseDto,
  NotificationsFindAllForUserRequestParams,
  NotificationsService,
} from '../../core/data-services';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { FrontAuthService } from '../../shared-modules/service/front-auth.service';

@Component({
  selector: 'app-notifications-page',
  imports: [DatePipe, RouterLink, Paginator],
  templateUrl: './notifications-page.html',
  styleUrl: './notifications-page.css',
})
export class NotificationsPage {
  private readonly api = inject(NotificationsService);
  private readonly frontAuthService = inject(FrontAuthService);
  public frontNotificationService = inject(FrontNotificationService);

  public isLoading = signal(false);

  public numberOfRows = signal(10);
  public firstRow = signal(1);

  markAsRead(notification: GetNotificationResponseDto, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.frontNotificationService.readNotification(notification._id);
  }

  loadNewNotifications(event: PaginatorState) {
    if (!event) return;

    const notificationQuery: NotificationsFindAllForUserRequestParams = {
      userId: parseInt(this.frontAuthService.tokenData?.sub ?? '0', 10),
      page: (event.page ?? 0) + 1,
      limit: event.rows,
    };

    this.isLoading.set(true);
    this.api.notificationsFindAllForUser(notificationQuery).subscribe({
      next: (result) => {
        console.log(result);
        this.frontNotificationService.setPaginationResults(result?.data ?? null);
        this.frontNotificationService.setCurrentNotifications(result?.data?.items ?? []);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }
}
