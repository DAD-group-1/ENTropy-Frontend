import { Component } from '@angular/core';
import { NgmMotionDirective } from '@scripttype/ng-motion';

@Component({
  selector: 'app-header',
  imports: [NgmMotionDirective],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  schoolName: string = 'Nova Campus';
  campus: string = 'Campus de Strasbourg';

  // TODO: (Placeholder) Use UserService instead to get the current connected user
  userName: string = 'Burnice White 🔥🔥🔥';

  // TODO: (Placeholder) Use UserService instead to check if the user is logged in
  isUserLoggedIn: boolean | undefined = Math.random() < 0.5;

  // TODO: Handle signing out
  logout() {
    window.alert('Logging out...');
  }

  // TODO: Handle going to home page
  goHome() {
    window.alert('Going to Home...');
  }

  // TODO: Handle going to profile page
  openProfile() {
    window.alert('Opening profile...');
  }
}
