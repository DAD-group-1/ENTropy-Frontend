import { Component, effect, ElementRef, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { LayoutService } from '../../service/layout.service';
import { Subject } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { NavigationService } from '../../service/navigation.service';

interface MenuItem {
  icon: string;
  label: string;
  isOpen?: boolean;
  route?: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [NgClass, ButtonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  layoutService = inject(LayoutService);
  navigationService = inject(NavigationService);
  el = inject(ElementRef);

  //TODO: Get from Auth service
  protected studentName: string = 'John Doe';
  protected role: string = 'Student';

  private outsideClickListener: ((event: MouseEvent) => void) | null = null;

  private destroy$ = new Subject<void>();

  constructor() {
    effect(() => {
      const state = this.layoutService.layoutState();

      if (this.layoutService.isDesktop()) {
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.unbindOutsideClickListener();
  }

  private bindOutsideClickListener() {
    if (!this.outsideClickListener) {
      this.outsideClickListener = (event: MouseEvent) => {
        if (this.isOutsideClicked(event)) {
          this.layoutService.layoutState.update((val) => ({
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
    localStorage.removeItem('token');
    this.navigationService.navigate('login');
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
    {
      icon: 'pi pi-info-circle',
      label: 'Informations',
      route: 'informations',
    },
  ];
}
