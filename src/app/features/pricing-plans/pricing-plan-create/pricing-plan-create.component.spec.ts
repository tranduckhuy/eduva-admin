import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingPlanCreateComponent } from './pricing-plan-create.component';

describe('PricingPlanCreateComponent', () => {
  let component: PricingPlanCreateComponent;
  let fixture: ComponentFixture<PricingPlanCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingPlanCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricingPlanCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
