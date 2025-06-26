import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditPackComponent } from './credit-pack.component';

describe('CreditPackComponent', () => {
  let component: CreditPackComponent;
  let fixture: ComponentFixture<CreditPackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditPackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
