import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Location, NgClass } from '@angular/common';
import { FrontLayoutService } from '../../service/front-layout.service';
import { ButtonModule } from 'primeng/button';
import { FrontAuthService } from '../../service/front-auth.service';

type ErrorColor = 'red' | 'blue' | 'yellow' | 'gray';

@Component({
  selector: 'app-error',
  imports: [RouterLink, NgClass, ButtonModule],
  templateUrl: './error.html',
  styleUrl: './error.css',
})
export class Error implements OnInit, OnDestroy {
  @Input() errorCode = '404';
  @Input() title = 'Page not found';
  @Input() message = 'The page you are looking for doesn’t exist or has been moved.';
  @Input() color: ErrorColor = 'red';

  router = inject(Router);
  location = inject(Location);
  frontAuthService = inject(FrontAuthService);
  frontLayoutService = inject(FrontLayoutService);

  public readonly colorMap: Record<
    ErrorColor,
    {
      icon: string;
      primary: string;
    }
  > = {
    red: {
      icon: 'text-red-600',
      primary: 'bg-red-600 hover:bg-red-700',
    },
    blue: {
      icon: 'text-blue-600',
      primary: 'bg-blue-600 hover:bg-blue-700',
    },
    yellow: {
      icon: 'text-yellow-500',
      primary: 'bg-yellow-500 hover:bg-yellow-600',
    },
    gray: {
      icon: 'text-gray-600',
      primary: 'bg-gray-600 hover:bg-gray-700',
    },
  };

  ngOnInit() {
    if (!this.frontAuthService.hasOneTokenAndNotExpired()) {
      this.frontLayoutService.setLoggedLayout(false);
      return;
    }

    this.frontAuthService.isLoggedVerified().subscribe((isVerified) => {
      this.frontLayoutService.setLoggedLayout(isVerified);
    });
  }

  ngOnDestroy() {
    this.frontLayoutService.setLoggedLayout(true);
  }

  get styles() {
    return this.colorMap[this.color];
  }

  goBack() {
    this.location.back();
  }
}
