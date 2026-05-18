import { Component, inject } from '@angular/core';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { LayoutService } from '../../service/layout.service';

@Component({
  selector: 'app-header',
  imports: [NgmMotionDirective],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  layoutService = inject(LayoutService);

  public schoolName: string = 'Nova Campus';

  // TODO: Handle showing sidebar if not logged in
  public showSidebar: boolean = false;

  // TODO: Handle going to home page
  goHome() {
    window.alert('Going to Home...');
  }
}
