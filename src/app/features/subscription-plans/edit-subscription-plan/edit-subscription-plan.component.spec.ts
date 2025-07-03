import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubscriptionPlanComponent } from './edit-subscription-plan.component';

describe('EditSubscriptionPlanComponent', () => {
  let component: EditSubscriptionPlanComponent;
  let fixture: ComponentFixture<EditSubscriptionPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSubscriptionPlanComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditSubscriptionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
