import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {BehaviorSubject, Observable} from "rxjs";
import {DatabaseProvider} from "../database/database";
import {Product} from "../../models/Product";

/*
  Generated class for the ProductStoreProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProductStoreProvider {
  private _products: BehaviorSubject<Product[]> = new BehaviorSubject([]);
  public readonly products: Observable<Product[]> = this._products.asObservable();


  constructor(private db: DatabaseProvider) {
    console.log('Hello ProductStoreProvider Provider');
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getAllProducts().then(value => {
          this._products.next(value);
          console.log("product store :" + value);
        })
      }
    })
  }

  addProduct(product: Product) {
    this.db.addProduct(product).then(value => {
      let n = this._products.getValue();
      n.push(value);
      this._products.next(n)
    });

  }

  deleteProduct(product: Product){
    this.db.deleteProduct(product).then(value => {
      let n = this._products.getValue();
      let index = n.indexOf(product);
      n.splice(index,1);
      this._products.next(n);
    })
  }

  updateProduct(original: Product, changed: Product){
    this.db.updateProduct(changed).then(value => {
      let n = this._products.getValue();
      let index = n.indexOf(original);
      n[index] = value;
      this._products.next(n);
    })

  }

}
