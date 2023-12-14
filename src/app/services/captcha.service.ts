import { Injectable } from '@angular/core';
import { CollectionsService } from './collections.service';
import { and, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class CaptchaService {
  collectionName: string = 'captcha';

  constructor(private collection: CollectionsService) {}

  getOne() {
    const randomNumber = Math.floor(Math.random() * 3) + 1;

    let querys = [where('id', '==', `captcha-${randomNumber}`)];

    return this.collection.getAllWhereSnapshot<any>(
      this.collectionName,
      and(...querys)
    );
  }
}
