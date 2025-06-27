import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  ChangeDetectorRef,
  signal,
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

  navConfigs = signal<NavbarConfig[]>([
    {
      section: 'Thống kê',
      navItems: [
        {
          label: 'Bảng thống kê',
          icon: 'dashboard',
          link: '/',
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
          label: 'Trường học',
          icon: 'school',
          link: '/schools',
          type: 'link',
          isActive: false,
          submenuItems: [],
        },
        {
          label: 'Người dùng',
          icon: 'people',
          type: 'accordion',
          isActive: false,
          submenuItems: [
            {
              label: 'School admins',
              link: '/school-admins',
              active: true,
            },
            { label: 'Giáo viên', link: '/teachers', active: true },
            { label: 'Học sinh', link: '/students', active: true },
            {
              label: 'Kiểm duyệt nội dung',
              link: '/content-moderators',
              active: true,
            },
          ],
        },
        {
          label: 'Gói thanh toán',
          icon: 'paid',
          type: 'accordion',
          isActive: false,
          submenuItems: [
            {
              label: 'Gói đăng ký',
              link: '/subscription-plans',
              active: true,
            },
            { label: 'Gói credit', link: '/credit-packs', active: true },
          ],
        },
        {
          label: 'Hóa đơn',
          icon: 'receipt_long',
          link: '/invoices',
          type: 'link',
          isActive: false,
          submenuItems: [],
        },
        {
          label: 'Học tập',
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
          label: 'Tài liệu',
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
            { label: 'Cấu hình hệ thống', link: '/system-config' },
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
  ]);

  constructor(
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
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
    const navConfigs = this.navConfigs();
    // Create a new array to hold the updated configs
    const updatedConfigs = navConfigs.map(section => ({
      ...section,
      navItems: section.navItems.map(item => ({
        ...item,
        isActive: false,
        submenuItems: item.submenuItems.map(sub => ({
          ...sub,
          active: false,
        })),
      })),
    }));

    // Update active states based on current URL
    for (const section of updatedConfigs) {
      for (const item of section.navItems) {
        // First check submenu items
        if (item.submenuItems?.length > 0) {
          const hasActiveSubmenu = item.submenuItems.some(sub => {
            if (
              sub.link &&
              sub.link !== '#!' &&
              currentUrl.startsWith(sub.link)
            ) {
              sub.active = true;
              return true;
            }
            return false;
          });

          if (hasActiveSubmenu) {
            item.isActive = true;
          }
        }

        // Then check direct link match
        if (
          item.link &&
          item.link !== '#!' &&
          currentUrl.startsWith(item.link)
        ) {
          item.isActive = true;
        }
      }
    }

    // Update the signal with new configs
    this.navConfigs.set(updatedConfigs);
  }
}
