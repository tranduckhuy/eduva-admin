import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { vi } from 'vitest';
import { Observable, of, Subject } from 'rxjs';
import { PageTitleService } from './page-title.service'; // Adjust path as necessary
import { fakeAsync, tick } from '@angular/core/testing'; // For testing asynchronous observables

describe('PageTitleService', () => {
  let service: PageTitleService;
  let routerMock: Partial<Router>;
  // Use a more robust mock for ActivatedRoute to allow setting firstChild
  let activatedRouteMock: {
    data: ReturnType<typeof of> | Observable<any>; // Changed to allow Observable<any>
    firstChild: any; // Allow dynamic assignment for testing
  };
  let titleMock: Partial<Title>;
  let routerEventsSubject: Subject<any>; // Subject to control router events

  beforeEach(() => {
    // Initialize Subject for router events
    routerEventsSubject = new Subject<any>();

    // Mock Router
    routerMock = {
      events: routerEventsSubject.asObservable(), // Use the subject as the events observable
    };

    // Mock ActivatedRoute with a writable firstChild for testing purposes
    activatedRouteMock = {
      data: of({}), // Default empty data
      firstChild: null, // Initialize firstChild to null
    };

    // Mock Title
    titleMock = {
      setTitle: vi.fn(),
    };

    // Configure TestBed to provide the service and its mocked dependencies
    TestBed.configureTestingModule({
      providers: [
        PageTitleService,
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }, // Provide the custom mock
        { provide: Title, useValue: titleMock },
      ],
    });

    // Inject the service
    service = TestBed.inject(PageTitleService);
  });

  // Test case for init method with a custom title
  it('should set the page title based on route data when NavigationEnd occurs', fakeAsync(() => {
    const mockTitle = 'Test Page';
    // Configure activatedRouteMock for this specific test
    activatedRouteMock.firstChild = {
      data: of({ title: mockTitle }),
      firstChild: null, // No further children
    };

    // Call init to set up the subscription
    service.init();

    // Simulate a NavigationEnd event
    routerEventsSubject.next(new NavigationEnd(1, '/test', '/test'));

    // Advance the fakeAsync timer to let the observable chain complete
    tick();

    // Assert that setTitle was called with the correct formatted title
    expect(titleMock.setTitle).toHaveBeenCalledWith(`${mockTitle} | EDUVA`);
  }));

  // Test case for init method with no custom title (default title)
  it('should set the default page title if no title is found in route data', fakeAsync(() => {
    // activatedRouteMock.data is already of({}), so no specific title is provided
    activatedRouteMock.firstChild = {
      data: of({}), // No title property
      firstChild: null,
    };

    service.init();

    routerEventsSubject.next(new NavigationEnd(2, '/home', '/home'));
    tick();

    expect(titleMock.setTitle).toHaveBeenCalledWith(
      'EDUVA - Học, Học Nữa, Học Mãi'
    );
  }));

  // Test case for init method with nested routes
  it('should traverse nested routes to find the title', fakeAsync(() => {
    const nestedTitle = 'Nested Test Page';
    // Simulate a deeply nested route structure
    activatedRouteMock.firstChild = {
      data: of({}), // Intermediate route data (can be empty)
      firstChild: {
        data: of({}), // Another intermediate route data
        firstChild: {
          data: of({ title: nestedTitle }), // The actual title is here
          firstChild: null,
        },
      },
    };

    service.init();

    routerEventsSubject.next(
      new NavigationEnd(3, '/nested/path', '/nested/path')
    );
    tick();

    expect(titleMock.setTitle).toHaveBeenCalledWith(`${nestedTitle} | EDUVA`);
  }));

  // Test case to ensure no title is set if NavigationEnd does not occur
  it('should not set title if no NavigationEnd event occurs', fakeAsync(() => {
    service.init();
    // No routerEventsSubject.next() call
    tick(); // Advance time, but no NavigationEnd

    expect(titleMock.setTitle).not.toHaveBeenCalled();
  }));

  // Test case for other router events (should not trigger title change)
  it('should not set title for non-NavigationEnd router events', fakeAsync(() => {
    service.init();

    // Simulate a different router event, e.g., RouterEvent (base class)
    routerEventsSubject.next({ id: 4, url: '/some-other-event' });
    tick();

    expect(titleMock.setTitle).not.toHaveBeenCalled();
  }));
});
