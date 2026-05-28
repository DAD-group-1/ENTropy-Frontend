import { Injectable, Signal, signal, WritableSignal, computed } from '@angular/core';
import { NotificationItem } from '../layout/notification/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {
    this.loadInitialNotifications();
  }

  private _notifications: WritableSignal<NotificationItem[]> = signal([]);

  public notifications: Signal<NotificationItem[]> = this._notifications.asReadonly();

  public notificationCount: Signal<number> = computed(
    () => this._notifications().filter((n) => !n.read).length,
  );

  private loadInitialNotifications() {
    //TODO: Query the notification microservice

    this._notifications.set([
      {
        id: 1,
        title: 'New Booking',
        message:
          'John Doe has successfully booked a Yoga session scheduled for tomorrow at 6:00 PM. Please make sure the instructor is notified and the room is prepared accordingly.',
        redirectUrl: '/calendar',
        read: false,
        publishDate: new Date(),
      },
      {
        id: 2,
        title: 'Payment Confirmed',
        message:
          'The payment for order #4821 has been successfully processed and confirmed. The invoice has been generated and sent to the customer email address.',
        redirectUrl: '/payments/4821',
        read: false,
        publishDate: new Date(Date.now() - 1000 * 60 * 15),
      },
      {
        id: 3,
        title: 'New Support Message',
        message:
          'You have received a new message from the support team regarding your recent inquiry. Please review the details and respond if additional information is required.',
        redirectUrl: '/messages',
        read: true,
        publishDate: new Date(Date.now() - 1000 * 60 * 45),
      },
      {
        id: 4,
        title: 'Profile Updated',
        message:
          'Your profile has been successfully updated with the latest information. All changes have been saved and are now visible across the platform.',
        redirectUrl: '/profile',
        read: true,
        publishDate: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
      {
        id: 5,
        title: 'Class Cancelled',
        message:
          'The Pilates class scheduled for today at 6:00 PM has been cancelled due to unforeseen circumstances. All registered participants have been notified automatically.',
        redirectUrl: '/courses',
        read: false,
        publishDate: new Date(Date.now() - 1000 * 60 * 60 * 5),
      },
    ]);
  }

  public setNotifications(notifications: NotificationItem[]) {
    this._notifications.set(notifications);
  }

  public readNotification(notificationId: number) {
    this._notifications.update((list) =>
      list.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );
  }

  public canMarkAllAsRead = computed(() => this._notifications().some((n) => !n.read));

  public markAllAsRead() {
    this._notifications.update((list) => list.map((n) => ({ ...n, read: true })));
  }
}
