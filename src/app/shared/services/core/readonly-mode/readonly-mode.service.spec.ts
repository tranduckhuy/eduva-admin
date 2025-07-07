import { TestBed } from '@angular/core/testing';
import { ReadonlyModeService } from './readonly-mode.service'; // Adjust path as necessary
import { vi } from 'vitest'; // Import vi for mocking if needed, though not strictly required here

describe('ReadonlyModeService', () => {
  let service: ReadonlyModeService;

  beforeEach(() => {
    // Configure TestBed to provide the ReadonlyModeService
    TestBed.configureTestingModule({
      providers: [ReadonlyModeService],
    });

    // Get the instance of ReadonlyModeService from the TestBed injector
    service = TestBed.inject(ReadonlyModeService);
  });

  // Test case for initial state
  it('should be initialized with isReadonly as false', () => {
    // The service's private signal _isReadonly is initialized to false,
    // and the computed signal isReadonly reflects this.
    expect(service.isReadonly()).toBe(false);
  });

  // Test case for setReadonlyMode method - setting to true
  it('should set isReadonly to true when setReadonlyMode(true) is called', () => {
    service.setReadonlyMode(true);
    expect(service.isReadonly()).toBe(true);
  });

  // Test case for setReadonlyMode method - setting to false
  it('should set isReadonly to false when setReadonlyMode(false) is called', () => {
    // First, set it to true to ensure the change is detected
    service.setReadonlyMode(true);
    expect(service.isReadonly()).toBe(true);

    service.setReadonlyMode(false);
    expect(service.isReadonly()).toBe(false);
  });

  // Test case to ensure the computed signal reacts correctly
  it('should update the computed isReadonly signal when the internal signal changes', () => {
    // Initial state check (should be false)
    expect(service.isReadonly()).toBe(false);

    // Change the internal signal
    service.setReadonlyMode(true);
    // Expect the computed signal to reflect the change
    expect(service.isReadonly()).toBe(true);

    // Change it back
    service.setReadonlyMode(false);
    expect(service.isReadonly()).toBe(false);
  });
});
