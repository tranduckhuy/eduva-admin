import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { MessageService } from 'primeng/api'; // Import MessageService
import {
  ToastHandlingService,
  ToastExtraOptions,
} from './toast-handling.service'; // Adjust path as necessary

describe('ToastHandlingService', () => {
  let service: ToastHandlingService;
  let messageServiceMock: Partial<MessageService>;

  beforeEach(() => {
    // Create a mock for MessageService
    messageServiceMock = {
      add: vi.fn(),
      clear: vi.fn(),
    };

    // Configure TestBed to provide the ToastHandlingService and the mocked MessageService
    TestBed.configureTestingModule({
      providers: [
        ToastHandlingService,
        { provide: MessageService, useValue: messageServiceMock },
      ],
    });

    // Get the instance of ToastHandlingService from the TestBed injector
    service = TestBed.inject(ToastHandlingService);
  });

  // Test case for success method
  it('should call messageService.add with success severity', () => {
    const summary = 'Success Summary';
    const detail = 'Success Detail';
    service.success(summary, detail);

    expect(messageServiceMock.add).toHaveBeenCalledWith({
      severity: 'success',
      summary,
      detail,
      life: 3000,
      sticky: false,
      key: undefined,
      closable: true,
    });
  });

  // Test case for success method with options
  it('should call messageService.add with success severity and custom options', () => {
    const summary = 'Success Summary';
    const detail = 'Success Detail';
    const options: ToastExtraOptions = {
      life: 5000,
      sticky: true,
      key: 'myKey',
      closable: false,
    };
    service.success(summary, detail, options);

    expect(messageServiceMock.add).toHaveBeenCalledWith({
      severity: 'success',
      summary,
      detail,
      life: 5000,
      sticky: true,
      key: 'myKey',
      closable: false,
    });
  });

  // Test case for info method
  it('should call messageService.add with info severity', () => {
    const summary = 'Info Summary';
    const detail = 'Info Detail';
    service.info(summary, detail);

    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'info',
        summary,
        detail,
      })
    );
  });

  // Test case for warn method
  it('should call messageService.add with warn severity', () => {
    const summary = 'Warn Summary';
    const detail = 'Warn Detail';
    service.warn(summary, detail);

    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'warn',
        summary,
        detail,
      })
    );
  });

  // Test case for error method
  it('should call messageService.add with error severity', () => {
    const summary = 'Error Summary';
    const detail = 'Error Detail';
    service.error(summary, detail);

    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
        summary,
        detail,
      })
    );
  });

  // Test case for contrast method
  it('should call messageService.add with contrast severity', () => {
    const summary = 'Contrast Summary';
    const detail = 'Contrast Detail';
    service.contrast(summary, detail);

    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'contrast',
        summary,
        detail,
      })
    );
  });

  // Test case for secondary method
  it('should call messageService.add with secondary severity', () => {
    const summary = 'Secondary Summary';
    const detail = 'Secondary Detail';
    service.secondary(summary, detail);

    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'secondary',
        summary,
        detail,
      })
    );
  });

  // Test case for successGeneral method
  it('should call success with predefined general success messages', () => {
    // Spy on the success method to ensure it's called
    const successSpy = vi.spyOn(service, 'success');
    service.successGeneral();

    expect(successSpy).toHaveBeenCalledWith(
      'Thành công',
      'Thao tác đã được thực hiện thành công.',
      undefined
    );
    successSpy.mockRestore(); // Restore the original method
  });

  // Test case for successGeneral method with options
  it('should call success with predefined general success messages and custom options', () => {
    const options: ToastExtraOptions = { life: 1000 };
    const successSpy = vi.spyOn(service, 'success');
    service.successGeneral(options);

    expect(successSpy).toHaveBeenCalledWith(
      'Thành công',
      'Thao tác đã được thực hiện thành công.',
      options
    );
    successSpy.mockRestore();
  });

  // Test case for errorGeneral method
  it('should call error with predefined general error messages', () => {
    // Spy on the error method to ensure it's called
    const errorSpy = vi.spyOn(service, 'error');
    service.errorGeneral();

    expect(errorSpy).toHaveBeenCalledWith(
      'Lỗi hệ thống',
      'Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.',
      undefined
    );
    errorSpy.mockRestore();
  });

  // Test case for errorGeneral method with options
  it('should call error with predefined general error messages and custom options', () => {
    const options: ToastExtraOptions = { sticky: true };
    const errorSpy = vi.spyOn(service, 'error');
    service.errorGeneral(options);

    expect(errorSpy).toHaveBeenCalledWith(
      'Lỗi hệ thống',
      'Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.',
      options
    );
    errorSpy.mockRestore();
  });

  // Test case for clear method without key
  it('should call messageService.clear without a key', () => {
    service.clear();
    expect(messageServiceMock.clear).toHaveBeenCalledWith(undefined);
  });

  // Test case for clear method with a key
  it('should call messageService.clear with a key', () => {
    const key = 'myToastKey';
    service.clear(key);
    expect(messageServiceMock.clear).toHaveBeenCalledWith(key);
  });
});
