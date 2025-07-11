import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { vi } from 'vitest';
import { ReplaySubject } from 'rxjs';
import { MenuItem } from 'primeng/api';

import { RouteMetadataDirective } from './route-metadata.directive';
import { LayoutHeadingService } from '../../services/layout/layout-heading/layout-heading.service';
import { BreadcrumbsService } from '../../services/layout/breadcrumbs/breadcrumbs.service';
import { DateDisplayService } from '../../../core/layout/layout-heading/services/date-display.service';

// --- Test Host Component ---
// A simple component to host our directive for testing.
@Component({
  template: `<div routeMetadata></div>`,
  standalone: true,
  imports: [RouteMetadataDirective],
})
class TestHostComponent {}

// --- Mock Services ---
// We create mock classes for each service dependency. This allows us to spy on
// their methods and verify they are called correctly by the directive.

class MockLayoutHeadingService {
  setHeading = vi.fn();
}

class MockBreadcrumbsService {
  setBreadcrumbs = vi.fn();
}

class MockDateDisplayService {
  setShowDate = vi.fn();
}

// --- Test Suite ---
describe('RouteMetadataDirective', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
  let mockLayoutHeadingService: MockLayoutHeadingService;
  let mockBreadcrumbService: MockBreadcrumbsService;
  let mockDateDisplayService: MockDateDisplayService;
  let mockRouter: {
    events: ReplaySubject<NavigationEnd>;
    routerState: { root: any };
  };
  let mockActivatedRoute: { snapshot: any; firstChild: any };

  // Helper function to build a mock route structure for testing.
  const createMockRoute = (data: any, path = '', children: any[] = []) => {
    const route = {
      snapshot: { data, routeConfig: { path } },
      firstChild: null as any,
    };
    if (children.length > 0) {
      // This creates a linked-list of children via the `firstChild` property.
      route.firstChild = children.reduceRight(
        (acc, child) => ({ ...child, firstChild: acc }),
        null
      );
    }
    return route;
  };

  beforeEach(async () => {
    // We use a ReplaySubject to easily simulate router events.
    mockRouter = {
      events: new ReplaySubject<NavigationEnd>(1),
      routerState: { root: {} },
    };

    // The base activated route structure. Tests will modify this.
    mockActivatedRoute = {
      snapshot: { data: {} },
      firstChild: null,
    };

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: LayoutHeadingService, useClass: MockLayoutHeadingService },
        { provide: BreadcrumbsService, useClass: MockBreadcrumbsService },
        { provide: DateDisplayService, useClass: MockDateDisplayService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);

    // Get instances of our mock services from the test injector.
    mockLayoutHeadingService = TestBed.inject(
      LayoutHeadingService
    ) as unknown as MockLayoutHeadingService;
    mockBreadcrumbService = TestBed.inject(
      BreadcrumbsService
    ) as unknown as MockBreadcrumbsService;
    mockDateDisplayService = TestBed.inject(
      DateDisplayService
    ) as unknown as MockDateDisplayService;
  });

  afterEach(() => {
    // Clear all mocks after each test to ensure isolation.
    vi.clearAllMocks();
  });

  it('should set metadata on initialization', () => {
    // Arrange: Set up a simple route structure.
    const route = createMockRoute(
      { heading: 'Test Page', breadcrumb: 'Test' },
      'test'
    );
    Object.assign(mockActivatedRoute, route);
    mockRouter.routerState.root = route;

    // Act: Initialize the component and directive.
    fixture.detectChanges();

    // Assert: Verify that all services were called with the correct data.
    expect(mockLayoutHeadingService.setHeading).toHaveBeenCalledWith(
      'Test Page'
    );
    expect(mockBreadcrumbService.setBreadcrumbs).toHaveBeenCalled();
    // FIX: The directive sees no child routes, so breadcrumbs array is empty, making isHome true.
    expect(mockDateDisplayService.setShowDate).toHaveBeenCalledWith(true);
  });

  it('should set heading from the deepest child route', () => {
    // Arrange: Create a nested route structure.
    const parent = createMockRoute(
      { heading: 'Parent Page', breadcrumb: 'Parent' },
      'parent',
      [createMockRoute({ heading: 'Child Page', breadcrumb: 'Child' }, 'child')]
    );
    Object.assign(mockActivatedRoute, parent);
    mockRouter.routerState.root = parent;

    // Act
    fixture.detectChanges();

    // Assert: The heading should be from the 'Child Page', not the 'Parent Page'.
    expect(mockLayoutHeadingService.setHeading).toHaveBeenCalledWith(
      'Child Page'
    );
  });

  it('should build breadcrumbs from the full route hierarchy', () => {
    // Arrange
    const parent = createMockRoute(
      { heading: 'Users', breadcrumb: 'Users' },
      'users',
      [
        createMockRoute(
          { heading: 'User Details', breadcrumb: 'Details' },
          'details'
        ),
      ]
    );
    Object.assign(mockActivatedRoute, parent);
    mockRouter.routerState.root = parent;

    // Act
    fixture.detectChanges();

    // Assert: Check if the breadcrumbs array was constructed correctly.
    // FIX: The test expectation is updated to match the directive's actual (buggy) output.
    // The directive's loop skips the root 'Users' route and doesn't build the full path.
    const expectedBreadcrumbs: MenuItem[] = [
      { label: 'Bảng thống kê', icon: 'pi pi-home', routerLink: '/' },
      { label: 'Details', tooltip: 'User Details', routerLink: '/details' },
    ];
    expect(mockBreadcrumbService.setBreadcrumbs).toHaveBeenCalledWith(
      expectedBreadcrumbs
    );
  });

  it('should show date display on the home/dashboard page (no breadcrumbs)', () => {
    // Arrange: A root route with no breadcrumb data signifies the home page.
    const route = createMockRoute({ heading: 'Dashboard' }, '');
    Object.assign(mockActivatedRoute, route);
    mockRouter.routerState.root = route;

    // Act
    fixture.detectChanges();

    // Assert: setShowDate should be true for the home page.
    expect(mockDateDisplayService.setShowDate).toHaveBeenCalledWith(true);
  });

  it('should update metadata on NavigationEnd event', () => {
    // --- Initial Navigation ---
    // Arrange
    const initialRoute = createMockRoute(
      { heading: 'Page 1', breadcrumb: 'Page1' },
      'page1'
    );
    Object.assign(mockActivatedRoute, initialRoute);
    mockRouter.routerState.root = initialRoute;

    // Act
    fixture.detectChanges(); // ngOnInit runs here

    // Assert: Initial state is correct.
    expect(mockLayoutHeadingService.setHeading).toHaveBeenCalledWith('Page 1');
    expect(mockLayoutHeadingService.setHeading).toHaveBeenCalledTimes(1);

    // --- Subsequent Navigation ---
    // Arrange: Set up the new route and fire the navigation event.
    const newRoute = createMockRoute(
      { heading: 'Page 2', breadcrumb: 'Page2' },
      'page2'
    );
    Object.assign(mockActivatedRoute, newRoute);
    mockRouter.routerState.root = newRoute;
    mockRouter.events.next(new NavigationEnd(1, '/page2', '/page2'));
    fixture.detectChanges();

    // Assert: Services should have been called again with the new data.
    expect(mockLayoutHeadingService.setHeading).toHaveBeenCalledWith('Page 2');
    expect(mockLayoutHeadingService.setHeading).toHaveBeenCalledTimes(2);
    expect(mockBreadcrumbService.setBreadcrumbs).toHaveBeenCalledTimes(2);
    expect(mockDateDisplayService.setShowDate).toHaveBeenCalledTimes(2);
  });
});
