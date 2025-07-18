import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { DatePipe } from '@angular/common';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { CreditTransactionDetail } from '../model/credit-transaction-detail';
import { SchoolSubscriptionDetail } from '../model/school-subscription-detail.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { base64Img } from '../../../shared/constants/logoBase64.constant';

@Component({
  selector: 'app-export-invoice-pdf',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './export-invoice-pdf.component.html',
  styleUrls: ['./export-invoice-pdf.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportInvoicePdfComponent {
  private readonly datePipe = inject(DatePipe);

  readonly isCreditPack = input<boolean>(false);
  readonly creditTransactionDetail = input<CreditTransactionDetail | null>();
  readonly schoolSubscriptionDetail = input<SchoolSubscriptionDetail | null>();

  async exportToPdf() {
    await this.createFormattedPdf('Hóa_đơn_EDUVA.pdf');
  }

  private async createFormattedPdf(fileName: string = 'document.pdf') {
    const pdf = new jsPDF();
    const isCredit = this.isCreditPack();

    const creditDetail = this.creditTransactionDetail?.();
    const subscriptionDetail = this.schoolSubscriptionDetail?.();
    const user = isCredit ? creditDetail?.user : subscriptionDetail?.user;
    const transaction = isCredit
      ? creditDetail
      : subscriptionDetail?.paymentTransaction;
    const plan = subscriptionDetail?.plan;
    const amount = transaction?.amount;
    const planPrice = plan?.price;
    const deductedAmount = amount && planPrice ? amount - planPrice : 0;

    const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      for (const byte of bytes) {
        binary += String.fromCharCode(byte);
      }
      return window.btoa(binary);
    };

    try {
      const fontName = 'Nunito';
      const regular = await fetch(
        'assets/fonts/Nunito/Nunito-Regular.ttf'
      ).then(res => res.arrayBuffer());
      const bold = await fetch('assets/fonts/Nunito/Nunito-Bold.ttf').then(
        res => res.arrayBuffer()
      );
      pdf.addFileToVFS('Nunito-Regular.ttf', arrayBufferToBase64(regular));
      pdf.addFileToVFS('Nunito-Bold.ttf', arrayBufferToBase64(bold));
      pdf.addFont('Nunito-Regular.ttf', fontName, 'normal');
      pdf.addFont('Nunito-Bold.ttf', fontName, 'bold');
      pdf.setFont(fontName, 'normal');
    } catch {
      pdf.setFont('helvetica');
    }

    pdf.addImage(base64Img, 'PNG', 10, 10, 10, 10);
    pdf.setFontSize(16).setFont('Nunito', 'bold');
    pdf.text(`EDUVA Hóa Đơn: #${transaction?.transactionCode ?? ''}`, 24, 17);

    pdf.setFontSize(12);
    const rightColX = 110;
    // Chuẩn bị dữ liệu hai cột
    const leftCol = [
      { text: 'Hóa đơn từ:', font: 'normal' },
      { text: 'EDUVA', font: 'bold' },
      { text: 'Địa chỉ: Đại học FPT Quy Nhơn, Tỉnh Gia Lai', font: 'normal' },
      { text: 'Số điện thoại: 01234543234', font: 'normal' },
      { text: 'Email: eduva@contact.com', font: 'normal' },
    ];
    const rightCol = [
      { text: 'Hóa đơn đến:', font: 'normal' },
      { text: user?.fullName ?? '', font: 'bold' },
      {
        text: `Số điện thoại: ${user?.phoneNumber ?? 'Chưa cập nhật'}`,
        font: 'normal',
      },
      { text: `Email: ${user?.email ?? ''}`, font: 'normal' },
      {
        text: !isCredit
          ? `Trường: ${subscriptionDetail?.school?.name ?? ''}`
          : '',
        font: 'normal',
      },
    ];
    const maxRows = Math.max(leftCol.length, rightCol.length);
    let y = 30;
    const lineSpacing = pdf.getLineHeight() * 0.7;
    for (let i = 0; i < maxRows; i++) {
      // Left column
      if (leftCol[i]) {
        pdf.setFont('Nunito', leftCol[i].font);
        pdf.text(leftCol[i].text, 10, y);
      }
      // Right column
      if (rightCol[i] && rightCol[i].text) {
        pdf.setFont('Nunito', rightCol[i].font);
        if (i === 1) {
          // Tên user, có thể dài nhiều dòng
          const userNameLines = pdf.splitTextToSize(rightCol[i].text, 80);
          pdf.text(userNameLines, rightColX, y);
          y += userNameLines.length * lineSpacing;
          if (userNameLines.length > 1) {
            y += lineSpacing * -0.5;
          }
          continue;
        } else {
          pdf.text(rightCol[i].text, rightColX, y, { maxWidth: 80 });
        }
      }
      y += lineSpacing;
    }

    const nextSectionY = y + 5;
    pdf.setFont('Nunito', 'normal');
    pdf.text('Mã hóa đơn:', 10, nextSectionY);
    pdf.text(transaction?.transactionCode ?? '', 10, nextSectionY + 7);
    pdf.text('Tổng tiền:', 10, nextSectionY + 15);
    pdf.text(
      `${isCredit ? creditDetail?.aiCreditPack.price : transaction?.amount} ₫`,
      10,
      nextSectionY + 22
    );
    pdf.text('Ngày bắt đầu:', rightColX, nextSectionY);
    pdf.text(
      this.datePipe.transform(
        isCredit ? creditDetail?.createdAt : subscriptionDetail?.startDate,
        'medium'
      ) ?? '',
      rightColX,
      nextSectionY + 7
    );
    pdf.text('Ngày kết thúc:', rightColX, nextSectionY + 15);
    pdf.text(
      this.datePipe.transform(
        isCredit ? creditDetail?.createdAt : subscriptionDetail?.endDate,
        'mediumDate'
      ) ?? '',
      rightColX,
      nextSectionY + 22
    );

    const afterTextY = nextSectionY + 22;

    autoTable(pdf, {
      startY: afterTextY + 10,
      margin: { left: 10 },
      head: [
        isCredit
          ? ['STT', 'TÊN GÓI', 'SỐ LƯỢNG CREDITS', 'CREDITS TẶNG THÊM', 'GIÁ']
          : [
              'STT',
              'TÊN GÓI',
              'DUNG LƯỢNG LƯU TRỮ',
              'SỐ LƯỢNG TÀI KHOẢN',
              'LOẠI GÓI',
              'GIÁ',
            ],
      ],
      body: [
        isCredit
          ? [
              '01',
              creditDetail?.aiCreditPack.name ?? '',
              creditDetail?.aiCreditPack.credits ?? 0,
              creditDetail?.aiCreditPack.bonusCredits ?? 0,
              `${creditDetail?.aiCreditPack.price ?? 0} đ`,
            ]
          : [
              '01',
              plan?.name ?? '',
              plan?.maxUsers ?? 0,
              plan?.storageLimitGB ?? 0,
              subscriptionDetail?.billingCycle === 0 ? 'Tháng' : 'Năm',
              `${plan?.price ?? 0} đ`,
            ],
      ],
      styles: {
        font: 'Nunito',
        fontSize: 10,
        cellPadding: 3,
        overflow: 'linebreak',
      },
      headStyles: {
        fontStyle: 'bold',
      },
      foot: isCredit
        ? [['', '', '', 'Tổng:', `${creditDetail?.aiCreditPack.price ?? 0} ₫`]]
        : [
            ['', '', '', '', 'Giảm giá:', `${deductedAmount} ₫`],
            ['', '', '', '', 'Tổng:', `${transaction?.amount ?? 0} ₫`],
          ],
      footStyles: {
        fillColor: [255, 255, 255],
        textColor: [32, 147, 231],
        fontStyle: 'bold',
      },
    });

    pdf.save(fileName);
  }
}
