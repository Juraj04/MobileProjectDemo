import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {DatabaseProvider} from '../providers/database/database';
import {ProductDetailPage} from "../pages/product-detail/product-detail";
import {AddProductPage} from "../pages/add-product/add-product";
import {Camera} from "@ionic-native/camera";
import {ImagePicker} from "@ionic-native/image-picker";
import {GoogleMaps} from "@ionic-native/google-maps";
import {MapAddLocationComponent} from "../components/map-add-location/map-add-location";
import {GoogleMapsWindowPage} from "../pages/google-maps-window/google-maps-window";
import {Geolocation} from '@ionic-native/geolocation';
import {LocationStoreProvider} from '../providers/location-store/location-store';
import {ProductStoreProvider} from '../providers/product-store/product-store';
import {SQLite} from "@ionic-native/sqlite";
import {SQLitePorter} from "@ionic-native/sqlite-porter";
//import {GoogleMap, Marker} from '@ionic-native/google-maps';

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        ProductDetailPage,
        AddProductPage,
        MapAddLocationComponent,
        GoogleMapsWindowPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        ProductDetailPage,
        AddProductPage,
        MapAddLocationComponent,
        GoogleMapsWindowPage

    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        DatabaseProvider,
        Camera,
        ImagePicker,
        GoogleMaps,
        Geolocation,
        LocationStoreProvider,
        ProductStoreProvider,
        SQLite,
        SQLitePorter

    ]
})
export class AppModule {
}
