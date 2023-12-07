import { Injectable } from '@angular/core';
import { and, where } from '@angular/fire/firestore';
import { CollectionsService } from './collections.service';
import { MedicalRecord } from '../models/medical-record';

@Injectable({
  providedIn: 'root',
})
export class MedicalHistoryService {
  private collectionName = 'medical-history';

  constructor(private collection: CollectionsService) {}

  addOne(record: any) {
    return this.collection.addOne(this.collectionName, record);
  }

  getMedicalHistories() {
    return this.collection.getAllSnapshot<any>(this.collectionName, '');
  }

  getMedicalHistoryByPatient(id_patient: any) {
    let querys = [where('id_patient', '==', id_patient)];

    return this.collection.getAllWhereSnapshot<any>(
      this.collectionName,
      and(...querys)
    );
  }

  update(doc: any) {
    return this.collection.update(this.collectionName, doc);
  }
}
