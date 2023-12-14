import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsSpecialtyComponent } from './appointments-specialty.component';

describe('AppointmentsSpecialtyComponent', () => {
  let component: AppointmentsSpecialtyComponent;
  let fixture: ComponentFixture<AppointmentsSpecialtyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentsSpecialtyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentsSpecialtyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
