export class Vozilo
{
    constructor(marka, oznaka, registracija, vrstaKvara, opisProblema)
    {
        this.Marka = marka;
        this.Oznaka = oznaka;
        this.Registracija = registracija;
        this.VrstaKvara = vrstaKvara;
        this.OpisProblema = opisProblema;
        this.Status = "Na cekanju";
    }
}