import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAppointmentDoctorComponent } from './request-appointment-specialist.component';

describe('RequestAppointmentDoctorComponent', () => {
  let component: RequestAppointmentDoctorComponent;
  let fixture: ComponentFixture<RequestAppointmentDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestAppointmentDoctorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestAppointmentDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
