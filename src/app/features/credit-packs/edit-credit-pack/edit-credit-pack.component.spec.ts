import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCreditPackComponent } from './edit-credit-pack.component';

describe('EditCreditPackComponent', () => {
  let component: EditCreditPackComponent;
  let fixture: ComponentFixture<EditCreditPackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCreditPackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCreditPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
