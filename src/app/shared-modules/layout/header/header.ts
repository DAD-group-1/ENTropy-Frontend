import { Component, inject } from '@angular/core';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { LayoutService } from '../../service/layout.service';
import { RouterLink } from '@angular/router';
import { Notification } from '../notification/notification';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [NgmMotionDirective, RouterLink, Notification, NgOptimizedImage],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  layoutService = inject(LayoutService);

  public schoolName = 'Nova Campus';
}
