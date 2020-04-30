export class Mehanika
{
    constructor()
    {
        this.Vozilo = null;
        this.Zauzeto = false;
        this.Majstor = null;
        this.Segrt = null;
    }

    constructor(vozilo)
    {
        this.Vozilo = vozilo;
        this.Zauzeto = true;
        this.Majstor = null;
        this.Segrt = null;
    }
    
}