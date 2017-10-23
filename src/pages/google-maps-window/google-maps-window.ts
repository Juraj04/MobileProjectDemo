import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {GoogleMap, GoogleMapOptions, GoogleMaps, GoogleMapsEvent} from "@ionic-native/google-maps";
import {Geolocation} from '@ionic-native/geolocation';
import {LocationStoreProvider} from "../../providers/location-store/location-store";
import {Location} from "../../models/Location";

/**
 * Generated class for the GoogleMapsWindowPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-google-maps-window',
    templateUrl: 'google-maps-window.html',
})
export class GoogleMapsWindowPage {
    map: GoogleMap;
    lat: number;
    lng: number;
    location: Location;

    constructor(public navCtrl: NavController, public navParams: NavParams, private googleMaps: GoogleMaps, private geolocation: Geolocation,
                private locationStore: LocationStoreProvider, public toastCtrl: ToastController) {
        if (navParams.get("location") != null) {
            this.location = navParams.get("location");
            console.log(this.location);
        }
    }

    ionViewDidLoad() {
        console.log(this.location);
        if (this.location == null) {
            this.loadMap();
        } else {
            this.showMap();
        }

    }

    ionViewWillLeave(){
        this.map.clear();
    }


    loadMap() {


        this.geolocation.getCurrentPosition().then((resp) => {
            this.lat = resp.coords.latitude;
            this.lng = resp.coords.longitude;

            let mapElement = document.getElementById('map');
            let mapOptions: GoogleMapOptions = {
                camera: {
                    target: {
                        lat: this.lat,
                        lng: this.lng
                    },
                    zoom: 18,
                    tilt: 30
                }
            };

            this.map = this.googleMaps.create(mapElement, mapOptions);

            this.map.one(GoogleMapsEvent.MAP_READY)
                .then(() => {
                    console.log('Map is ready!');

                    this.presentToast('Click on location and save', 'bottom');

                    this.map.addMarker({
                        title: 'Ionic',
                        icon: 'blue',
                        animation: 'DROP',
                        position: {
                            lat: this.lat,
                            lng: this.lng
                        }

                    })
                        .then(marker => {
                            marker.on(GoogleMapsEvent.MARKER_CLICK)
                                .subscribe(() => {
                                    alert('Lat: ' + this.lat + '| Lng: ' + this.lng);
                                });

                        });
                    this.map.on(GoogleMapsEvent.MAP_CLICK)
                        .subscribe(data => {
                            this.map.clear()
                                .then(() => {
                                    let coordinates = JSON.parse(data);
                                    this.lat = coordinates['lat'];
                                    this.lng = coordinates['lng'];
                                    this.presentToast('New location at: ' +'Lat: ' + this.lat + '| Lng: ' + this.lng, 'bottom');

                                    this.map.addMarker({
                                        icon: 'blue',
                                        animation: 'DROP',
                                        position: {
                                            lat: this.lat,
                                            lng: this.lng
                                        }
                                    })
                                        .then(marker => {
                                            marker.on(GoogleMapsEvent.MARKER_CLICK)
                                                .subscribe(() => {
                                                    alert('Lat: ' + this.lat + '| Lng: ' + this.lng);

                                                });
                                        });
                                });

                        })

                });
        }).catch((error) => {
            console.log('Error getting location', error);
        });


    }

    saveLocation() {
        if(this.location == null){
            this.locationStore.lng = this.lng;
            this.locationStore.lat = this.lat;
            console.log(this.locationStore.lng + "  " + this.locationStore.lat);

            this.presentToast('Saved location: ' +'Lat: ' + this.lat + '| Lng: ' + this.lng, 'bottom');
        }
        this.map.clear();
        this.navCtrl.pop();
    }

    showMap() {
        let mapElement = document.getElementById('map');
        let mapOptions: GoogleMapOptions = {
            camera: {
                target: {
                    lat: this.location.lat,
                    lng: this.location.lng,
                },
                zoom: 18,
                tilt: 30
            }
        };

        this.map = this.googleMaps.create(mapElement, mapOptions);

        // Wait the MAP_READY before using any methods.
        this.map.one(GoogleMapsEvent.MAP_READY)
            .then(() => {
                console.log('Map is ready!');


                // Now you can use all methods safely.
                this.map.addMarker({
                    title: this.location.name,
                    icon: 'blue',
                    animation: 'DROP',
                    position: {
                        lat: this.location.lat,
                        lng: this.location.lng
                    },

                })
            });
    }

    presentToast(message: string, position: string){
        const toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: position
        });

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
    }
}


/*
 marker.addEventListener(GoogleMapsEvent.MARKER_DRAG_START).subscribe(data => {
 console.log('DRAG START');
 })
 marker.addEventListener(GoogleMapsEvent.MARKER_DRAG_END).subscribe(
 data => {
 marker.getPosition().then((LatLng) => {
 alert(JSON.stringify(LatLng))
 //  alert('GoogleMapsEvent.MARKER_DRAG_END Lat ~ '+LatLng.lat() + ' And Long ~ '+LatLng.lng())
 console.log(LatLng);

 });

 });
 */