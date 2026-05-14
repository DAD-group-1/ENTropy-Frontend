import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { Header } from './shared-modules/layout/header/header';
import { Sidebar } from './shared-modules/layout/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  constructor(private primeng: PrimeNG) {}

  ngOnInit() {
    this.primeng.ripple.set(true);
  }

  protected readonly title = signal('ENTropy-Frontend');

  // TODO: Use UserService to check if the user is logged in, or other checks
  protected isSidebarVisible: boolean = Math.random() < 0.5;
}
