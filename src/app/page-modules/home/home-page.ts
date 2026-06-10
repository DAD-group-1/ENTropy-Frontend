import { Component, inject } from '@angular/core';
import { FrontAuthService, Roles } from '../../shared-modules/service/front-auth.service';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  private readonly frontAuthService = inject(FrontAuthService);

  public Roles = Roles;

  userRole = this.frontAuthService.tokenPersonalizedData!.role;
}
