import { Roles } from './roles';
import { Timestamp } from '@angular/fire/firestore';

export interface UserM {
  uid: string;
  id_user: string;
  email: string;
  name: string;
  lastName: string;
  dni: string;
  age: number;
  photoURL: string;
  imageUrl: string[];
  serviceHours: any | null;
  role: Roles;
  healthInsurance: string;
  specialty: any;
  emailVerified?: boolean;
  approved?: boolean;
  registerDate: Timestamp;
  confirmationDate: Timestamp | null;
}
