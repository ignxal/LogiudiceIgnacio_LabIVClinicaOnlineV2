export interface MedicalRecord {
  id_patient: string;
  date: string | Date;
  height: string;
  weight: string;
  temp: string;
  pressure: string;
  observations: object | null;
}
