import { Component } from '@angular/core';
import { NgmMotionDirective } from '@scripttype/ng-motion';

@Component({
  selector: 'app-header',
  imports: [NgmMotionDirective],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  schoolName: string;
  campus: string;
  userName: string; // TODO: Use UserService instead to get the current connected user

  constructor() {
    this.schoolName = "Nova Campus";
    this.campus = 'Campus de Strasbourg';
    this.userName = 'Jane Doezertyuiopzertyuiopertyuiop';
  }

  // TODO: Handle signing out
  logout() {
    window.alert('Deconnect');
  }

  goHome() {
    window.alert('Go Home');
  }

  openProfile() {
    window.alert('Open Profile');
  }
}
