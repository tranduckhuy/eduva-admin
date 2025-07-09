import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
    service.reset(); // Ensure clean state
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have isLoading as false initially', () => {
      expect(service.isLoading()).toBe(false);
    });

    it('should have is() return false for any key initially', () => {
      expect(service.is('default')()).toBe(false);
      expect(service.is('custom')()).toBe(false);
    });
  });

  describe('start and stop', () => {
    it('should start loading with default key', () => {
      service.start();
      expect(service.isLoading()).toBe(true);
      expect(service.is()()).toBe(true);
    });

    it('should start loading with custom key', () => {
      service.start('custom');
      expect(service.isLoading()).toBe(true);
      expect(service.is('custom')()).toBe(true);
      expect(service.is('default')()).toBe(false);
    });

    it('should stop loading with default key', () => {
      service.start();
      expect(service.isLoading()).toBe(true);

      service.stop();
      expect(service.isLoading()).toBe(false);
      expect(service.is()()).toBe(false);
    });

    it('should stop loading with custom key', () => {
      service.start('custom');
      expect(service.is('custom')()).toBe(true);

      service.stop('custom');
      expect(service.is('custom')()).toBe(false);
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('multiple loading keys', () => {
    it('should handle multiple loading keys simultaneously', () => {
      service.start('key1');
      service.start('key2');

      expect(service.is('key1')()).toBe(true);
      expect(service.is('key2')()).toBe(true);
      expect(service.isLoading()).toBe(true);
    });

    it('should stop specific key without affecting others', () => {
      service.start('key1');
      service.start('key2');

      service.stop('key1');

      expect(service.is('key1')()).toBe(false);
      expect(service.is('key2')()).toBe(true);
      expect(service.isLoading()).toBe(true);
    });

    it('should set isLoading to false when all keys are stopped', () => {
      service.start('key1');
      service.start('key2');

      service.stop('key1');
      service.stop('key2');

      expect(service.isLoading()).toBe(false);
    });
  });

  describe('reset', () => {
    it('should clear all loading states', () => {
      service.start('key1');
      service.start('key2');

      service.reset();

      expect(service.is('key1')()).toBe(false);
      expect(service.is('key2')()).toBe(false);
      expect(service.isLoading()).toBe(false);
    });

    it('should handle reset when no loading states exist', () => {
      expect(() => service.reset()).not.toThrow();
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('signal reactivity', () => {
    it('should update isLoading signal when starting loading', () => {
      expect(service.isLoading()).toBe(false);

      service.start();
      expect(service.isLoading()).toBe(true);
    });

    it('should update isLoading signal when stopping loading', () => {
      service.start();
      expect(service.isLoading()).toBe(true);

      service.stop();
      expect(service.isLoading()).toBe(false);
    });

    it('should update is() signal when starting specific key', () => {
      expect(service.is('custom')()).toBe(false);

      service.start('custom');
      expect(service.is('custom')()).toBe(true);
    });

    it('should update is() signal when stopping specific key', () => {
      service.start('custom');
      expect(service.is('custom')()).toBe(true);

      service.stop('custom');
      expect(service.is('custom')()).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle start/stop with empty string key', () => {
      service.start('');
      expect(service.is('')()).toBe(true);
      expect(service.isLoading()).toBe(true);

      service.stop('');
      expect(service.is('')()).toBe(false);
      expect(service.isLoading()).toBe(false);
    });

    it('should handle start/stop with special characters in key', () => {
      const specialKey = 'key-with-special-chars-123_!@#';
      service.start(specialKey);
      expect(service.is(specialKey)()).toBe(true);

      service.stop(specialKey);
      expect(service.is(specialKey)()).toBe(false);
    });

    it('should handle stop on non-existent key', () => {
      expect(() => service.stop('non-existent')).not.toThrow();
      expect(service.is('non-existent')()).toBe(false);
    });

    it('should handle multiple start calls on same key', () => {
      service.start('key1');
      service.start('key1');

      expect(service.is('key1')()).toBe(true);
      expect(service.isLoading()).toBe(true);
    });

    it('should handle multiple stop calls on same key', () => {
      service.start('key1');
      service.stop('key1');
      service.stop('key1');

      expect(service.is('key1')()).toBe(false);
      expect(service.isLoading()).toBe(false);
    });

    it('should handle start after reset', () => {
      service.start('key1');
      service.reset();
      service.start('key2');

      expect(service.is('key1')()).toBe(false);
      expect(service.is('key2')()).toBe(true);
      expect(service.isLoading()).toBe(true);
    });
  });

  describe('computed signals', () => {
    it('should have isLoading as computed signal', () => {
      expect(typeof service.isLoading).toBe('function');
      expect(service.isLoading()).toBe(false);
    });

    it('should have is() return computed signal', () => {
      const isSignal = service.is('test');
      expect(typeof isSignal).toBe('function');
      expect(isSignal()).toBe(false);
    });

    it('should update computed signals reactively', () => {
      const isLoadingSignal = service.isLoading;
      const isCustomSignal = service.is('custom');

      expect(isLoadingSignal()).toBe(false);
      expect(isCustomSignal()).toBe(false);

      service.start('custom');

      expect(isLoadingSignal()).toBe(true);
      expect(isCustomSignal()).toBe(true);
    });
  });
});
