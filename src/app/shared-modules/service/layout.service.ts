import { Injectable, signal, computed, WritableSignal } from '@angular/core';

export interface LayoutConfig {
  menuMode: string;
}

interface LayoutState {
  staticMenuDesktopInactive: boolean;
  overlayMenuActive: boolean;
  mobileMenuActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  constructor() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private _showLoggedLayout: WritableSignal<boolean> = signal(true);

  showLoggedLayout = this._showLoggedLayout.asReadonly();

  setLoggedLayout(value: boolean) {
    this._showLoggedLayout.set(value);
  }

  handleResize() {
    if (this.isDesktop()) {
      this.layoutState.update((prev) => ({
        ...prev,
        mobileMenuActive: false, // ferme mobile
        staticMenuDesktopInactive: false, // ouvre desktop
      }));
    } else {
      this.layoutState.update((prev) => ({
        ...prev,
        mobileMenuActive: false, // fermé par défaut
      }));
    }
  }

  layoutConfig = signal<LayoutConfig>({
    menuMode: 'static',
  });

  layoutState = signal<LayoutState>({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    mobileMenuActive: false,
  });

  isOverlay = computed(() => this.layoutConfig().menuMode === 'overlay');

  onMenuToggle() {
    if (this.isOverlay()) {
      this.layoutState.update((prev) => ({
        ...prev,
        overlayMenuActive: !this.layoutState().overlayMenuActive,
      }));
    }

    if (this.isDesktop()) {
      this.layoutState.update((prev) => ({
        ...prev,
        staticMenuDesktopInactive: !this.layoutState().staticMenuDesktopInactive,
      }));
    } else {
      this.layoutState.update((prev) => ({
        ...prev,
        mobileMenuActive: !this.layoutState().mobileMenuActive,
      }));
    }
  }

  isDesktop() {
    return window.innerWidth > 991;
  }
}
