import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

import { AccordionItemComponent } from './accordion-item/accordion-item.component';

type NavItem = {
  label: string;
  icon: string;
  type: 'link' | 'accordion';
  link?: string;
  isActive: boolean;
  submenuItems: { label: string; link: string; active?: boolean }[];
};

type NavbarConfig = {
  section: string;
  navItems: NavItem[];
};

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, AccordionItemComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  closeSidebar = output();
  isSidebarCollapsed = input();

  navConfigs: NavbarConfig[] = [
    {
      section: 'Thống kê',
      navItems: [
        {
          label: 'Bảng thống kê',
          icon: 'dashboard',
          type: 'link',
          isActive: true,
          submenuItems: [],
        },
      ],
    },
    {
      section: 'Quản lý',
      navItems: [
        {
          label: 'Quản lý trường học',
          icon: 'school',
          link: '/admin/schools',
          type: 'link',
          isActive: false,
          submenuItems: [],
        },
        {
          label: 'Quản lý school admins',
          icon: 'local_library',
          link: '/admin/school-admins',
          type: 'link',
          isActive: false,
          submenuItems: [],
        },
        {
          label: 'Quản lý giáo viên',
          icon: 'co_present',
          link: '/admin/teachers',
          type: 'link',
          isActive: false,
          submenuItems: [],
        },
        {
          label: 'Quản lý học sinh',
          icon: 'person_edit',
          link: '/admin/students',
          type: 'link',
          isActive: false,
          submenuItems: [],
        },
        {
          label: 'Quản lý học tập',
          icon: 'auto_stories',
          type: 'accordion',
          isActive: false,
          submenuItems: [
            { label: 'Subject List', link: '#!', active: true },
            { label: 'Subject Detail', link: '#!' },
            { label: 'Lesson Preview', link: '#!' },
            { label: 'Create Subject', link: '#!' },
            { label: 'Edit Subject', link: '#!' },
            { label: 'Instructors', link: '#!' },
          ],
        },
        {
          label: 'Quản lý tài liệu',
          icon: 'folder_open',
          type: 'accordion',
          isActive: false,
          submenuItems: [
            { label: 'My Drive', link: '#!', active: true },
            { label: 'Assets', link: '#!' },
            { label: 'Personal', link: '#!' },
            { label: 'Documents', link: '#!' },
            { label: 'Media', link: '#!' },
          ],
        },
      ],
    },
    {
      section: 'Khác',
      navItems: [
        {
          label: 'Trang cá nhân',
          icon: 'account_circle',
          type: 'link',
          isActive: false,
          submenuItems: [],
        },
        {
          label: 'Cài đặt',
          icon: 'settings',
          type: 'accordion',
          isActive: false,
          submenuItems: [
            { label: 'Account Settings', link: '#!', active: true },
            { label: 'Change Password', link: '#!' },
            { label: 'Privacy Policy', link: '#!' },
            { label: 'Terms & Conditions', link: '#!' },
          ],
        },
        {
          label: 'Đăng xuất',
          icon: 'logout',
          type: 'link',
          isActive: false,
          submenuItems: [],
        },
      ],
    },
  ];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Immediately update for current route on init
    this.updateActiveNav(this.router.url);

    // Listen to route changes
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe(event => {
        this.updateActiveNav(event.url);
        // Trigger change detection to update the view
        this.cdr.detectChanges();
      });
  }

  private updateActiveNav(currentUrl: string) {
    // Reset all active states first
    for (const section of this.navConfigs) {
      for (const item of section.navItems) {
        item.isActive = false;
        if (item.submenuItems) {
          item.submenuItems.forEach(sub => (sub.active = false));
        }
      }
    }

    // Then set active states based on current URL
    for (const section of this.navConfigs) {
      for (const item of section.navItems) {
        // Check for direct link match
        if (
          item.link &&
          item.link !== '#!' &&
          currentUrl.startsWith(item.link)
        ) {
          item.isActive = true;
        }

        // Check submenu items
        if (item.submenuItems?.length > 0) {
          const hasActiveSubmenu = item.submenuItems.some(
            sub =>
              sub.link && sub.link !== '#!' && currentUrl.startsWith(sub.link)
          );

          if (hasActiveSubmenu) {
            item.isActive = true;
            item.submenuItems.forEach(sub => {
              if (
                sub.link &&
                sub.link !== '#!' &&
                currentUrl.startsWith(sub.link)
              ) {
                sub.active = true;
              }
            });
          }
        }
      }
    }
  }
}
