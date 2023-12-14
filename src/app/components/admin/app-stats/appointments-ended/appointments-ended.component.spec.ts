import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsEndedComponent } from './appointments-ended.component';

describe('AppointmentsEndedComponent', () => {
  let component: AppointmentsEndedComponent;
  let fixture: ComponentFixture<AppointmentsEndedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentsEndedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentsEndedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
