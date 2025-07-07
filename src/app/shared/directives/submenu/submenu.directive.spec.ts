import { Component, DebugElement } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SubmenuDirective } from './submenu.directive';
import { By } from '@angular/platform-browser';
import { fakeAsync, tick } from '@angular/core/testing';
import { vi } from 'vitest';

@Component({
  template: `
    <div clickOutsideSubmenu (clickOutside)="onClickOutside()">Submenu</div>
  `,
})
class TestHostComponent {
  onClickOutside = vi.fn();
}

describe('SubmenuDirective', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
  let component: TestHostComponent;
  let submenuDebugEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [SubmenuDirective],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    submenuDebugEl = fixture.debugElement.query(By.directive(SubmenuDirective));
  });

  it('should emit clickOutside when clicking outside', fakeAsync(() => {
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);

    outsideElement.click();
    tick(); // wait for setTimeout
    expect(component.onClickOutside).toHaveBeenCalled();

    document.body.removeChild(outsideElement);
  }));

  it('should not emit clickOutside when clicking inside', fakeAsync(() => {
    submenuDebugEl.nativeElement.click();
    tick(); // wait for setTimeout
    expect(component.onClickOutside).not.toHaveBeenCalled();
  }));

  it('should emit clickOutside when window:close-all-submenus is dispatched', () => {
    const event = new Event('close-all-submenus');
    window.dispatchEvent(event);

    expect(component.onClickOutside).toHaveBeenCalled();
  });
});
