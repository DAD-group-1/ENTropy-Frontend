import { Component, Input, inject } from '@angular/core';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { LayoutService } from '../../service/layout.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [NgmMotionDirective, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Input() public showLoggedLayoutAndItems: boolean = true;

  layoutService = inject(LayoutService);

  public schoolName: string = 'Nova Campus';
}
