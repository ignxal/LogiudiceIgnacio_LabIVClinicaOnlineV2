import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsSpecialistComponent } from './appointments-specialist.component';

describe('AppointmentsSpecialistComponent', () => {
  let component: AppointmentsSpecialistComponent;
  let fixture: ComponentFixture<AppointmentsSpecialistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentsSpecialistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentsSpecialistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
