import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCreditPackComponent } from './create-credit-pack.component';

describe('CreateCreditPackComponent', () => {
  let component: CreateCreditPackComponent;
  let fixture: ComponentFixture<CreateCreditPackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCreditPackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCreditPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
