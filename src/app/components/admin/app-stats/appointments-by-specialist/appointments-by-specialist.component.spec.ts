import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsBySpecialistComponent } from './appointments-by-specialist.component';

describe('AppointmentsBySpecialistComponent', () => {
  let component: AppointmentsBySpecialistComponent;
  let fixture: ComponentFixture<AppointmentsBySpecialistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentsBySpecialistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentsBySpecialistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
