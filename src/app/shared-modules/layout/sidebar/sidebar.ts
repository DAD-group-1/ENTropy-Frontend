import { Component, effect, ElementRef, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { NgClass } from '@angular/common';
import { Subject } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { FrontLayoutService } from '../../service/front-layout.service';
import { FrontNavigationService } from '../../service/front-navigation.service';
import { FrontAuthService, Roles } from '../../service/front-auth.service';
import { UserService } from '../../../core/data-services';
import { SkeletonModule } from 'primeng/skeleton';

interface MenuItem {
  icon: string;
  label: string;
  isOpen?: boolean;
  route?: string;
  allowedRoles?: Roles[];
}

@Component({
  selector: 'app-sidebar',
  imports: [NgClass, ButtonModule, RouterModule, SkeletonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit, OnDestroy {
  frontLayoutService = inject(FrontLayoutService);
  frontNavigationService = inject(FrontNavigationService);
  frontAuthService = inject(FrontAuthService);
  el = inject(ElementRef);
  userService = inject(UserService);

  protected profileLoading = signal<boolean>(true);
  protected userName = signal('');
  protected role: WritableSignal<Roles | ''> = signal('');

  private outsideClickListener: ((event: MouseEvent) => void) | null = null;

  private destroy$ = new Subject<void>();

  constructor() {
    effect(() => {
      const state = this.frontLayoutService.layoutState();

      if (this.frontLayoutService.isDesktop()) {
        if (state.overlayMenuActive) {
          this.bindOutsideClickListener();
        } else {
          this.unbindOutsideClickListener();
        }
      } else {
        if (state.mobileMenuActive) {
          this.bindOutsideClickListener();
        } else {
          this.unbindOutsideClickListener();
        }
      }
    });
  }

  ngOnInit() {
    this.userService.userFindOne({ id: this.frontAuthService.tokenData!.sub }).subscribe({
      next: (result) => {
        const userName = `${result?.data?.first_name} ${result?.data?.last_name?.toUpperCase()}`;
        this.userName.set(userName);
        this.role.set(this.frontAuthService.tokenPersonalizedData!.role);
      },
      complete: () => {
        setTimeout(() => {
          this.profileLoading.set(false);
        }, 1000);
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.unbindOutsideClickListener();
  }

  private bindOutsideClickListener() {
    if (!this.outsideClickListener) {
      this.outsideClickListener = (event: MouseEvent) => {
        if (this.isOutsideClicked(event)) {
          this.frontLayoutService.layoutState.update((val) => ({
            ...val,
            overlayMenuActive: false,
            staticMenuMobileActive: false,
            mobileMenuActive: false,
            menuHoverActive: false,
          }));
        }
      };

      document.addEventListener('click', this.outsideClickListener);
    }
  }

  private unbindOutsideClickListener() {
    if (this.outsideClickListener) {
      document.removeEventListener('click', this.outsideClickListener);
      this.outsideClickListener = null;
    }
  }

  private isOutsideClicked(event: MouseEvent): boolean {
    const topbarButtonEl = document.querySelector('.topbar-start > button');
    const sidebarEl = this.el.nativeElement;

    return !(
      sidebarEl?.isSameNode(event.target as Node) ||
      sidebarEl?.contains(event.target as Node) ||
      topbarButtonEl?.isSameNode(event.target as Node) ||
      topbarButtonEl?.contains(event.target as Node)
    );
  }

  onLogout() {
    this.frontAuthService.logout();
  }

  canShow(item: MenuItem): boolean {
    const role = this.frontAuthService.tokenPersonalizedData?.role;

    if (!item.allowedRoles || item.allowedRoles.length === 0) {
      return true;
    }

    return !!role && item.allowedRoles.includes(role);
  }

  menuItems: MenuItem[] = [
    {
      icon: 'pi pi-home',
      label: 'Home',
    },
    {
      icon: 'pi pi-calendar',
      label: 'Calendar',
      route: 'calendar',
    },
    {
      icon: 'pi pi-chart-bar',
      label: 'Grades',
      route: 'grades',
    },
    {
      icon: 'pi pi-times-circle',
      label: 'Absence Records',
      route: 'absences',
    },
    {
      icon: 'pi pi-book',
      label: 'Assignments',
      route: 'assignments',
    },
    {
      icon: 'pi pi-box',
      label: 'Resources',
      route: 'resources',
    },
    // {
    //   icon: 'pi pi-info-circle',
    //   label: 'Informations',
    //   route: 'informations',
    // },
  ];
}
