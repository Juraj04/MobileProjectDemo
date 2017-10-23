import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Product} from "../../models/Product";
import {DatabaseProvider} from "../../providers/database/database";
import {ProductDetailPage} from "../product-detail/product-detail";
import {AddProductPage} from "../add-product/add-product";
import {ProductStoreProvider} from "../../providers/product-store/product-store";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    private allProducts: Product[] = [];
    private products: Product[] = [];
    searchInput: string;

    constructor(public navCtrl: NavController, private productStore: ProductStoreProvider) {

    }

    ionViewDidLoad() {
        this.productStore.products.subscribe(data => {
            this.allProducts = data
            console.log(data);
            this.products = this.allProducts;

        })
    }

    doRefresh($event) {
        this.ionViewDidLoad();
        $event.complete();
    }

    productDetail(product) {
        this.navCtrl.push(ProductDetailPage, {
            product: product
        });
    }

    createProduct() {
        this.navCtrl.push(AddProductPage, {});
    }

    selectProducts() {
        if (this.searchInput.trim() == "") {
            this.products = this.allProducts;
            return;
        }

        let tgs: string[] = this.searchInput.split(" ");
        console.log(tgs);
        console.log(tgs.length)

        this.products = [];
        this.products.length = 0;
        this.products = this.allProducts.filter(value => value.tags.indexOf(this.searchInput.trim()) > -1);
        /*
        for (let i = 0; i < tgs.length; i++) {
            let helpArray = this.allProducts.filter(value => value.tags.indexOf(tgs[i].trim()) > -1);
            this.addArrays(this.products, helpArray);
        }*/

    }

    addArrays(arrayTo: any[], arrayFrom: any[]) {
        for (let i = 0; i < arrayFrom.length; i++) {
            if (!this.arrayContains(arrayTo, arrayFrom[i]))
                arrayTo.push(arrayFrom[i]);
        }
    }

    arrayContains(array: any[], object: any): boolean {
        for (let i = 0; i < array.length; i++) {
            if (array[i] == object) {
                return true;
            }
        }
        return false;
    }

    removeProduct(product){
        this.productStore.deleteProduct(product);
    }


}
