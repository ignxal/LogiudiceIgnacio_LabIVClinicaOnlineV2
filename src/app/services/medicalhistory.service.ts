import { Injectable } from '@angular/core';
import { and, where } from '@angular/fire/firestore';
import { CollectionsService } from './collections.service';

@Injectable({
  providedIn: 'root',
})
export class MedicalHistoryService {
  private collecionName = 'medical-history';

  constructor(private collection: CollectionsService) {}

  getMedicalHistories() {
    return this.collection.getAllSnapshot<any>(this.collecionName, '');
  }

  getMedicalHistoryByPatient(id_patient: any) {
    let querys = [where('id_patient', '==', id_patient)];

    return this.collection.getAllWhereSnapshot<any>(
      this.collecionName,
      and(...querys)
    );
  }

  update(doc: any) {
    return this.collection.update(this.collecionName, doc);
  }
}
