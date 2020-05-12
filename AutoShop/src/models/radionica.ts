import { Vozilo } from "./vozilo";
import { Majstor } from "./majstor";
import { Segrt } from "./segrt";
export class Radionica
{
    vozilo: any;
    vrsta: any;
    zauzeto: boolean;
    majstor: any;
    segrt: any;
    constructor(vrsta:any)
    {
        this.vozilo = null;
        this.vrsta = vrsta;
        this.zauzeto = false;
        this.majstor = null;
        this.segrt = null;
    }
}