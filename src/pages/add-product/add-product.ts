import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {Camera, CameraOptions} from "@ionic-native/camera";
import {ImagePicker, ImagePickerOptions} from "@ionic-native/image-picker";
import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    GoogleMapOptions,
    CameraPosition,
    MarkerOptions,
    Marker
} from '@ionic-native/google-maps';
import {MapAddLocationComponent} from "../../components/map-add-location/map-add-location";
import {GoogleMapsWindowPage} from "../google-maps-window/google-maps-window";
import {LocationStoreProvider} from "../../providers/location-store/location-store";
import {Location} from "../../models/Location";
import {Product} from "../../models/Product";
import {DatabaseProvider} from "../../providers/database/database";
import {ProductStoreProvider} from "../../providers/product-store/product-store";

/**
 * Generated class for the AddProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-add-product',
    templateUrl: 'add-product.html',
})
export class AddProductPage {
    name: string;
    locationName: string;
    price: number;
    rating: number = 3;
    photo: string = "./assets/img/default-placeholder.png";
    tags: string = "";


    constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, private imagePicker: ImagePicker,
                public modal: ModalController, private locationStore: LocationStoreProvider, private productStore:ProductStoreProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AddProductPage');
    };

    createProduct() {
        let location = new Location(this.locationName,this.locationStore.lat,this.locationStore.lng);

        let tgs: string[] = this.tags.split(" ");
        tgs.push(this.name.replace(" ",""));
        tgs.push(location.name.replace(" ",""));
        let product = new Product(this.name,location,this.price,this.rating,this.photo,tgs);
        console.log(product);

        this.productStore.addProduct(product);
        this.navCtrl.pop();
    };

    takeAPhoto() {
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            saveToPhotoAlbum: true
        };

        this.camera.getPicture(options).then((imageData) => {
            console.log(imageData)
            this.photo = imageData
        }, (err) => {
            console.log("photo failed")
        });
    }

    selectFromGalery() {
        const options: ImagePickerOptions = {
            quality: 100,
            maximumImagesCount: 1

        };

        this.imagePicker.getPictures(options).then((imageData) => {
            console.log(imageData)
            this.photo = imageData
        }, (err) => {
            console.log("photo failed")
        });
    }

    getLocation() {
        this.navCtrl.push(GoogleMapsWindowPage, {});
    };
}

