import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

vi.mock('../../../../../environments/environment', () => ({
  environment: {
    baseApiUrl: 'http://localhost:3000',
    supabase: {
      url: 'https://dummy.supabase.co',
      key: 'dummy-key',
    },
  },
}));

const mockUpload = vi.fn();
const mockGetPublicUrl = vi.fn();
const mockSupabaseClient = {
  storage: {
    from: vi.fn(() => ({
      upload: mockUpload,
      getPublicUrl: mockGetPublicUrl,
    })),
  },
};

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabaseClient,
}));

import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { UploadFileService } from './upload-file.service';
import { RequestService } from '../../core/request/request.service';
import { ToastHandlingService } from '../../core/toast/toast-handling.service';
import { StatusCode } from '../../../constants/status-code.constant';

describe('UploadFileService', () => {
  let service: UploadFileService;
  let requestService: RequestService;
  let toastService: ToastHandlingService;
  let httpClient: HttpClient;

  beforeEach(() => {
    vi.resetAllMocks();
    mockUpload.mockReset();
    mockGetPublicUrl.mockReset();

    TestBed.configureTestingModule({
      providers: [
        UploadFileService,
        {
          provide: RequestService,
          useValue: {
            post: vi.fn(),
          },
        },
        {
          provide: ToastHandlingService,
          useValue: {
            error: vi.fn(),
            errorGeneral: vi.fn(),
          },
        },
        {
          provide: HttpClient,
          useValue: {
            put: vi.fn(),
          },
        },
      ],
    });
    service = TestBed.inject(UploadFileService);
    requestService = TestBed.inject(RequestService);
    toastService = TestBed.inject(ToastHandlingService);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('uploadBlobs', () => {
    const files = [new File(['foo'], 'foo.txt'), new File(['bar'], 'bar.txt')];
    const tokens = ['https://blob1?token=abc', 'https://blob2?token=def'];
    const uploadTokens = tokens;
    const uploadTokensShort = ['https://blob1?token=abc'];
    const uploadTokensLong = [
      'https://blob1?token=abc',
      'https://blob2?token=def',
      'https://blob3?token=ghi',
    ];
    const uploadTokensNoMatch: string[] = [];
    const fileStorageResponse = {
      uploadTokens,
      someOtherField: 'value',
    };
    const apiResponse = {
      statusCode: StatusCode.SUCCESS,
      data: fileStorageResponse,
    };

    it('should upload all files successfully and return source URLs', async () => {
      vi.mocked(requestService.post).mockReturnValue(of(apiResponse));
      vi.mocked(httpClient.put).mockReturnValue(of({}));

      await new Promise<void>(resolve => {
        service.uploadBlobs(['req1', 'req2'], files).subscribe(result => {
          expect(result).toEqual({
            ...fileStorageResponse,
            uploadTokens: ['https://blob1', 'https://blob2'],
          });
          expect(toastService.error).not.toHaveBeenCalled();
          resolve();
        });
      });
    });

    it('should show error and return null if status is not SUCCESS', async () => {
      vi.mocked(requestService.post).mockReturnValue(
        of({ statusCode: StatusCode.SYSTEM_ERROR })
      );
      await new Promise<void>(resolve => {
        service.uploadBlobs(['req1', 'req2'], files).subscribe(result => {
          expect(result).toBeNull();
          expect(toastService.errorGeneral).toHaveBeenCalled();
          resolve();
        });
      });
    });

    it('should show error and return null if no data', async () => {
      vi.mocked(requestService.post).mockReturnValue(
        of({ statusCode: StatusCode.SUCCESS, data: null })
      );
      await new Promise<void>(resolve => {
        service.uploadBlobs(['req1', 'req2'], files).subscribe(result => {
          expect(result).toBeNull();
          expect(toastService.errorGeneral).toHaveBeenCalled();
          resolve();
        });
      });
    });

    it('should show error and return null if tokens length does not match files', async () => {
      vi.mocked(requestService.post).mockReturnValue(
        of({
          statusCode: StatusCode.SUCCESS,
          data: { uploadTokens: uploadTokensShort },
        })
      );
      await new Promise<void>(resolve => {
        service.uploadBlobs(['req1', 'req2'], files).subscribe(result => {
          expect(result).toBeNull();
          expect(toastService.errorGeneral).toHaveBeenCalled();
          resolve();
        });
      });
    });

    it('should show error and return null if tokens length is longer than files', async () => {
      vi.mocked(requestService.post).mockReturnValue(
        of({
          statusCode: StatusCode.SUCCESS,
          data: { uploadTokens: uploadTokensLong },
        })
      );
      await new Promise<void>(resolve => {
        service.uploadBlobs(['req1', 'req2'], files).subscribe(result => {
          expect(result).toBeNull();
          expect(toastService.errorGeneral).toHaveBeenCalled();
          resolve();
        });
      });
    });

    it('should show error and return null if tokens is empty', async () => {
      vi.mocked(requestService.post).mockReturnValue(
        of({
          statusCode: StatusCode.SUCCESS,
          data: { uploadTokens: uploadTokensNoMatch },
        })
      );
      await new Promise<void>(resolve => {
        service.uploadBlobs(['req1', 'req2'], files).subscribe(result => {
          expect(result).toBeNull();
          expect(toastService.errorGeneral).toHaveBeenCalled();
          resolve();
        });
      });
    });

    it('should handle partial upload failures and show error toast', async () => {
      vi.mocked(requestService.post).mockReturnValue(of(apiResponse));
      // First file succeeds, second fails
      vi.mocked(httpClient.put)
        .mockReturnValueOnce(of({}))
        .mockReturnValueOnce(throwError(() => new Error('fail')));

      await new Promise<void>(resolve => {
        service.uploadBlobs(['req1', 'req2'], files).subscribe(result => {
          expect(result && result.uploadTokens).toEqual([
            'https://blob1',
            'https://blob2',
          ]);
          expect(toastService.error).toHaveBeenCalledWith(
            'Lỗi',
            expect.stringContaining('bar.txt')
          );
          resolve();
        });
      });
    });

    it('should handle API error and return null', async () => {
      vi.mocked(requestService.post).mockReturnValue(
        throwError(() => new Error('fail'))
      );
      await new Promise<void>(resolve => {
        service.uploadBlobs(['req1', 'req2'], files).subscribe(result => {
          expect(result).toBeNull();
          expect(toastService.errorGeneral).toHaveBeenCalled();
          resolve();
        });
      });
    });
  });

  describe('uploadFile', () => {
    const file = new File(['foo'], 'foo.txt');
    const fileName = 'foo.txt';
    const bucket = 'test-bucket';

    it('should upload file and return public URL on success', async () => {
      mockUpload.mockResolvedValue({ data: { path: 'foo.txt' }, error: null });
      mockGetPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://public.url/foo.txt' },
      });
      const result = await service.uploadFile(file, fileName, bucket);
      expect(result).toBe('https://public.url/foo.txt');
    });

    it('should return null and log error if upload fails', async () => {
      const error = { message: 'Upload failed' };
      mockUpload.mockResolvedValue({ data: null, error });
      const logSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = await service.uploadFile(file, fileName, bucket);
      expect(result).toBeNull();
      expect(logSpy).toHaveBeenCalledWith(
        'Upload error in bucket test-bucket:',
        error
      );
      logSpy.mockRestore();
    });

    it('should return null and log error if upload throws', async () => {
      mockUpload.mockRejectedValue(new Error('Unexpected error'));
      const logSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = await service.uploadFile(file, fileName, bucket);
      expect(result).toBeNull();
      expect(logSpy).toHaveBeenCalledWith(
        'Unexpected error:',
        expect.any(Error)
      );
      logSpy.mockRestore();
    });

    it('should return null if getPublicUrl returns no data', async () => {
      mockUpload.mockResolvedValue({ data: { path: 'foo.txt' }, error: null });
      mockGetPublicUrl.mockReturnValue({ data: null });
      const result = await service.uploadFile(file, fileName, bucket);
      expect(result).toBeNull();
    });
  });
});
