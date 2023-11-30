import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAppointmentSpecialtyComponent } from './request-appointment-specialty.component';

describe('RequestAppointmentSpecialtyComponent', () => {
  let component: RequestAppointmentSpecialtyComponent;
  let fixture: ComponentFixture<RequestAppointmentSpecialtyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestAppointmentSpecialtyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestAppointmentSpecialtyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
