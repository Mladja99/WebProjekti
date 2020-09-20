export class Majstor
{
    id: number;
    ime: string;
    poznaje: string;
    zauzet: boolean;
    radiNa: string;
    
    constructor(id: number, ime: string, poznaje: string)
    {
        this.id = id;
        this.ime = ime;
        this.poznaje = poznaje;
        this.zauzet = false;
        this.radiNa = "";
    }    
}