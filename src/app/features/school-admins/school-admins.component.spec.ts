import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolAdminsComponent } from './school-admins.component';

describe('SchoolAdminsComponent', () => {
  let component: SchoolAdminsComponent;
  let fixture: ComponentFixture<SchoolAdminsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolAdminsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
