import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSchoolAdminComponent } from './edit-school-admin.component';

describe('EditSchoolAdminComponent', () => {
  let component: EditSchoolAdminComponent;
  let fixture: ComponentFixture<EditSchoolAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSchoolAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSchoolAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
