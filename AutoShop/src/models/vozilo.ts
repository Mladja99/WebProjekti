export class Vozilo
{
    id: number;
    marka: any;
    oznaka: any;
    registracija: any;
    vrstaKvara: any;
    opisProblema: any;
    status: string;
    constructor(id:number, marka:any, oznaka:any, registracija:any, vrstaKvara:any, opisProblema:any)
    {
        this.marka = marka;
        this.oznaka = oznaka;
        this.registracija = registracija;
        this.vrstaKvara = vrstaKvara;
        this.opisProblema = opisProblema;
        this.status = "Na cekanju";
    }
}