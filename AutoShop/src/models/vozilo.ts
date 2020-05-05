export class Vozilo
{
    Marka: any;
    Oznaka: any;
    Registracija: any;
    VrstaKvara: any;
    OpisProblema: any;
    Status: string;
    constructor(marka:any, oznaka:any, registracija:any, vrstaKvara:any, opisProblema:any)
    {
        this.Marka = marka;
        this.Oznaka = oznaka;
        this.Registracija = registracija;
        this.VrstaKvara = vrstaKvara;
        this.OpisProblema = opisProblema;
        this.Status = "Na cekanju";
    }
}