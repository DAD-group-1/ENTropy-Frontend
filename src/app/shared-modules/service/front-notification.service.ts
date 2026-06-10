import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import {
  GetNotificationListResponseDto,
  GetNotificationResponseDto,
  NotificationsFindAllDefaultResponse,
  NotificationsFindAllForUserRequestParams,
  NotificationsService,
} from '../../core/data-services';
import { FrontAuthService } from './front-auth.service';

@Injectable({
  providedIn: 'root',
})
export class FrontNotificationService {
  constructor() {
    this.loadInitialNotifications();
  }

  private readonly frontNotificationService = inject(NotificationsService);
  private readonly frontAuthService = inject(FrontAuthService);

  private _latestNotifications: WritableSignal<GetNotificationResponseDto[]> = signal([]);

  public latestNotifications = this._latestNotifications.asReadonly();

  public latestNotificationsCount: Signal<number> = computed(
    () => this._latestNotifications().length,
  );

  public latestNotificationsNotReadCount: Signal<number> = computed(
    () => this._latestNotifications().filter((n) => !n.read_at).length,
  );

  public setLatestNotifications(notifications: GetNotificationResponseDto[]) {
    this._latestNotifications.set(notifications);
  }

  private _currentNotifications: WritableSignal<GetNotificationResponseDto[]> = signal([]);

  public currentNotifications = this._currentNotifications.asReadonly();

  public setCurrentNotifications(notifications: GetNotificationResponseDto[]) {
    this._currentNotifications.set(notifications);
  }

  private _paginationResults: WritableSignal<GetNotificationListResponseDto | null> = signal(null);

  public paginationResults = this._paginationResults.asReadonly();

  public setPaginationResults = (result: GetNotificationListResponseDto | null) =>
    this._paginationResults.set(result);

  public hasMultiplePages = computed(() => {
    const res = this.paginationResults();
    if (!res) return false;
    return Math.ceil(res.total / res.limit) > 1;
  });

  public loadInitialNotifications() {
    const notificationQuery: NotificationsFindAllForUserRequestParams = {
      userId: parseInt(this.frontAuthService.tokenData?.sub ?? '0', 10),
      page: 1,
      limit: 10,
    };

    this.frontNotificationService.notificationsFindAllForUser(notificationQuery).subscribe({
      next: (result: NotificationsFindAllDefaultResponse) => {
        const resultData = result.data;

        this.setPaginationResults(resultData ?? null);
        this.setLatestNotifications(resultData?.items ?? []);
        this.setCurrentNotifications(resultData?.items ?? []);
      },
      error: () => {
        this.setPaginationResults(null);
        this.setLatestNotifications([]);
        this.setCurrentNotifications([]);
      },
    });
  }

  public readNotification(notificationId: number) {
    const id = String(notificationId);
    const date = new Date().toISOString();

    this.frontNotificationService
      .notificationsUpdate({
        id: id,
        updateNotificationDto: {
          read_at: date,
        },
      })
      .subscribe({
        next: () => {
          this._latestNotifications.update((list) =>
            list.map((n) => (String(n._id) === id ? { ...n, read_at: date } : n)),
          );

          this._currentNotifications.update((list) =>
            list.map((n) => (String(n._id) === id ? { ...n, read_at: date } : n)),
          );
        },
        error: () => {
          this._latestNotifications.update((list) =>
            list.map((n) => (String(n._id) === id ? { ...n, read_at: undefined } : n)),
          );

          this._currentNotifications.update((list) =>
            list.map((n) => (String(n._id) === id ? { ...n, read_at: undefined } : n)),
          );
        },
      });
  }

  public canMarkAllAsRead = computed(() => this.currentNotifications().some((n) => !n.read_at));

  public markAllAsRead() {
    this.currentNotifications().forEach((notification) => {
      this.readNotification(notification._id);
    });
  }
}
