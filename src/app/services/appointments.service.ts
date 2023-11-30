import { Injectable } from '@angular/core';
import { and, where } from '@angular/fire/firestore';
import { AppointmentStatus, Appointment } from '../models/appointment';
import { CollectionsService } from './collections.service';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  private collecionName = 'appointments';

  constructor(private collection: CollectionsService) {}

  getAppointments() {
    return this.collection.getAllSnapshot<Appointment>(this.collecionName, '');
  }

  getAppointmentsBydate(date: Date) {
    const querys = [
      where('appointmentDate', '==', date),
      where('status', 'not-in', [
        AppointmentStatus.Canceled,
        AppointmentStatus.Rejected,
      ]),
    ];

    return this.collection.getAllWhereSnapshot<Appointment>(
      this.collecionName,
      and(...querys)
    );
  }

  getAppointmentsBySpecialist(id_specialist: string) {
    let querys = [where('id_specialist', '==', id_specialist)];

    return this.collection.getAllWhereSnapshot<Appointment>(
      this.collecionName,
      and(...querys)
    );
  }

  getAppointmentsNotAvailableFromSpecialist(id_specialist: string) {
    let querys = [
      where('id_specialist', '==', id_specialist),
      where('status', 'not-in', [
        AppointmentStatus.Canceled,
        AppointmentStatus.Rejected,
      ]),
    ];

    return this.collection.getAllWhereSnapshot<Appointment>(
      this.collecionName,
      and(...querys)
    );
  }

  getAppointmentsByPatient(id_patient: string) {
    let querys = [where('id_patient', '==', id_patient)];

    return this.collection.getAllWhereSnapshot<Appointment>(
      this.collecionName,
      and(...querys)
    );
  }

  getAppointmentsBySpecialtyForPatient(id_patient: string, specialty: string) {
    let querys = [
      where('id_patient', '==', id_patient),
      where('specialty', '==', specialty),
    ];

    return this.collection.getAllWhereSnapshot<Appointment>(
      this.collecionName,
      and(...querys)
    );
  }

  getAppointmentsBySpecialistAndPatient(
    id_patient: string,
    id_specialist: string
  ) {
    let querys = [
      where('id_patient', '==', id_patient),
      where('id_specialist', '==', id_specialist),
    ];

    return this.collection.getAllWhereSnapshot<Appointment>(
      this.collecionName,
      and(...querys)
    );
  }

  getMedicalHistoryBySpecialtyAndPatient(
    specialty: any,
    id_patient: any,
    status: any
  ) {
    let querys = [
      where('specialty', '==', specialty),
      where('id_patient', '==', id_patient),
      where('status', '==', status),
    ];

    return this.collection.getAllWhereSnapshot<Appointment>(
      this.collecionName,
      and(...querys),
      'appointmentDate'
    );
  }

  async reserve(appointment: Appointment) {
    let querys = [
      where('id_patient', '==', appointment.id_patient),
      where('appointmentDate', '==', appointment.appointmentDate),
    ];

    let result = await !this.collection.existsQuery(
      this.collecionName,
      and(...querys)
    );

    console.log(result);
    if (!result) {
      return this.collection.addOne(this.collecionName, appointment);
    } else {
      return false;
    }
  }

  update(appointment: Appointment) {
    return this.collection.update(this.collecionName, appointment);
  }
}
