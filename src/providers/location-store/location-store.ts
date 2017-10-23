import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the LocationStoreProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationStoreProvider {

  lat: number;
  lng: number;

  constructor() {
    console.log('Hello LocationStoreProvider Provider');
  }

}
