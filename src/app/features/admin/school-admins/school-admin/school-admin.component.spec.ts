import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolAdminComponent } from './school-admin.component';

describe('SchoolAdminComponent', () => {
  let component: SchoolAdminComponent;
  let fixture: ComponentFixture<SchoolAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
