import { TestBed } from '@angular/core/testing';
import { LayoutHeadingService } from './layout-heading.service'; // Adjust path as necessary

describe('LayoutHeadingService', () => {
  let service: LayoutHeadingService;

  beforeEach(() => {
    // Configure TestBed to provide the LayoutHeadingService
    TestBed.configureTestingModule({
      providers: [LayoutHeadingService],
    });

    // Get the instance of LayoutHeadingService from the TestBed injector
    service = TestBed.inject(LayoutHeadingService);
  });

  // Test case for initial state
  it('should be initialized with an empty string heading', () => {
    expect(service.heading()).toEqual('');
  });

  // Test case for setHeading method - setting a value
  it('should set the heading with the provided string', () => {
    const mockHeading = 'Dashboard Overview';
    service.setHeading(mockHeading);
    expect(service.heading()).toEqual(mockHeading);
  });

  // Test case for setHeading method - setting an empty string
  it('should be able to set the heading to an empty string', () => {
    // First, set a heading
    service.setHeading('Some Heading');
    expect(service.heading()).toEqual('Some Heading');

    // Then, set it to an empty string
    service.setHeading('');
    expect(service.heading()).toEqual('');
  });

  // Test case to ensure the signal is read-only from the outside
  it('should expose heading as a readonly signal', () => {
    // This test primarily checks the type safety at compile time, but we can assert its behavior.
    const initialHeading = service.heading();
    service.setHeading('New Heading');
    const updatedHeading = service.heading();

    // Ensure that the value changes when set, and the external signal itself is not mutable directly
    expect(initialHeading).not.toBe(updatedHeading); // Value changed
    expect(updatedHeading).toEqual('New Heading');
  });
});
