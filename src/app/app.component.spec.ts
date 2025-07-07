import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { PageTitleService } from './shared/services/core/page-title/page-title.service';
import { TailwindIndicatorComponent } from './shared/components/tailwind-indicator/tailwind-indicator.component';
import { NetworkStateComponent } from './shared/components/network-state/network-state.component';
import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';

// Dummy components for router outlet and children
@Component({ selector: 'router-outlet', template: '' })
class DummyRouterOutlet {}
@Component({ selector: 'app-tailwind-indicator', template: '' })
class DummyTailwindIndicator {}
@Component({ selector: 'app-network-state', template: '' })
class DummyNetworkState {}

describe('AppComponent', () => {
  let pageTitleService: PageTitleService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: PageTitleService,
          useValue: { init: vi.fn() },
        },
      ],
      declarations: [
        DummyRouterOutlet,
        DummyTailwindIndicator,
        DummyNetworkState,
      ],
    }).compileComponents();
    pageTitleService = TestBed.inject(PageTitleService);
    vi.clearAllMocks();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call pageTitleService.init() on ngOnInit', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.ngOnInit();
    expect(pageTitleService.init).toHaveBeenCalled();
  });

  it('should render router outlet and child components', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
    expect(compiled.querySelector('app-tailwind-indicator')).toBeTruthy();
    expect(compiled.querySelector('app-network-state')).toBeTruthy();
  });
});
