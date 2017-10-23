import {SQLiteObject} from "@ionic-native/sqlite";
import {SQLitePorter} from "@ionic-native/sqlite-porter";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

export class DatabaseModel {
//Table names
    static readonly TABLE_LOCATIONS: string = 'locations';
    static readonly TABLE_PRODUCTS: string = 'products';
    static readonly TABLE_PRODUCT_TAGS: string = 'product_tags';

    //Common column names
    static readonly COLUMN_ID: string = 'id';
    static readonly COLUMN_NAME: string = 'name';

    //TABLE_LOCATIONS column names
    static readonly COLUMN_X: string = 'x';
    static readonly COLUMN_Y: string = 'y';

    //TABLE_PRODUCT column names
    static readonly COLUMN_PRICE: string = 'price';
    static readonly COLUMN_RATING: string = 'rating';
    static readonly COLUMN_PHOTO: string = 'photo';
    static readonly COLUMN_ID_LOCATION: string = 'id_location';

    //TABLE_PRODUCT_TAGS column names
    static readonly COLUMN_ID_PRODUCT: string = 'id_product';

    //Database creation SQL statement
    private static readonly TABLES: string[] = [
        'CREATE TABLE IF NOT EXISTS ' + DatabaseModel.TABLE_LOCATIONS
        + ' ('
        + DatabaseModel.COLUMN_ID + ' INTEGER PRIMARY KEY AUTOINCREMENT, '
        + DatabaseModel.COLUMN_NAME + ' TEXT, '
        + DatabaseModel.COLUMN_X + ' REAL, '
        + DatabaseModel.COLUMN_Y + ' REAL'
        + ');',

        'CREATE TABLE IF NOT EXISTS ' + DatabaseModel.TABLE_PRODUCTS
        + ' ('
        + DatabaseModel.COLUMN_ID + ' INTEGER PRIMARY KEY AUTOINCREMENT, '
        + DatabaseModel.COLUMN_NAME + ' TEXT, '
        + DatabaseModel.COLUMN_PRICE + ' REAL, '
        + DatabaseModel.COLUMN_RATING + ' INTEGER, '
        + DatabaseModel.COLUMN_PHOTO + ' TEXT, '
        + DatabaseModel.COLUMN_ID_LOCATION + ' INTEGER, '
        + 'FOREIGN KEY (' + DatabaseModel.COLUMN_ID_LOCATION + ') REFERENCES ' + DatabaseModel.TABLE_LOCATIONS + '(' + DatabaseModel.COLUMN_ID + ')'
        + ');',

        'CREATE TABLE IF NOT EXISTS ' + DatabaseModel.TABLE_PRODUCT_TAGS
        + ' ('
        + DatabaseModel.COLUMN_ID_PRODUCT + ' INTEGER, '
        + DatabaseModel.COLUMN_NAME + ' TEXT, '
        + 'FOREIGN KEY (' + DatabaseModel.COLUMN_ID_PRODUCT + ') REFERENCES ' + DatabaseModel.TABLE_PRODUCTS + '(' + DatabaseModel.COLUMN_ID + '), '
        + 'PRIMARY KEY (' + DatabaseModel.COLUMN_ID_PRODUCT + ', ' + DatabaseModel.COLUMN_NAME + ')'
        + ');',
    ];

    private static databaseReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor() {
        console.log('Hello ModelDatabase');
    }

    static createTables(sqlitePorter: SQLitePorter, database: SQLiteObject) {
        this.databaseReady.next(false);
        console.log('DBREADY: ', this.databaseReady.getValue());
        for (let table of DatabaseModel.TABLES) {
            sqlitePorter.importSqlToDb(database, table)
                .then(() => {
                    console.log('Executed: ', table);
                })
                .catch(err => console.error(err));
        }
        this.databaseReady.next(true);
        console.log('DBREADY: ', this.databaseReady.getValue());
    }

    /**
     * Wipes all data from a database by dropping all existing tables!
     *
     * @param {SQLitePorter} sqlitePorter
     * @param {SQLiteObject} database
     */
    static dropAllTables(sqlitePorter: SQLitePorter, database: SQLiteObject): Promise<any> {
        return sqlitePorter.wipeDb(database)
            .then((count) => console.log('Successfully wiped ' + count + ' tables'))
            .catch(err => console.error(err));
    }

    static getDatabaseState(): Observable<boolean> {
        return this.databaseReady.asObservable();
    }
}
