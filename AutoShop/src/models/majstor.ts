export class Majstor
{
    id: any;
    ime: any;
    poznaje: any;
    zauzet: boolean;
    radiNa: any;
    
    constructor(id: any, ime: any, poznaje: any)
    {
        this.id = id;
        this.ime = ime;
        this.poznaje = poznaje;
        this.zauzet = false;
        this.radiNa = "";
    }    
}