import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
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
  constructor(
    private router: Router,
    private primeng: PrimeNG,
  ) {}

  // TODO: Handle showing the sidebar if not logged in
  public showLoggedLayoutAndItems: WritableSignal<boolean> = signal(true);

  ngOnInit() {
    this.primeng.ripple.set(true);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showLoggedLayoutAndItems.set(!event.urlAfterRedirects.startsWith('/login'));
      });
  }

  protected readonly title = signal('ENTropy-Frontend');
}
