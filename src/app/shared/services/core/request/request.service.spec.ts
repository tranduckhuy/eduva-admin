vi.mock('../../../utils/request-utils', () => ({
  createRequestParams: vi.fn(
    () => new (require('@angular/common/http').HttpParams)()
  ),
  buildHttpContext: vi.fn(
    () => new (require('@angular/common/http').HttpContext)()
  ),
}));

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpParams,
  HttpContext,
} from '@angular/common/http';
import { of } from 'rxjs';

import { RequestService } from './request.service';
import * as requestUtils from '../../../utils/request-utils';

describe('RequestService', () => {
  let service: RequestService;
  let httpClientSpy: Record<string, any>;

  beforeEach(() => {
    httpClientSpy = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        RequestService,
        { provide: HttpClient, useValue: httpClientSpy },
      ],
    });
    service = TestBed.inject(RequestService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should call HttpClient.get with correct params', () => {
      const url = '/api/test';
      const params = { a: 1 };
      const options = {};
      const response = { data: 'ok' };
      httpClientSpy['get'].mockReturnValue(of(response));
      vi.mocked(requestUtils.createRequestParams).mockReturnValue(
        new HttpParams()
      );
      vi.mocked(requestUtils.buildHttpContext).mockReturnValue(
        new HttpContext()
      );

      const obs = service.get(url, params, options);
      obs.subscribe(res => {
        expect(res).toBe(response);
      });
      expect(httpClientSpy['get']).toHaveBeenCalledWith(url, {
        params: new HttpParams(),
        context: new HttpContext(),
      });
    });

    it('should handle undefined params and options', () => {
      const url = '/api/test';
      const response = { data: 'ok' };
      httpClientSpy['get'].mockReturnValue(of(response));
      vi.mocked(requestUtils.createRequestParams).mockReturnValue(
        new HttpParams()
      );
      vi.mocked(requestUtils.buildHttpContext).mockReturnValue(
        new HttpContext()
      );

      const obs = service.get(url);
      obs.subscribe(res => {
        expect(res).toBe(response);
      });
      expect(httpClientSpy['get']).toHaveBeenCalledWith(url, {
        params: new HttpParams(),
        context: new HttpContext(),
      });
    });
  });

  describe('getFile', () => {
    it('should call HttpClient.get with responseType blob and observe response', () => {
      const url = '/api/file';
      const params = { id: 1 };
      const options = {};
      const response = new HttpResponse({ body: new Blob(['test']) });
      httpClientSpy['get'].mockReturnValue(of(response));
      vi.mocked(requestUtils.createRequestParams).mockReturnValue(
        new HttpParams()
      );
      vi.mocked(requestUtils.buildHttpContext).mockReturnValue(
        new HttpContext()
      );

      const obs = service.getFile(url, params, options);
      obs.subscribe(res => {
        expect(res).toBe(response);
      });
      expect(httpClientSpy['get']).toHaveBeenCalledWith(url, {
        params: new HttpParams(),
        context: new HttpContext(),
        responseType: 'blob',
        observe: 'response',
      });
    });
  });

  describe('post', () => {
    it('should call HttpClient.post with JSON stringified body and headers', () => {
      const url = '/api/post';
      const body = { foo: 'bar' };
      const options = {};
      const response = { data: 123 };
      httpClientSpy['post'].mockReturnValue(of(response));
      vi.mocked(requestUtils.buildHttpContext).mockReturnValue(
        new HttpContext()
      );

      const obs = service.post(url, body, options);
      obs.subscribe(res => {
        expect(res).toBe(response);
      });
      expect(httpClientSpy['post']).toHaveBeenCalledWith(
        url,
        JSON.stringify(body),
        {
          headers: expect.any(HttpHeaders),
          context: new HttpContext(),
        }
      );
    });

    it('should handle undefined body', () => {
      const url = '/api/post';
      const response = { data: 123 };
      httpClientSpy['post'].mockReturnValue(of(response));
      vi.mocked(requestUtils.buildHttpContext).mockReturnValue(
        new HttpContext()
      );

      const obs = service.post(url);
      obs.subscribe(res => {
        expect(res).toBe(response);
      });
      expect(httpClientSpy['post']).toHaveBeenCalledWith(
        url,
        JSON.stringify({}),
        {
          headers: expect.any(HttpHeaders),
          context: new HttpContext(),
        }
      );
    });
  });

  describe('postFormData', () => {
    it('should call HttpClient.post with FormData', () => {
      const url = '/api/upload';
      const formData = new FormData();
      formData.append('file', new Blob(['test']));
      const options = {};
      const response = { data: 'uploaded' };
      httpClientSpy['post'].mockReturnValue(of(response));
      vi.mocked(requestUtils.buildHttpContext).mockReturnValue(
        new HttpContext()
      );

      const obs = service.postFormData(url, formData, options);
      obs.subscribe(res => {
        expect(res).toBe(response);
      });
      expect(httpClientSpy['post']).toHaveBeenCalledWith(url, formData, {
        context: new HttpContext(),
      });
    });
  });

  describe('postFile', () => {
    it('should call HttpClient.post with FormData and expect blob response', () => {
      const url = '/api/upload-file';
      const formData = new FormData();
      formData.append('file', new Blob(['test']));
      const options = {};
      const response = new HttpResponse({ body: new Blob(['file']) });
      httpClientSpy['post'].mockReturnValue(of(response));
      vi.mocked(requestUtils.buildHttpContext).mockReturnValue(
        new HttpContext()
      );

      const obs = service.postFile(url, formData, options);
      obs.subscribe(res => {
        expect(res).toBe(response);
      });
      expect(httpClientSpy['post']).toHaveBeenCalledWith(url, formData, {
        context: new HttpContext(),
        responseType: 'blob',
        observe: 'response',
      });
    });
  });

  describe('put', () => {
    it('should call HttpClient.put with JSON stringified body and headers', () => {
      const url = '/api/put';
      const body = { foo: 'bar' };
      const options = {};
      const response = { data: 123 };
      httpClientSpy['put'].mockReturnValue(of(response));
      vi.mocked(requestUtils.buildHttpContext).mockReturnValue(
        new HttpContext()
      );

      const obs = service.put(url, body, options);
      obs.subscribe(res => {
        expect(res).toBe(response);
      });
      expect(httpClientSpy['put']).toHaveBeenCalledWith(
        url,
        JSON.stringify(body),
        {
          headers: expect.any(HttpHeaders),
          context: new HttpContext(),
        }
      );
    });

    it('should handle undefined body', () => {
      const url = '/api/put';
      const response = { data: 123 };
      httpClientSpy['put'].mockReturnValue(of(response));
      vi.mocked(requestUtils.buildHttpContext).mockReturnValue(
        new HttpContext()
      );

      const obs = service.put(url);
      obs.subscribe(res => {
        expect(res).toBe(response);
      });
      expect(httpClientSpy['put']).toHaveBeenCalledWith(
        url,
        JSON.stringify({}),
        {
          headers: expect.any(HttpHeaders),
          context: new HttpContext(),
        }
      );
    });
  });

  describe('delete', () => {
    it('should call HttpClient.delete with correct url and context', () => {
      const url = '/api/delete';
      const options = {};
      const response = { data: 'deleted' };
      httpClientSpy['delete'].mockReturnValue(of(response));
      vi.mocked(requestUtils.buildHttpContext).mockReturnValue(
        new HttpContext()
      );

      const obs = service.delete(url, options);
      obs.subscribe(res => {
        expect(res).toBe(response);
      });
      expect(httpClientSpy['delete']).toHaveBeenCalledWith(url, {
        context: new HttpContext(),
      });
    });
  });
});
