/**
 * Created by janik on 17.10.2017.
 */
import {Location} from "./Location"
export class Product {
    id: number;

    constructor(public name: string,
                public location: Location,
                public price: number,
                public rating: number,
                public photo: string,
                public tags: string[]) {
    }
}