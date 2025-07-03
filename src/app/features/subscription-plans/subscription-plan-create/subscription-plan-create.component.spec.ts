import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPlanCreateComponent } from './subscription-plan-create.component';

describe('SubscriptionPlanCreateComponent', () => {
  let component: SubscriptionPlanCreateComponent;
  let fixture: ComponentFixture<SubscriptionPlanCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionPlanCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionPlanCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
