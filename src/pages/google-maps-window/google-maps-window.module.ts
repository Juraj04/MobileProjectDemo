import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoogleMapsWindowPage } from './google-maps-window';

@NgModule({
  declarations: [
    GoogleMapsWindowPage,
  ],
  imports: [
    IonicPageModule.forChild(GoogleMapsWindowPage),
  ],
})
export class GoogleMapsWindowPageModule {}
