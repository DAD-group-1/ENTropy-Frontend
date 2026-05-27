import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PrimeNG } from 'primeng/config';
import { LayoutService } from './shared-modules/service/layout.service';
import { Header } from './shared-modules/layout/header/header';
import { Sidebar } from './shared-modules/layout/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  router = inject(Router);
  primeng = inject(PrimeNG);
  layoutService = inject(LayoutService);

  // TODO: Handle showing the sidebar if not logged in
  private shouldShowLayout(url: string): boolean {
    const excluded = ['/login', '/not-found'];

    return !excluded.some((r) => url.startsWith(r));
  }

  ngOnInit() {
    this.primeng.ripple.set(true);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;

        this.layoutService.setLoggedLayout(this.shouldShowLayout(url));
      });
  }

  protected readonly title = signal('ENTropy-Frontend');
}
