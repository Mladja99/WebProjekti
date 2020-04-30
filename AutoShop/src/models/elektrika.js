export class Elektrika
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
    
    

    /*export function UbaciVozilo(vozilo)
    {

    }

    export function IzbaciVozilo()
    {
        this.Vozilo = null;
        this.Zauzeto = false;
    }

    async function RadiNaVozilu(majstor)
    {
        
    }*/