import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Type, Injector } from '@angular/core';

import { GlobalModalService } from './global-modal.service';
import { MODAL_DATA } from '../../../tokens/injection/modal-data.token';

// Mock component for testing
class MockComponent {
  static mockType = 'MockComponent';
}

class AnotherMockComponent {
  static mockType = 'AnotherMockComponent';
}

describe('GlobalModalService', () => {
  let service: GlobalModalService;
  let mockInjector: any;

  beforeEach(() => {
    // Mock Injector.create
    mockInjector = {
      create: vi.fn().mockReturnValue({ mock: 'injector' }),
    };

    TestBed.configureTestingModule({
      providers: [GlobalModalService],
    });

    service = TestBed.inject(GlobalModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have isOpen signal initialized to false', () => {
      expect(service.isOpen()).toBe(false);
    });

    it('should have component signal initialized to null', () => {
      expect(service.component()).toBe(null);
    });

    it('should have data signal initialized to null', () => {
      expect(service.data()).toBe(null);
    });

    it('should have injector signal initialized to undefined', () => {
      expect(service.injector()).toBe(undefined);
    });

    it('should have modalClass signal initialized to empty string', () => {
      expect(service.modalClass()).toBe('');
    });
  });

  describe('open', () => {
    it('should open modal with component only', () => {
      service.open(MockComponent);

      expect(service.isOpen()).toBe(true);
      expect(service.component()).toBe(MockComponent);
      expect(service.data()).toBe(null);
      expect(service.modalClass()).toBe('');
    });

    it('should open modal with component and data', () => {
      const testData = { key: 'value', number: 123 };
      service.open(MockComponent, testData);

      expect(service.isOpen()).toBe(true);
      expect(service.component()).toBe(MockComponent);
      expect(service.data()).toEqual(testData);
      expect(service.modalClass()).toBe('');
    });

    it('should open modal with component, data, and modalClass', () => {
      const testData = { user: { id: 1, name: 'John' } };
      const modalClass = 'custom-modal-class';
      service.open(MockComponent, testData, modalClass);

      expect(service.isOpen()).toBe(true);
      expect(service.component()).toBe(MockComponent);
      expect(service.data()).toEqual(testData);
      expect(service.modalClass()).toBe(modalClass);
    });

    it('should open modal with component and modalClass only', () => {
      const modalClass = 'large-modal';
      service.open(MockComponent, undefined, modalClass);

      expect(service.isOpen()).toBe(true);
      expect(service.component()).toBe(MockComponent);
      expect(service.data()).toBe(null);
      expect(service.modalClass()).toBe(modalClass);
    });

    it('should handle null data parameter', () => {
      service.open(MockComponent, null);

      expect(service.isOpen()).toBe(true);
      expect(service.component()).toBe(MockComponent);
      expect(service.data()).toBe(null);
    });

    it('should handle undefined data parameter', () => {
      service.open(MockComponent, undefined);

      expect(service.isOpen()).toBe(true);
      expect(service.component()).toBe(MockComponent);
      expect(service.data()).toBe(null);
    });

    it('should handle complex data objects', () => {
      const complexData = {
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          roles: ['admin', 'user'],
        },
        settings: {
          theme: 'dark',
          language: 'en',
          notifications: true,
        },
        metadata: {
          timestamp: new Date(),
          version: '1.0.0',
        },
      };

      service.open(MockComponent, complexData);

      expect(service.isOpen()).toBe(true);
      expect(service.component()).toBe(MockComponent);
      expect(service.data()).toEqual(complexData);
    });

    it('should handle array data', () => {
      const arrayData = [1, 2, 3, 'test', { key: 'value' }];
      service.open(MockComponent, arrayData);

      expect(service.isOpen()).toBe(true);
      expect(service.component()).toBe(MockComponent);
      expect(service.data()).toEqual(arrayData);
    });

    it('should handle primitive data types', () => {
      service.open(MockComponent, 'string data');
      expect(service.data()).toBe('string data');

      service.open(MockComponent, 123);
      expect(service.data()).toBe(123);

      service.open(MockComponent, true);
      expect(service.data()).toBe(true);
    });

    it('should update component when opening with different component', () => {
      service.open(MockComponent);
      expect(service.component()).toBe(MockComponent);

      service.open(AnotherMockComponent);
      expect(service.component()).toBe(AnotherMockComponent);
    });

    it('should update data when opening with different data', () => {
      const data1 = { key: 'value1' };
      const data2 = { key: 'value2' };

      service.open(MockComponent, data1);
      expect(service.data()).toEqual(data1);

      service.open(MockComponent, data2);
      expect(service.data()).toEqual(data2);
    });

    it('should update modalClass when opening with different class', () => {
      service.open(MockComponent, undefined, 'class1');
      expect(service.modalClass()).toBe('class1');

      service.open(MockComponent, undefined, 'class2');
      expect(service.modalClass()).toBe('class2');
    });
  });

  describe('close', () => {
    it('should close modal and reset all signals', () => {
      // First open the modal
      service.open(MockComponent, { test: 'data' }, 'test-class');

      // Verify it's open
      expect(service.isOpen()).toBe(true);
      expect(service.component()).toBe(MockComponent);
      expect(service.data()).toEqual({ test: 'data' });
      expect(service.modalClass()).toBe('test-class');

      // Close the modal
      service.close();

      // Verify it's closed and reset
      expect(service.isOpen()).toBe(false);
      expect(service.component()).toBe(null);
      expect(service.data()).toBe(null);
      expect(service.modalClass()).toBe('test-class'); // modalClass is not reset on close
      expect(service.injector()).toBe(undefined);
    });

    it('should close modal when already closed', () => {
      // Modal should already be closed
      expect(service.isOpen()).toBe(false);

      // Close again
      service.close();

      // Should still be closed
      expect(service.isOpen()).toBe(false);
      expect(service.component()).toBe(null);
      expect(service.data()).toBe(null);
      expect(service.modalClass()).toBe('');
    });

    it('should close modal multiple times', () => {
      service.open(MockComponent, { test: 'data' });
      expect(service.isOpen()).toBe(true);

      service.close();
      expect(service.isOpen()).toBe(false);

      service.close();
      expect(service.isOpen()).toBe(false);

      service.close();
      expect(service.isOpen()).toBe(false);
    });
  });

  describe('open and close sequence', () => {
    it('should handle open -> close -> open sequence', () => {
      const data1 = { key: 'value1' };
      const data2 = { key: 'value2' };

      // First open
      service.open(MockComponent, data1);
      expect(service.isOpen()).toBe(true);
      expect(service.component()).toBe(MockComponent);
      expect(service.data()).toEqual(data1);

      // Close
      service.close();
      expect(service.isOpen()).toBe(false);
      expect(service.component()).toBe(null);
      expect(service.data()).toBe(null);

      // Second open
      service.open(AnotherMockComponent, data2);
      expect(service.isOpen()).toBe(true);
      expect(service.component()).toBe(AnotherMockComponent);
      expect(service.data()).toEqual(data2);
    });

    it('should handle multiple open/close cycles', () => {
      for (let i = 0; i < 3; i++) {
        service.open(MockComponent, { iteration: i });
        expect(service.isOpen()).toBe(true);
        expect(service.data()).toEqual({ iteration: i });

        service.close();
        expect(service.isOpen()).toBe(false);
        expect(service.component()).toBe(null);
      }
    });
  });

  describe('signal reactivity', () => {
    it('should update isOpen signal when opening', () => {
      expect(service.isOpen()).toBe(false);

      service.open(MockComponent);
      expect(service.isOpen()).toBe(true);
    });

    it('should update isOpen signal when closing', () => {
      service.open(MockComponent);
      expect(service.isOpen()).toBe(true);

      service.close();
      expect(service.isOpen()).toBe(false);
    });

    it('should update component signal when opening', () => {
      expect(service.component()).toBe(null);

      service.open(MockComponent);
      expect(service.component()).toBe(MockComponent);
    });

    it('should update data signal when opening', () => {
      const testData = { key: 'value' };
      expect(service.data()).toBe(null);

      service.open(MockComponent, testData);
      expect(service.data()).toEqual(testData);
    });

    it('should update modalClass signal when opening', () => {
      const modalClass = 'custom-class';
      expect(service.modalClass()).toBe('');

      service.open(MockComponent, undefined, modalClass);
      expect(service.modalClass()).toBe(modalClass);
    });
  });

  describe('edge cases', () => {
    it('should handle empty string modalClass', () => {
      service.open(MockComponent, undefined, '');
      expect(service.modalClass()).toBe('');
    });

    it('should handle whitespace modalClass', () => {
      service.open(MockComponent, undefined, '   ');
      expect(service.modalClass()).toBe('   ');
    });

    it('should handle special characters in modalClass', () => {
      const specialClass = 'modal-class-with-special-chars-123_!@#';
      service.open(MockComponent, undefined, specialClass);
      expect(service.modalClass()).toBe(specialClass);
    });

    it('should handle function as data', () => {
      const functionData = () => 'test function';
      service.open(MockComponent, functionData);
      expect(service.data()).toBe(functionData);
    });

    it('should handle Date object as data', () => {
      const dateData = new Date();
      service.open(MockComponent, dateData);
      expect(service.data()).toBe(dateData);
    });

    it('should handle null component', () => {
      // This should not throw an error
      expect(() => {
        service.open(null as any);
      }).not.toThrow();
    });
  });
});
