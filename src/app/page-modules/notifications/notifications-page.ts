import { Component, inject, OnInit, signal } from '@angular/core';
import { FrontNotificationService } from '../../shared-modules/service/front-notification.service';
import { RouterLink } from '@angular/router';
import {
  GetNotificationResponseDto,
  NotificationsFindAllForUserRequestParams,
  NotificationsService,
} from '../../core/data-services';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { FrontAuthService } from '../../shared-modules/service/front-auth.service';
import { FrontWebsocketService } from '../../shared-modules/service/front-websocket.service';
import { PersonalDatePipe } from '../../shared-modules/utils';

@Component({
  selector: 'app-notifications-page',
  imports: [PersonalDatePipe, RouterLink, Paginator],
  templateUrl: './notifications-page.html',
  styleUrl: './notifications-page.css',
})
export class NotificationsPage implements OnInit {
  private readonly api = inject(NotificationsService);
  private readonly frontAuthService = inject(FrontAuthService);
  public frontNotificationService = inject(FrontNotificationService);
  private readonly frontWebsocketService = inject(FrontWebsocketService);

  public isLoading = signal(false);

  public page = signal(1);
  public numberOfRows = signal(10);
  public firstRow = signal(1);

  ngOnInit() {
    this.frontNotificationService.loadInitialNotifications();

    this.frontWebsocketService.on<GetNotificationResponseDto>('notification:new', () => {
      this.loadNotifications(undefined, true);
    });
  }

  markAsRead(notification: GetNotificationResponseDto, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.frontNotificationService.readNotification(notification._id);
  }

  loadNotifications(event?: PaginatorState, reload?: boolean) {
    if (!reload && event) {
      this.page.set((event.page ?? 0) + 1);
    }

    const notificationQuery: NotificationsFindAllForUserRequestParams = {
      userId: parseInt(this.frontAuthService.userId ?? '0', 10),
      page: this.page(),
      limit: this.numberOfRows(),
    };

    this.isLoading.set(true);
    this.api.notificationsFindAllForUser(notificationQuery).subscribe({
      next: (result) => {
        this.frontNotificationService.setPaginationResults(result?.data ?? null);
        this.frontNotificationService.setCurrentNotifications(result?.data?.items ?? []);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }
}
