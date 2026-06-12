import { Component, inject } from '@angular/core';
import { FrontAuthService, Roles } from '../../shared-modules/service/front-auth.service';
import { RouterLink } from '@angular/router';
import { CalendarPage } from '../calendar/calendar-page';
import { GradesPage } from '../grades/grades-page';
import { AttendancesPage } from '../attendances/attendances-page';
import { DashboardPage } from '../dashboard/dashboard-page';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, CalendarPage, GradesPage, AttendancesPage, DashboardPage],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  private readonly frontAuthService = inject(FrontAuthService);

  public Roles = Roles;

  userRole = this.frontAuthService.tokenPersonalizedData!.role;
}
