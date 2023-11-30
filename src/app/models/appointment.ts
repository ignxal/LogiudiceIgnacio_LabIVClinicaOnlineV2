import { Collection } from './collection';

export class Appointment implements Collection {
  constructor(
    public id: string,
    public specialty?: string | undefined,
    public id_patient?: string | undefined,
    public id_specialist?: string | undefined,
    public specialistName?: string | undefined,
    public diagnosis: string = '',
    public appointmentDate?: any,
    public status: AppointmentStatus = AppointmentStatus.Pending,
    public rate: number = 0,
    public comments: string = '',
    public survey: object = { feedback: '', clarity: '', rate: 0 }
  ) {}
}

export enum AppointmentStatus {
  Free = 'Free',
  Rejected = 'Rejected',
  Pending = 'Pending',
  Canceled = 'Canceled',
  Accepted = 'Accepted',
  Done = 'Done',
}
