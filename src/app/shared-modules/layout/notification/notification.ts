import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Popover, PopoverModule } from 'primeng/popover';
import { FrontNotificationService } from '../../service/front-notification.service';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { GetNotificationResponseDto } from '../../../core/data-services';
import { FrontWebsocketService } from '../../service/front-websocket.service';

@Component({
  selector: 'app-notification',
  imports: [PopoverModule, RouterLink, DatePipe],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class Notification implements OnInit {
  @ViewChild('notificationPopover') notificationPopover!: Popover;

  private readonly frontWebsocketService = inject(FrontWebsocketService);
  public frontNotificationService = inject(FrontNotificationService);

  ngOnInit() {
    window.addEventListener('resize', this.hide.bind(this));

    this.frontWebsocketService.on<GetNotificationResponseDto>(
      'notification:new',
      (notification) => {
        const updated = [notification, ...this.frontNotificationService.latestNotifications()];
        const result = updated.slice(0, 10);

        this.frontNotificationService.setLatestNotifications(result);
      },
    );
  }

  onNotificationClick(notification: GetNotificationResponseDto) {
    this.frontNotificationService.readNotification(notification._id);

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
