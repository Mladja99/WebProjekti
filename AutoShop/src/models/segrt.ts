export class Segrt
{
    id: number;
    ime: string;
    zauzet: boolean;
    radiNa: string;
    constructor(id: number, ime: string)
    {
        this.id = id;
        this.ime = ime;
        this.zauzet = false;
        this.radiNa = "";
    }
}