import { Component, Input, inject } from '@angular/core';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { LayoutService } from '../../service/layout.service';

@Component({
  selector: 'app-header',
  imports: [NgmMotionDirective],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Input() public showLoggedLayoutAndItems: boolean = true;

  layoutService = inject(LayoutService);

  public schoolName: string = 'Nova Campus';

  goHome() {
    // TODO: If logged in using Auth service, go to home, else do nothing
  }
}
