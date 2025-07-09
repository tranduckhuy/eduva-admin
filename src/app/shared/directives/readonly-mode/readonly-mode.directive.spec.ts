import { Component, DebugElement, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

import { ReadonlyModeDirective } from './readonly-mode.directive';
import { ReadonlyModeService } from '../../services/core/readonly-mode/readonly-mode.service';

// --- Test Host Component ---
// This component's template is updated to correctly test the directive.
// It uses the <ng-template> syntax to accommodate the directive's
// mismatched selector ('appReadonlyMode') and input name ('appReadonlyDisable').
@Component({
  template: `
    <!-- Case 1: Default behavior. The element should be hidden in readonly mode. -->
    <ng-template [appReadonlyMode]>
      <button data-testid="save-button">Save</button>
    </ng-template>

    <!-- Case 2: Inverted behavior. The element should be shown only in readonly mode. -->
    <!-- Here we bind 'true' to the actual input property 'appReadonlyDisable'. -->
    <ng-template [appReadonlyMode] [appReadonlyDisable]="true">
      <div data-testid="readonly-banner">Read-only Mode</div>
    </ng-template>
  `,
  standalone: true,
  imports: [ReadonlyModeDirective],
})
class TestHostComponent {}

// --- Mock Service ---
// A mock of ReadonlyModeService to control the `isReadonly` signal during tests.
class MockReadonlyModeService {
  // Use a writable signal to easily change the readonly state in our tests.
  private readonly _isReadonly = signal(false);
  public readonly isReadonly = this._isReadonly.asReadonly();

  // Helper method for tests to set the readonly state.
  public setReadonly(value: boolean): void {
    this._isReadonly.set(value);
  }
}

// --- Test Suite ---
describe('ReadonlyModeDirective', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
  let mockReadonlyService: MockReadonlyModeService;

  // Helper function to query for elements by their test ID.
  // Returns null if the element is not found.
  const getElementByTestId = (id: string): DebugElement | null => {
    return fixture.debugElement.query(By.css(`[data-testid="${id}"]`));
  };

  beforeEach(async () => {
    // Configure the testing module before each test.
    await TestBed.configureTestingModule({
      // Since TestHostComponent is standalone and imports the directive,
      // we only need to import the host component here.
      imports: [TestHostComponent],
      providers: [
        // Provide our mock service instead of the real one.
        { provide: ReadonlyModeService, useClass: MockReadonlyModeService },
      ],
    }).compileComponents();

    // Create the TestHostComponent, which will in turn create the directive.
    fixture = TestBed.createComponent(TestHostComponent);

    // Get the instance of our mock service from the dependency injector.
    // We cast to 'unknown' first to satisfy TypeScript's strict type checking.
    mockReadonlyService = TestBed.inject(
      ReadonlyModeService
    ) as unknown as MockReadonlyModeService;
  });

  describe('Default Behavior', () => {
    it('should SHOW the element when readonly mode is OFF', () => {
      // Arrange: Ensure readonly mode is off.
      mockReadonlyService.setReadonly(false);

      // Act: Trigger change detection.
      fixture.detectChanges();
      const saveButton = getElementByTestId('save-button');

      // Assert: The element should be present in the DOM.
      expect(saveButton).not.toBeNull();
    });

    it('should HIDE the element when readonly mode is ON', () => {
      // Arrange: Turn readonly mode on.
      mockReadonlyService.setReadonly(true);

      // Act: Trigger change detection.
      fixture.detectChanges();
      const saveButton = getElementByTestId('save-button');

      // Assert: The element should NOT be present in the DOM.
      expect(saveButton).toBeNull();
    });
  });

  describe('Inverted Behavior ([appReadonlyDisable]="true")', () => {
    it('should HIDE the element when readonly mode is OFF', () => {
      // Arrange: Ensure readonly mode is off.
      mockReadonlyService.setReadonly(false);

      // Act: Trigger change detection.
      fixture.detectChanges();
      const readonlyBanner = getElementByTestId('readonly-banner');

      // Assert: The element should NOT be present in the DOM.
      expect(readonlyBanner).toBeNull();
    });

    it('should SHOW the element when readonly mode is ON', () => {
      // Arrange: Turn readonly mode on.
      mockReadonlyService.setReadonly(true);

      // Act: Trigger change detection.
      fixture.detectChanges();
      const readonlyBanner = getElementByTestId('readonly-banner');

      // Assert: The element should be present in the DOM.
      expect(readonlyBanner).not.toBeNull();
    });
  });

  describe('Reactivity to State Changes', () => {
    it('should dynamically show/hide elements when readonly state changes', () => {
      // --- Initial State: Readonly OFF ---
      mockReadonlyService.setReadonly(false);
      fixture.detectChanges();

      // Assert initial state
      expect(getElementByTestId('save-button')).not.toBeNull();
      expect(getElementByTestId('readonly-banner')).toBeNull();

      // --- Change State: Readonly ON ---
      mockReadonlyService.setReadonly(true);
      fixture.detectChanges();

      // Assert new state
      expect(getElementByTestId('save-button')).toBeNull();
      expect(getElementByTestId('readonly-banner')).not.toBeNull();

      // --- Change State Back: Readonly OFF ---
      mockReadonlyService.setReadonly(false);
      fixture.detectChanges();

      // Assert final state
      expect(getElementByTestId('save-button')).not.toBeNull();
      expect(getElementByTestId('readonly-banner')).toBeNull();
    });
  });
});
