import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { AuthService } from './shared-modules/service/auth.service';
import { Header } from './shared-modules/layout/header/header';
import { Sidebar } from './shared-modules/layout/sidebar/sidebar';
import { LayoutService } from './shared-modules/service/layout.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  router = inject(Router);
  primeng = inject(PrimeNG);
  authService = inject(AuthService);
  layoutService = inject(LayoutService);

  ngOnInit() {
    this.primeng.ripple.set(true);
    this.authService.updateTokenData();
  }

  protected readonly title = signal('ENTropy-Frontend');
}
