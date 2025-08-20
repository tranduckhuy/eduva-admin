import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  effect,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AccordionItemComponent } from './accordion-item/accordion-item.component';
import { UserService } from '../../../shared/services/api/user/user.service';
import {
  type UserRoleType,
  UserRoles,
} from '../../../shared/constants/user-roles.constant';

type NavItem = {
  label: string;
  icon: string;
  type: 'link' | 'accordion' | 'button';
  link?: string;
  isDisabled?: boolean;
  suppressActive?: boolean;
  submenuItems: {
    label: string;
    link: string;
    isDisabled?: boolean;
  }[];
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
export class NavbarComponent {
  private readonly userService = inject(UserService);

  isSidebarCollapsed = input();

  closeSidebar = output();

  user = this.userService.currentUser;

  navConfigs = signal<NavbarConfig[]>([]);

  constructor() {
    effect(
      () => {
        const user = this.user();
        const userRole = user?.roles?.[0] as UserRoleType;

        this.navConfigs.set(this.getNavbarConfig(userRole));
      },
      { allowSignalWrites: true }
    );
  }

  get navConfigsArray(): NavbarConfig[] {
    return this.navConfigs();
  }

  private getNavbarConfig(role: UserRoleType): NavbarConfig[] {
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
            submenuItems: [],
          },
          {
            label: 'Người dùng',
            icon: 'people',
            type: 'accordion',
            submenuItems: [
              {
                label: 'Quản trị viên trường',
                link: '/admin/school-admins',
              },
              {
                label: 'Kiểm duyệt viên',
                link: '/admin/content-moderators',
              },
              { label: 'Giáo viên', link: '/admin/teachers' },
              { label: 'Học sinh', link: '/admin/students' },
            ],
          },
          {
            label: 'Gói thanh toán',
            icon: 'paid',
            type: 'accordion',
            submenuItems: [
              {
                label: 'Gói đăng ký',
                link: '/admin/subscription-plans',
              },
              {
                label: 'Gói credit',
                link: '/admin/credit-packs',
              },
            ],
          },
          {
            label: 'Lịch sử giao dịch',
            icon: 'receipt_long',
            link: '/admin/payments',
            type: 'link',
            submenuItems: [],
          },
        ],
      },
      {
        section: 'Khác',
        navItems: [
          {
            label: 'Cài đặt',
            icon: 'settings',
            link: '/admin/settings/account-settings',
            type: 'link',
            submenuItems: [],
          },
          {
            label: 'Cấu hình hệ thống',
            icon: 'manufacturing',
            link: '/admin/system-config',
            type: 'link',
            submenuItems: [],
          },
          {
            label: 'Đăng xuất',
            icon: 'logout',
            type: 'button',
            submenuItems: [],
          },
        ],
      },
    ];
  }
}
