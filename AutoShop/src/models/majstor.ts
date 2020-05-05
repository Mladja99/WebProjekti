export class Majstor
{
    Id: any;
    Ime: any;
    Poznaje: any;
    Zauzet: boolean;
    RadiNa: any;
    
    constructor(id: any, ime: any, poznaje: any)
    {
        this.Id = id;
        this.Ime = ime;
        this.Poznaje = poznaje;
        this.Zauzet = false;
        this.RadiNa = null;
    }    
}