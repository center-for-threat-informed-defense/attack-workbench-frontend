import {StixObject} from "./stix-object";
import { Relationship } from './relationship';

export class Group extends StixObject {
    public name: string;
    public description: string;

    constructor(sdo: any) {
        super(sdo);
        this.name = sdo.name;
        this.description = sdo.description;
    }

}
