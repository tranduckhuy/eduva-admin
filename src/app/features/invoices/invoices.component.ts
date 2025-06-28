import {
  ChangeDetectionStrategy,
  Component,
  signal,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { TooltipModule } from 'primeng/tooltip';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';

import { LeadingZeroPipe } from '../../shared/pipes/leading-zero.pipe';

import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';

import { Invoice } from '../../shared/models/entities/invoice.model';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    SearchInputComponent,
    BadgeComponent,
    ButtonComponent,
    TableModule,
    LeadingZeroPipe,
    TooltipModule,
    RouterLink,
  ],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesComponent {
  invoices: Invoice[] = [
    {
      id: 1,
      client: {
        id: 101,
        name: 'Nguyễn Văn An',
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
        email: 'an.nguyen@example.com',
        phoneNumber: '+84901234567',
      },
      school: {
        id: 'SCH001',
        name: 'Trường THPT Nguyễn Trãi',
      },
      amount: 1500000,
      pricingPlan: {
        id: 'PP001',
        name: 'Gói Cơ Bản',
        description: 'Gói đăng ký hàng tháng cơ bản',
        price: 1500000,
        creditLimit: 100,
        storageLimit: 10,
        maxAccounts: 5,
        billingCycle: 'monthly',
      },
      status: 'paid',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
    },
    {
      id: 2,
      client: {
        id: 102,
        name: 'Trần Thị Mai',
        avatarUrl: 'https://i.pravatar.cc/150?img=2',
        email: 'mai.tran@example.com',
        phoneNumber: '+84987654321',
      },
      school: {
        id: 'SCH002',
        name: 'Trường Tiểu học Hoa Mai',
      },
      amount: 18000000,
      pricingPlan: {
        id: 'PP002',
        name: 'Gói Chuyên Nghiệp',
        description: 'Gói đăng ký hàng năm dành cho chuyên nghiệp',
        price: 18000000,
        creditLimit: 500,
        storageLimit: 100,
        maxAccounts: 50,
        billingCycle: 'yearly',
      },
      status: 'unpaid',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2025-01-31'),
    },
    {
      id: 3,
      client: {
        id: 103,
        name: 'Lê Văn Bình',
        avatarUrl: 'https://i.pravatar.cc/150?img=3',
        email: 'binh.le@example.com',
        phoneNumber: '+84911223344',
      },
      school: {
        id: 'SCH003',
        name: 'Trường THCS Sao Mai',
      },
      amount: 3000000,
      pricingPlan: {
        id: 'PP003',
        name: 'Gói Tiêu Chuẩn',
        price: 3000000,
        creditLimit: 200,
        storageLimit: 50,
        maxAccounts: 20,
        billingCycle: 'monthly',
      },
      status: 'overdue',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-31'),
    },
    {
      id: 4,
      client: {
        id: 104,
        name: 'Phạm Thị Hương',
        avatarUrl: 'https://i.pravatar.cc/150?img=4',
        email: 'huong.pham@example.com',
        phoneNumber: '+84876543210',
      },
      school: {
        id: 'SCH004',
        name: 'Trường Trung học phổ thông Bình Minh',
      },
      amount: 18000000,
      pricingPlan: {
        id: 'PP002',
        name: 'Gói Chuyên Nghiệp',
        description: 'Gói đăng ký hàng năm dành cho chuyên nghiệp',
        price: 18000000,
        creditLimit: 500,
        storageLimit: 100,
        maxAccounts: 50,
        billingCycle: 'yearly',
      },
      status: 'paid',
      startDate: new Date('2023-07-01'),
      endDate: new Date('2024-06-30'),
    },
    {
      id: 5,
      client: {
        id: 105,
        name: 'Vũ Minh Quân',
        avatarUrl: 'https://i.pravatar.cc/150?img=5',
        email: 'quan.vu@example.com',
        phoneNumber: '+84999887766',
      },
      school: {
        id: 'SCH005',
        name: 'Trường Đại học Công nghệ',
      },
      amount: 1500000,
      pricingPlan: {
        id: 'PP001',
        name: 'Gói Cơ Bản',
        price: 1500000,
        creditLimit: 100,
        storageLimit: 10,
        maxAccounts: 5,
        billingCycle: 'monthly',
      },
      status: 'unpaid',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-05-31'),
    },
    {
      id: 6,
      client: {
        id: 106,
        name: 'Hoàng Thị Lan',
        avatarUrl: 'https://i.pravatar.cc/150?img=6',
        email: 'lan.hoang@example.com',
        phoneNumber: '+84112233445',
      },
      school: {
        id: 'SCH006',
        name: 'Trường THPT Phan Đình Phùng',
      },
      amount: 3000000,
      pricingPlan: {
        id: 'PP003',
        name: 'Gói Tiêu Chuẩn',
        description: 'Gói đăng ký hàng tháng tiêu chuẩn',
        price: 3000000,
        creditLimit: 200,
        storageLimit: 50,
        maxAccounts: 20,
        billingCycle: 'monthly',
      },
      status: 'paid',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-30'),
    },
    {
      id: 7,
      client: {
        id: 107,
        name: 'Lâm Văn Hùng',
        avatarUrl: 'https://i.pravatar.cc/150?img=7',
        email: 'hung.lam@example.com',
        phoneNumber: '+84995544332',
      },
      school: {
        id: 'SCH007',
        name: 'Trường THCS Hoa Sen',
      },
      amount: 18000000,
      pricingPlan: {
        id: 'PP002',
        name: 'Gói Chuyên Nghiệp',
        price: 18000000,
        creditLimit: 500,
        storageLimit: 100,
        maxAccounts: 50,
        billingCycle: 'yearly',
      },
      status: 'overdue',
      startDate: new Date('2023-12-01'),
      endDate: new Date('2024-11-30'),
    },
    {
      id: 8,
      client: {
        id: 108,
        name: 'Trần Thị Hạnh',
        avatarUrl: 'https://i.pravatar.cc/150?img=8',
        email: 'hanh.tran@example.com',
        phoneNumber: '+84123498765',
      },
      school: {
        id: 'SCH008',
        name: 'Trường Tiểu học Mai Anh',
      },
      amount: 1500000,
      pricingPlan: {
        id: 'PP001',
        name: 'Gói Cơ Bản',
        price: 1500000,
        creditLimit: 100,
        storageLimit: 10,
        maxAccounts: 5,
        billingCycle: 'monthly',
      },
      status: 'paid',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-06-30'),
    },
    {
      id: 9,
      client: {
        id: 109,
        name: 'Nguyễn Văn Dũng',
        avatarUrl: 'https://i.pravatar.cc/150?img=9',
        email: 'dung.nguyen@example.com',
        phoneNumber: '+84997766554',
      },
      school: {
        id: 'SCH009',
        name: 'Trường THPT Lê Quý Đôn',
      },
      amount: 3000000,
      pricingPlan: {
        id: 'PP003',
        name: 'Gói Tiêu Chuẩn',
        price: 3000000,
        creditLimit: 200,
        storageLimit: 50,
        maxAccounts: 20,
        billingCycle: 'monthly',
      },
      status: 'unpaid',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-05-31'),
    },
    {
      id: 10,
      client: {
        id: 110,
        name: 'Phan Thị Thu',
        avatarUrl: 'https://i.pravatar.cc/150?img=10',
        email: 'thu.phan@example.com',
        phoneNumber: '+84889977665',
      },
      school: {
        id: 'SCH010',
        name: 'Trường Đại học Khoa học Tự nhiên',
      },
      amount: 18000000,
      pricingPlan: {
        id: 'PP002',
        name: 'Gói Chuyên Nghiệp',
        description: 'Gói đăng ký hàng năm dành cho chuyên nghiệp',
        price: 18000000,
        creditLimit: 500,
        storageLimit: 100,
        maxAccounts: 50,
        billingCycle: 'yearly',
      },
      status: 'paid',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
    },
  ];

  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);
  first = signal<number>(0);
  rows = signal<number>(10);

  @ViewChild('unarchiveDialogRef') unarchiveDialogRef!: DialogComponent;

  ngOnInit(): void {
    this.totalRecords.set(this.invoices.length);
  }

  loadProductsLazy(event: TableLazyLoadEvent) {}

  onSearchTriggered(term: string) {}

  next() {
    this.first.set(this.first() + this.rows());
  }

  prev() {
    this.first.set(this.first() - this.rows());
  }

  reset() {
    this.first.set(0);
  }

  pageChange(event: any) {
    this.first.set(event.first);
    this.rows.set(event.rows);
  }

  isLastPage(): boolean {
    return this.invoices
      ? this.first() + this.rows() >= this.invoices.length
      : true;
  }

  isFirstPage(): boolean {
    return this.invoices ? this.first() === 0 : true;
  }

  openUnarchiveDialog() {
    this.unarchiveDialogRef.showDialog();
  }

  get pagedInvoices() {
    return this.invoices.slice(this.first(), this.first() + this.rows());
  }
}
