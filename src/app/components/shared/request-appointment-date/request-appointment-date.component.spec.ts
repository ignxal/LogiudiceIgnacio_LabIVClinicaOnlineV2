import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAppointmentDateComponent } from './request-appointment-date.component';

describe('RequestAppointmentDateComponent', () => {
  let component: RequestAppointmentDateComponent;
  let fixture: ComponentFixture<RequestAppointmentDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestAppointmentDateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestAppointmentDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
