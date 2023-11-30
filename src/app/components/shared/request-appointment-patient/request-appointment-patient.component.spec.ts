import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAppointmentPatientComponent } from './request-appointment-patient.component';

describe('RequestAppointmentPatientComponent', () => {
  let component: RequestAppointmentPatientComponent;
  let fixture: ComponentFixture<RequestAppointmentPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestAppointmentPatientComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestAppointmentPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
