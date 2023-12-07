export interface MedicalRecord {
  id_patient: string | undefined;
  patientName: string | undefined;
  id_specialist: string;
  specialty: string | undefined;
  date: string | Date;
  height: string;
  weight: string;
  temp: string;
  pressure: string;
  observations: object | null;
}
