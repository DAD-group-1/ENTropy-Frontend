import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { FrontAuthService } from './shared-modules/service/front-auth.service';
import { Header } from './shared-modules/layout/header/header';
import { Sidebar } from './shared-modules/layout/sidebar/sidebar';
import { FrontLayoutService } from './shared-modules/service/front-layout.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  primeng = inject(PrimeNG);
  frontAuthService = inject(FrontAuthService);
  frontLayoutService = inject(FrontLayoutService);

  ngOnInit() {
    this.primeng.ripple.set(true);
    this.frontAuthService.updateTokenData();
  }

  protected readonly title = signal('ENTropy-Frontend');
}
