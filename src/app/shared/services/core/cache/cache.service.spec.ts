import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { CacheService } from './cache.service';

const TEST_URL = '/api/test';
const TEST_BODY = { foo: 'bar' };
const TTL = 1000; // 1 second

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CacheService);
    service.clear(); // Ensure clean state
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('set and get', () => {
    it('should store and retrieve a value', () => {
      service.set(TEST_URL, TEST_BODY, TTL);
      expect(service.get(TEST_URL)).toEqual(TEST_BODY);
    });

    it('should return null for missing key', () => {
      expect(service.get('/api/unknown')).toBeNull();
    });

    it('should overwrite existing value for same key', () => {
      service.set(TEST_URL, { foo: 1 }, TTL);
      service.set(TEST_URL, { foo: 2 }, TTL);
      expect(service.get(TEST_URL)).toEqual({ foo: 2 });
    });
  });

  describe('expiry', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return null if cache is expired', () => {
      service.set(TEST_URL, TEST_BODY, 1); // 1 ms TTL
      // Simulate expiry
      vi.advanceTimersByTime(2);
      expect(service.get(TEST_URL)).toBeNull();
    });

    it('should delete expired cache entry', () => {
      service.set(TEST_URL, TEST_BODY, 1);
      vi.advanceTimersByTime(2);
      service.get(TEST_URL); // triggers expiry check
      // Now the cache should not have the key
      expect((service as any).cache.has(TEST_URL)).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear a specific key', () => {
      service.set(TEST_URL, TEST_BODY, TTL);
      service.clear(TEST_URL);
      expect(service.get(TEST_URL)).toBeNull();
    });

    it('should clear all keys when called without argument', () => {
      service.set(TEST_URL, TEST_BODY, TTL);
      service.set('/api/other', { bar: 1 }, TTL);
      service.clear();
      expect(service.get(TEST_URL)).toBeNull();
      expect(service.get('/api/other')).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle set with no TTL (use default)', () => {
      service.set(TEST_URL, TEST_BODY);
      expect(service.get(TEST_URL)).toEqual(TEST_BODY);
    });

    it('should handle clear on non-existent key gracefully', () => {
      expect(() => service.clear('/not-in-cache')).not.toThrow();
    });

    it('should handle get after clear all', () => {
      service.set(TEST_URL, TEST_BODY, TTL);
      service.clear();
      expect(service.get(TEST_URL)).toBeNull();
    });
  });
});
