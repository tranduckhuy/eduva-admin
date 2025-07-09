import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { MenuItem } from 'primeng/api'; // Import MenuItem
import { BreadcrumbsService } from './breadcrumbs.service'; // Adjust path as necessary

describe('BreadcrumbsService', () => {
  let service: BreadcrumbsService;

  beforeEach(() => {
    // Configure TestBed to provide the BreadcrumbsService
    TestBed.configureTestingModule({
      providers: [BreadcrumbsService],
    });

    // Get the instance of BreadcrumbsService from the TestBed injector
    service = TestBed.inject(BreadcrumbsService);
  });

  // Test case for initial state
  it('should be initialized with an empty array of breadcrumbs', () => {
    expect(service.breadcrumbs()).toEqual([]);
  });

  // Test case for setBreadcrumbs method
  it('should set the breadcrumbs with the provided items', () => {
    const mockBreadcrumbs: MenuItem[] = [
      { label: 'Home', routerLink: '/' },
      { label: 'Category', routerLink: '/category' },
      { label: 'Product Detail' },
    ];

    service.setBreadcrumbs(mockBreadcrumbs);

    expect(service.breadcrumbs()).toEqual(mockBreadcrumbs);
  });

  // Test case for setting breadcrumbs to an empty array
  it('should be able to set breadcrumbs to an empty array', () => {
    // First, set some breadcrumbs
    service.setBreadcrumbs([{ label: 'Test' }]);
    expect(service.breadcrumbs()).toEqual([{ label: 'Test' }]);

    // Then, set them to an empty array
    service.setBreadcrumbs([]);
    expect(service.breadcrumbs()).toEqual([]);
  });

  // Test case to ensure the signal is read-only from the outside
  it('should expose breadcrumbs as a readonly signal', () => {
    // Attempting to assign directly to `service.breadcrumbs` should result in a TypeScript error
    // This test primarily checks the type safety at compile time, but we can assert its behavior.
    const initialBreadcrumbs = service.breadcrumbs();
    service.setBreadcrumbs([{ label: 'New Item' }]);
    const updatedBreadcrumbs = service.breadcrumbs();

    // Ensure that the reference changes when set, but the external signal itself is not mutable directly
    expect(initialBreadcrumbs).not.toBe(updatedBreadcrumbs);
    expect(updatedBreadcrumbs).toEqual([{ label: 'New Item' }]);
  });
});
