export class Radionica
{
    id: number;
    vozilo: number;
    vrsta: string;
    zauzeto: boolean;
    majstor: number;
    segrt: number;
    constructor(vrsta:string, id:number)
    {
        this.id = id;
        this.vozilo = null;
        this.vrsta = vrsta;
        this.zauzeto = false;
        this.majstor = null;
        this.segrt = null;
    }
}