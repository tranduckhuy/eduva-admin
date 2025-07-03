import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditPackCardComponent } from './credit-pack-card.component';

describe('CreditPackCardComponent', () => {
  let component: CreditPackCardComponent;
  let fixture: ComponentFixture<CreditPackCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditPackCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditPackCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
