import { inject, Injectable } from '@angular/core';
import { LayoutService } from './layout.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private layoutService = inject(LayoutService);
  private router = inject(Router);

  public navigate(route?: string) {
    if (!this.layoutService.isDesktop() && this.layoutService.layoutState().mobileMenuActive) {
      this.layoutService.onMenuToggle();
    }

    const target = route || '/home';

    void this.router.navigate([target]);
  }

  public navigateWithRefresh(route?: string) {
    const target = route || '/home';

    this.router.navigateByUrl(target).then(() => {
      window.location.reload();
    });
  }

  public navigateNewTab(route?: string) {
    const target = route || '/home';

    const url = this.router.serializeUrl(this.router.createUrlTree([target]));

    window.open(url, '_blank');
  }
}
