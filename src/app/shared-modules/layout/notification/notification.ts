import { Component, inject, ViewChild } from '@angular/core';
import { Popover, PopoverModule } from 'primeng/popover';
import { NotificationService } from '../../service/notification.service';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

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
export class Notification {
  @ViewChild('notificationPopover') notificationPopover!: Popover;

  public notificationService = inject(NotificationService);

  toggle(e: Event, targetElement: Element) {
    this.notificationPopover.toggle(e, targetElement);
  }
}
