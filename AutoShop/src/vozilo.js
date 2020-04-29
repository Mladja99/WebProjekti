export class Vozilo
{
    constructor(marka, oznaka, registracija,vrstaKvara, opisProblema)
    {
        this.marka = marka;
        this.oznaka = oznaka;
        this.registracija = registracija;
        this.vrstaKvara = vrstaKvara;
        this.opisProblema = opisProblema;
        this.status = "Na cekanju";
    }
}