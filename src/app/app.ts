import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { FrontAuthService } from './shared-modules/service/front-auth.service';
import { Header } from './shared-modules/layout/header/header';
import { Sidebar } from './shared-modules/layout/sidebar/sidebar';
import { FrontLayoutService } from './shared-modules/service/front-layout.service';
import { FrontWebsocketService } from './shared-modules/service/front-websocket.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  primeng = inject(PrimeNG);
  router = inject(Router);
  frontAuthService = inject(FrontAuthService);
  frontLayoutService = inject(FrontLayoutService);
  frontWebsocketService = inject(FrontWebsocketService);

  ngOnInit() {
    this.primeng.ripple.set(true);
    this.frontAuthService.updateTokenData();

    const userId = this.frontAuthService.userId;

    if (userId) {
      this.frontWebsocketService.connect(userId);
    }

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const el = document.querySelector('.content');
      if (el) {
        el.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  protected readonly title = signal('ENTropy-Frontend');
}
