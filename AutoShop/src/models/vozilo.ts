export class Vozilo
{
    id: number;
    marka: string;
    oznaka: string;
    registracija: string;
    vrstaKvara: string;
    opisProblema: string;
    status: string;
    profit:number;
    
    constructor(id:number, marka:string, oznaka:string, registracija:string, vrstaKvara:string, opisProblema:string, profit:number)
    {
        this.id = id;
        this.marka = marka;
        this.oznaka = oznaka;
        this.registracija = registracija;
        this.vrstaKvara = vrstaKvara;
        this.opisProblema = opisProblema;
        this.status = "Na cekanju";
        this.profit = profit;
    }
}