import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Location, NgClass } from '@angular/common';
import { LayoutService } from '../../service/layout.service';
import { ButtonModule } from 'primeng/button';

type ErrorColor = 'red' | 'blue' | 'yellow' | 'gray';

@Component({
  selector: 'app-error',
  imports: [RouterLink, NgClass, ButtonModule],
  templateUrl: './error.html',
  styleUrl: './error.css',
})
export class Error {
  @Input() errorCode: string = '404';
  @Input() title: string = 'Page not found';
  @Input() message: string = 'The page you are looking for doesn’t exist or has been moved.';
  @Input() color: ErrorColor = 'red';

  router = inject(Router);
  location = inject(Location);
  layoutService = inject(LayoutService);

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
    this.layoutService.setLoggedLayout(false);
  }

  get styles() {
    return this.colorMap[this.color];
  }

  goBack() {
    this.location.back();
  }
}
