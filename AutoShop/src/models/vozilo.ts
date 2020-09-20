export class Vozilo
{
    id: number;
    marka: string;
    oznaka: string;
    registracija: string;
    vrstaKvara: string;
    opisProblema: string;
    status: string;
    
    constructor(id:number, marka:string, oznaka:string, registracija:string, vrstaKvara:string, opisProblema:string)
    {
        this.marka = marka;
        this.oznaka = oznaka;
        this.registracija = registracija;
        this.vrstaKvara = vrstaKvara;
        this.opisProblema = opisProblema;
        this.status = "Na cekanju";
    }
}