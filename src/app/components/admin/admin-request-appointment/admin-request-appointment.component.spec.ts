import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRequestAppointmentComponent } from './admin-request-appointment.component';

describe('AdminRequestAppointmentComponent', () => {
  let component: AdminRequestAppointmentComponent;
  let fixture: ComponentFixture<AdminRequestAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminRequestAppointmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRequestAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
