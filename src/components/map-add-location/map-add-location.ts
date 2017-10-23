import {Component} from '@angular/core';
import {GoogleMap, GoogleMapOptions, GoogleMaps, GoogleMapsEvent, LatLng,} from "@ionic-native/google-maps";
//import {GoogleMapsLatLng} from '@ionic-native';

/**
 * Generated class for the MapAddLocationComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'map-add-location',
    templateUrl: 'map-add-location.html'
})
export class MapAddLocationComponent {

    map: GoogleMap;

    constructor(private googleMaps: GoogleMaps) {
        console.log('Hello MapAddLocationComponent Component');


    }

    ionViewDidLoad() {
        this.loadMap();
    }


    loadMap() {

        let mapElement = document.getElementById('map');
        console.log(mapElement);
        let mapOptions: GoogleMapOptions = {
            camera: {
                target: {
                    lat: 43.0741904,
                    lng: -89.3809802
                },
                zoom: 18,
                tilt: 30
            }
        };

        this.map = this.googleMaps.create(mapElement, mapOptions);
        console.log(this.map);
        this.map.one(GoogleMapsEvent.MAP_READY)
            .then(() => {
                console.log('Map is ready!');
                this.map.addMarker({
                    title: 'Ionic',
                    icon: 'blue',
                    animation: 'DROP',
                    position: {
                        lat: 43.0741904,
                        lng: -89.3809802
                    }
                })
                    .then(marker => {
                        marker.on(GoogleMapsEvent.MARKER_CLICK)
                            .subscribe(() => {
                                alert('clicked');
                            });

                    });

            });


    }
}
