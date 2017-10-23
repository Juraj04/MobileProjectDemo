import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Platform} from "ionic-angular";
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import {SQLitePorter} from '@ionic-native/sqlite-porter';
import {Observable} from 'rxjs/Observable';

import {DatabaseModel} from "../../models/DatabaseModel";
import {Product} from "../../models/Product";
import {Location} from "../../models/Location";


/*
 Generated class for the DatabaseProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */
@Injectable()
export class DatabaseProvider {
    private readonly databaseName: string = 'data.db';
    private database: SQLiteObject;

    constructor(private sqlite: SQLite, private sqlitePorter: SQLitePorter, private platform: Platform) {
        console.log('Hello DatabaseProvider Provider');

        this.platform.ready().then(() => {
            this.sqlite.create({
                name: this.databaseName,
                location: 'default'
            })
                .then((database: SQLiteObject) => {
                    this.database = database;
                    //DatabaseModel.dropAllTables(sqlitePorter, this.database).then(() => {
                    DatabaseModel.createTables(sqlitePorter, this.database);
                    //});
                });
        });

        this.getDatabaseState().subscribe(rdy => {
            if (rdy) {
                //this.createProducts();
                /*let test: Product = new Product("TEST", new Location("TESTLOCATION", 0, 0), 100, 5, "http://static1.visitfinland.com/wp-content/uploads/Header_lapland_konsta_aurora_hannes.jpg", ["haha", "ebeb"]);
                 this.addProduct(test)
                 .then((data) => {
                 data.name = "CHANGEDTEST";
                 return this.updateProduct(data);
                 })
                 .then((data) => {
                 return this.deleteProduct(data);
                 })*/
            }
        })
    }

    private createProducts() {
        let names = ["voda", "mnasko", "cipsik", "vlocky", "jogurt", "kondomy", "chlieb", "ryza"];
        let locations = [new Location('Prisma', 0, 0), new Location('Lidl', 0, 0), new Location('K-Market', 0, 0), new Location('Tesco', 0, 0)];
        let product_tags = ["glutenFree", "raw", "hipster", "nom", "nomnom", "nomnomnom", "chefmode"];
        let photos = ["https://cdn.i0.cz/public-data/ec/aa/37f79c813099a191d3c4e7392612_r16:9_w1180_h664_gi:photo:600657.jpg", "http://metabolizmus.sk/wp-content/uploads/jogurt.jpg", "http://www.bageta.eu/fotky-nr/chlieb-razny.jpg"];

        for (let i = 0; i < 5; i++) {
            let price = Math.trunc((Math.random() * 100) % 100);
            let rating = Math.trunc((Math.random() * 10) & 5);

            let tags = [];
            for (let j = 0; j < 4; j++) {
                tags[j] = product_tags[Math.trunc((Math.random() * 10) % product_tags.length)];
            }

            this.addProduct(new Product(
                names[Math.trunc((Math.random() * 10) % names.length)],
                locations[Math.trunc((Math.random() * 10) % locations.length)],
                price,
                rating,
                photos[Math.trunc((Math.random() * 10) % photos.length)],
                tags
            ));
        }
    }

    addLocation(location: Location): Promise<Location> {
        if (location.id == null) {
            let sql = 'INSERT INTO ' + DatabaseModel.TABLE_LOCATIONS
                + ' ('
                + DatabaseModel.COLUMN_NAME + ', '
                + DatabaseModel.COLUMN_X + ', '
                + DatabaseModel.COLUMN_Y
                + ') VALUES (?, ?, ?)';

            return this.database.executeSql(sql, [location.name, location.lat, location.lng])
                .then(data => {
                    console.log('Executed: ', sql);
                    location.id = data.insertId;
                    console.log('addLocation location= ', location);
                    return location;
                }).catch(err => console.log(err));
        } else return Promise.resolve(location);
    }

    getLocation(id: number): Promise<Location> {
        let sql = 'SELECT * FROM ' + DatabaseModel.TABLE_LOCATIONS + ' WHERE ' + DatabaseModel.COLUMN_ID + ' = (?)';

        return this.database.executeSql(sql, [id])
            .then(data => {
                console.log('Executed: ', sql);
                let location: Location = null;
                if (data.rows.length == 1) {
                    location = new Location(data.rows.item(0).name, data.rows.item(0).x, data.rows.item(0).y);
                    location.id = data.rows.item(0).id;
                }
                console.log('getLocation location= ', location);
                return location;
            }).catch(err => console.log(err));
    }

    getAllLocations(): Promise<Location[]> {
        let sql = 'SELECT * FROM ' + DatabaseModel.TABLE_LOCATIONS;

        return this.database.executeSql(sql, [])
            .then((data) => {
                console.log('Executed: ', sql);
                let locations: Location[] = [];
                if (data.rows.length > 0) {
                    for (let i = 0; i < data.rows.length; i++) {
                        let location: Location = new Location(data.rows.item(i).name, data.rows.item(i).x, data.rows.item(i).y);
                        location.id = data.rows.item(i).id;
                        locations.push(location);
                    }
                }
                console.log('getAllLocations locations= ', locations);
                return locations;
            }).catch(err => console.log(err));
    }


    addProduct(product: Product): Promise<Product> {
        if (product.id == null) {
            return this.addLocation(product.location)
                .then(data => {
                    let sql = 'INSERT INTO ' + DatabaseModel.TABLE_PRODUCTS
                        + ' ('
                        + DatabaseModel.COLUMN_NAME + ', '
                        + DatabaseModel.COLUMN_PRICE + ', '
                        + DatabaseModel.COLUMN_RATING + ', '
                        + DatabaseModel.COLUMN_PHOTO + ', '
                        + DatabaseModel.COLUMN_ID_LOCATION
                        + ') VALUES (?, ?, ?, ?, ?)';

                    return this.database.executeSql(sql,
                        [product.name, product.price, product.rating, product.photo, data.id])
                        .then(data => {
                            console.log('Executed: ', sql);
                            product.id = data.insertId;
                            let inserts = [];
                            for (let tag of product.tags) {
                                inserts.push(this.addProductTag(product.id, tag));
                            }
                            return Promise.all(inserts)
                                .then(() => {
                                    console.log('addProduct product= ', product);
                                    return product;
                                });
                        }).catch(err => console.log(err));
                });
        }
        else
            return Promise.resolve(product);
    }

    updateProduct(product: Product): Promise<Product> {
        return this.addLocation(product.location).then(data => {
            let sql = 'UPDATE ' + DatabaseModel.TABLE_PRODUCTS
                + ' SET '
                + DatabaseModel.COLUMN_NAME + ' = (?), '
                + DatabaseModel.COLUMN_PRICE + ' = (?), '
                + DatabaseModel.COLUMN_RATING + ' = (?), '
                + DatabaseModel.COLUMN_PHOTO + ' = (?), '
                + DatabaseModel.COLUMN_ID_LOCATION + ' = (?)'
                + ' WHERE ' + DatabaseModel.COLUMN_ID + ' = (?)';

            return this.database.executeSql(sql,
                [product.name, product.price, product.rating, product.photo, data.id, product.id])
                .then(() => {
                    console.log('Executed: ', sql);
                    let inserts = [];
                    this.deleteAllProductTagsByProductId(product.id)
                        .then(() => {
                            for (let tag of product.tags) {
                                inserts.push(this.addProductTag(product.id, tag));
                            }
                        });
                    return Promise.all(inserts)
                        .then(() => {
                            console.log('updateProduct product= ', product);
                            return product;
                        });
                }).catch(err => console.log(err));
        });
    }

    deleteProduct(product: Product): Promise<Product> {
        return this.deleteAllProductTagsByProductId(product.id)
            .then(() => {
                let sql = 'DELETE FROM ' + DatabaseModel.TABLE_PRODUCTS + ' WHERE ' + DatabaseModel.COLUMN_ID + ' = (?)';

                return this.database.executeSql(sql, [product.id])
                    .then(() => {
                        console.log('Executed: ', sql);
                        console.log('deleteProduct= product', product);
                        return product;
                    }).catch(err => console.log(err));
            });
    }

    getProduct(id: number): Promise<Product> {
        let sql = 'SELECT '
            + DatabaseModel.TABLE_PRODUCTS + '.' + DatabaseModel.COLUMN_ID + ' AS id, '
            + DatabaseModel.TABLE_PRODUCTS + '.' + DatabaseModel.COLUMN_NAME + ' AS name, '
            + DatabaseModel.TABLE_PRODUCTS + '.' + DatabaseModel.COLUMN_PRICE + ' AS price, '
            + DatabaseModel.TABLE_PRODUCTS + '.' + DatabaseModel.COLUMN_RATING + ' AS rating, '
            + DatabaseModel.TABLE_PRODUCTS + '.' + DatabaseModel.COLUMN_PHOTO + ' AS photo, '
            + DatabaseModel.TABLE_LOCATIONS + '.' + DatabaseModel.COLUMN_ID + ' AS location_id, '
            + DatabaseModel.TABLE_LOCATIONS + '.' + DatabaseModel.COLUMN_NAME + ' AS location_name, '
            + DatabaseModel.TABLE_LOCATIONS + '.' + DatabaseModel.COLUMN_X + ' AS location_x, '
            + DatabaseModel.TABLE_LOCATIONS + '.' + DatabaseModel.COLUMN_Y + ' AS location_y '
            + ' FROM ' + DatabaseModel.TABLE_PRODUCTS
            + ' JOIN ' + DatabaseModel.TABLE_LOCATIONS + ' ON '
            + DatabaseModel.TABLE_PRODUCTS + '.' + DatabaseModel.COLUMN_ID_LOCATION + ' = ' + DatabaseModel.TABLE_LOCATIONS + '.' + DatabaseModel.COLUMN_ID
            + ' WHERE ' + DatabaseModel.TABLE_PRODUCTS + '.' + DatabaseModel.COLUMN_ID + ' = (?)';

        return Promise.all([this.database.executeSql(sql, [id]), this.getAllProductTagsByProductId(id)]).then((data) => {
            console.log('Executed: ', sql);
            let product: Product = null;
            if (data[0].rows.length > 0) {
                let location: Location = new Location(data[0].rows.item(0).location_name, data[0].rows.item(0).location_x, data[0].rows.item(0).location_y)
                location.id = data[0].rows.item(0).location_id;

                product = new Product(
                    data[0].rows.item(0).name,
                    location,
                    data[0].rows.item(0).price,
                    data[0].rows.item(0).rating,
                    data[0].rows.item(0).photo,
                    data[1]);
                product.id = data[0].rows.item(0).id;
            }
            console.log('getProduct product= ', product);
            return product;
        }).catch(err => console.log(err));
    }

    getAllProducts(): Promise<Product[]> {
        let sql = 'SELECT '
            + DatabaseModel.TABLE_PRODUCTS + '.' + DatabaseModel.COLUMN_ID + ' AS id, '
            + DatabaseModel.TABLE_PRODUCTS + '.' + DatabaseModel.COLUMN_NAME + ' AS name, '
            + DatabaseModel.TABLE_PRODUCTS + '.' + DatabaseModel.COLUMN_PRICE + ' AS price, '
            + DatabaseModel.TABLE_PRODUCTS + '.' + DatabaseModel.COLUMN_RATING + ' AS rating, '
            + DatabaseModel.TABLE_PRODUCTS + '.' + DatabaseModel.COLUMN_PHOTO + ' AS photo, '
            + DatabaseModel.TABLE_LOCATIONS + '.' + DatabaseModel.COLUMN_ID + ' AS location_id, '
            + DatabaseModel.TABLE_LOCATIONS + '.' + DatabaseModel.COLUMN_NAME + ' AS location_name, '
            + DatabaseModel.TABLE_LOCATIONS + '.' + DatabaseModel.COLUMN_X + ' AS location_x, '
            + DatabaseModel.TABLE_LOCATIONS + '.' + DatabaseModel.COLUMN_Y + ' AS location_y '
            + ' FROM ' + DatabaseModel.TABLE_PRODUCTS
            + ' JOIN ' + DatabaseModel.TABLE_LOCATIONS + ' ON '
            + DatabaseModel.TABLE_PRODUCTS + '.' + DatabaseModel.COLUMN_ID_LOCATION + ' = ' + DatabaseModel.TABLE_LOCATIONS + '.' + DatabaseModel.COLUMN_ID;

        return this.database.executeSql(sql, [])
            .then(data => {
                console.log('Executed: ', sql);
                let products: Product[] = [];
                if (data.rows.length > 0) {
                    for (let i = 0; i < data.rows.length; i++) {
                        let location: Location = new Location(data.rows.item(i).location_name, data.rows.item(i).location_x, data.rows.item(i).location_y)
                        location.id = data.rows.item(i).location_id;

                        this.getAllProductTagsByProductId(data.rows.item(i).id)
                            .then(tags => {
                                let product: Product = new Product(
                                    data.rows.item(i).name,
                                    location,
                                    data.rows.item(i).price,
                                    data.rows.item(i).rating,
                                    data.rows.item(i).photo,
                                    tags);
                                product.id = data.rows.item(i).id;
                                products.push(product);
                            })
                    }
                }
                console.log('getAllProducts products= ', products);
                return products;
            }).catch(err => console.log(err));
    }

    addProductTag(id_product: number, name: string): Promise<string> {
        let sql = 'INSERT INTO ' + DatabaseModel.TABLE_PRODUCT_TAGS
            + ' ('
            + DatabaseModel.COLUMN_ID_PRODUCT + ', '
            + DatabaseModel.COLUMN_NAME
            + ') VALUES (?, ?)';

        return this.database.executeSql(sql, [id_product, name])
            .then(() => {
                console.log('Executed: ', sql);
                console.log('addProductTag name= ', name);
                return name;
            }).catch(err => console.log(err));
    }

    deleteAllProductTagsByProductId(id: number): Promise<boolean> {
        let sql = 'DELETE FROM ' + DatabaseModel.TABLE_PRODUCT_TAGS + ' WHERE ' + DatabaseModel.COLUMN_ID_PRODUCT + ' = (?)';

        return this.database.executeSql(sql, [id])
            .then(() => {
                console.log('Executed: ', sql);
                return true;
            }).catch(err => console.log(err));
    }

    getAllProductTagsByProductId(id: number): Promise<string[]> {
        let sql = 'SELECT * FROM ' + DatabaseModel.TABLE_PRODUCT_TAGS + ' WHERE ' + DatabaseModel.COLUMN_ID_PRODUCT + ' = (?)';

        return this.database.executeSql(sql, [id])
            .then((data) => {
                console.log('Executed: ', sql);
                let productTags: string[] = [];
                if (data.rows.length > 0) {
                    for (let i = 0; i < data.rows.length; i++) {
                        productTags.push(data.rows.item(i).name);
                    }
                }
                console.log('getAllProductTagsByProductId productTags= ', productTags);
                return productTags;
            }).catch(err => console.log(err));
    }

    getAllProductTags(): Promise<string[]> {
        let sql = 'SELECT * FROM ' + DatabaseModel.TABLE_PRODUCT_TAGS;

        return this.database.executeSql(sql, [])
            .then((data) => {
                console.log('Executed: ', sql);
                let productTags: string[] = [];
                if (data.rows.length > 0) {
                    for (let i = 0; i < data.rows.length; i++) {
                        productTags.push(data.rows.item(i).name);
                    }
                }
                console.log('getAllProductTags productTags= ', productTags);
                return productTags;
            }).catch(err => console.log(err));
    }

    getDatabaseState(): Observable<boolean> {
        return DatabaseModel.getDatabaseState();
    }
}
