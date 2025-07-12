import {
  ChangeDetectionStrategy,
  Component,
  ChangeDetectorRef,
  OnInit,
  input,
  output,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';

import { filter } from 'rxjs';

import { AccordionItemComponent } from './accordion-item/accordion-item.component';
import { UserService } from '../../../shared/services/api/user/user.service';
import {
  UserRole,
  UserRoles,
} from '../../../shared/constants/user-roles.constant';

type NavItem = {
  label: string;
  icon: string;
  type: 'link' | 'accordion' | 'button';
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
  imports: [CommonModule, RouterLink, AccordionItemComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly userService = inject(UserService);

  isSidebarCollapsed = input();

  navConfigs = signal<NavbarConfig[]>([]);
  closeSidebar = output();

  user = this.userService.currentUser;

  ngOnInit(): void {
    const user = this.user();
    const userRole = user?.roles?.[0] as UserRole;
    this.navConfigs.set(this.getNavbarConfigByRole(userRole));

    this.setActiveNavItems(this.router.url);

    // ? Listen to router events to update active states
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.setActiveNavItems(event.urlAfterRedirects);
      });
  }

  private setActiveNavItems(url: string) {
    const path = url.split('?')[0]; // ? Just get path name

    this.navConfigs().forEach(section => {
      section.navItems.forEach(item => {
        // ? Match exact main nav item by path only
        item.isActive = item.link === path;

        // ? Reset and re-check submenu
        item.submenuItems.forEach(sub => {
          sub.active = sub.link === path;
          if (sub.active) {
            item.isActive = true; // ? If submenu is active, parent is also active
          }
        });
      });
    });

    this.cdr.markForCheck();
  }

  private getNavbarConfigByRole(role: UserRole): NavbarConfig[] {
    if (role !== UserRoles.SYSTEM_ADMIN) return [];

    return [
      {
        section: 'Thống kê',
        navItems: [
          {
            label: 'Bảng thống kê',
            icon: 'dashboard',
            type: 'link',
            link: '/admin',
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
            link: '/admin/schools',
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
                label: 'Quản trị viên trường',
                link: '/admin/school-admins',
                active: true,
              },
              {
                label: 'Kiểm duyệt viên',
                link: '/admin/content-moderators',
                active: true,
              },
              { label: 'Giáo viên', link: '/admin/teachers', active: true },
              { label: 'Học sinh', link: '/admin/students', active: true },
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
                link: '/admin/subscription-plans',
                active: true,
              },
              {
                label: 'Gói credit',
                link: '/admin/credit-packs',
                active: true,
              },
            ],
          },
          {
            label: 'Lịch sử giao dịch',
            icon: 'receipt_long',
            link: '/admin/payments',
            type: 'link',
            isActive: false,
            submenuItems: [],
          },
        ],
      },
      {
        section: 'Khác',
        navItems: [
          {
            label: 'Trang cá nhân',
            icon: 'account_circle',
            link: '/admin/settings',
            type: 'link',
            isActive: false,
            submenuItems: [],
          },
          {
            label: 'Đăng xuất',
            icon: 'logout',
            type: 'button',
            isActive: false,
            submenuItems: [],
          },
        ],
      },
    ];
  }
}
