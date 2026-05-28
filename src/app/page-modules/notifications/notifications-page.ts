import { Component, inject } from '@angular/core';
import { NotificationItem } from '../../shared-modules/layout/notification/notification';
import { NotificationService } from '../../shared-modules/service/notification.service';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notifications-page',
  imports: [DatePipe, RouterLink],
  templateUrl: './notifications-page.html',
  styleUrl: './notifications-page.css',
})
export class NotificationsPage {
  public notificationService = inject(NotificationService);

  markAsRead(notification: NotificationItem, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.notificationService.readNotification(notification.id);
  }
}
