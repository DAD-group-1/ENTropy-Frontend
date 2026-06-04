import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Popover, PopoverModule } from 'primeng/popover';
import { NotificationService } from '../../service/notification.service';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { GetNotificationResponseDto } from '../../../core/data-services';

export interface NotificationItem {
  id: number,
  title: string,
  message: string,
  redirectUrl: string,
  read: boolean,
  publishDate: Date
}

@Component({
  selector: 'app-notification',
  imports: [PopoverModule, RouterLink, DatePipe],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class Notification implements OnInit{
  @ViewChild('notificationPopover') notificationPopover!: Popover;

  public notificationService = inject(NotificationService);

  ngOnInit() {
    window.addEventListener('resize', this.hide.bind(this));
  }

  onNotificationClick(notification: GetNotificationResponseDto) {
    this.notificationService.readNotification(notification._id);

    if (notification.target_url) {
      this.notificationPopover.hide();
    }
  }

  toggle(e: Event, targetElement: Element) {
    this.notificationPopover.toggle(e, targetElement);
  }

  hide() {
    this.notificationPopover.hide();
  }
}
