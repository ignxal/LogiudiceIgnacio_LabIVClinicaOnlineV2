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
  role: Roles;
  healthInsurance: string;
  specialty: string;
  emailVerified?: boolean;
  approved?: boolean;
  registerDate: Timestamp;
  confirmationDate: Timestamp | null;
}
