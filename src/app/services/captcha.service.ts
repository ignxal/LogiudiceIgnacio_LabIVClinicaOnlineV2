import { Injectable } from '@angular/core';
import { CollectionsService } from './collections.service';
import { and, where } from '@angular/fire/firestore';
import { RandomNumberPipe } from '../pipes/random-number.pipe';

@Injectable({
  providedIn: 'root',
})
export class CaptchaService {
  collectionName: string = 'captcha';

  constructor(private collection: CollectionsService) {}

  getOne() {
    const randomNumber = new RandomNumberPipe().transform();

    let querys = [where('id', '==', `captcha-${randomNumber}`)];

    return this.collection.getAllWhereSnapshot<any>(
      this.collectionName,
      and(...querys)
    );
  }
}
