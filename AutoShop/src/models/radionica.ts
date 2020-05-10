import { Vozilo } from "./vozilo";
import { Majstor } from "./majstor";
import { Segrt } from "./segrt";
export class Radionica
{
    Vozilo: any;
    vrsta: any;
    Zauzeto: boolean;
    Majstor: any;
    Segrt: any;
    constructor(vrsta:any)
    {
        this.Vozilo = null;
        this.vrsta = vrsta;
        this.Zauzeto = false;
        this.Majstor = null;
        this.Segrt = null;
    }
}