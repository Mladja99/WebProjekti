import { Vozilo } from "./vozilo";
export class Segrt
{
    constructor(id, ime)
    {
        this.id = id;
        this.ime = ime;
        this.zauzet = false;
        this.radiU = null;
    }

    async function SpremiVozilo(Vozilo)
    {
        return new Promise((resolve, reject) => {
            switch(Vozilo.vrstaKvara)
            {
                case "mehanicki" : //premesti u radnju za mehaniku

                case "elektricni" : //premesti u radnju za elektriku

                case "ECU" : //premesti u radionicu za ECU
            }
        }
    }
}