import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAppointmentsComponent } from './request-appointments.component';

describe('RequestAppointmentsComponent', () => {
  let component: RequestAppointmentsComponent;
  let fixture: ComponentFixture<RequestAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestAppointmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
