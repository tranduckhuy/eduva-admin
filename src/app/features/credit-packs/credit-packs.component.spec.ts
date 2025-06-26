import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditPacksComponent } from './credit-packs.component';

describe('CreditPacksComponent', () => {
  let component: CreditPacksComponent;
  let fixture: ComponentFixture<CreditPacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditPacksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditPacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
