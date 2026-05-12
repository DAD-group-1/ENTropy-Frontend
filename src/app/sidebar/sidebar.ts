import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

interface MenuItem {
  icon: string;
  label: string;
  children?: MenuItem[];
  isOpen?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [NgClass],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() isSidebarCollapsed = false;

  // TODO: This should be set based on the actual current page, possibly using Angular's Router
  protected currentPage: string | undefined = 'Home';

  menuItems: MenuItem[] = [
    {
      icon: 'pi pi-home',
      label: 'Home',
    },
    {
      icon: 'pi pi-calendar',
      label: 'Calendar',
    },
    {
      icon: 'pi pi-chart-bar',
      label: 'Grades',
    },
    {
      icon: 'pi pi-times-circle',
      label: 'Absence Records',
    },
    {
      icon: 'pi pi-book',
      label: 'Assignments',
    },
    {
      icon: 'pi pi-box',
      label: 'Resources',
    },
    {
      icon: 'pi pi-info-circle',
      label: 'Information',
    },
  ];

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleMenuItem(item: MenuItem) {
    // Only toggle if sidebar is not collapsed and item has children
    if (!this.isSidebarCollapsed && item.children) {
      item.isOpen = !item.isOpen;
    }
  }
}
