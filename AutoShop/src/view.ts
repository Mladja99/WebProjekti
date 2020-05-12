import { vratiRadionice } from "./models/radionica.service"
import { Radionica } from "./models/radionica";
import { Vozilo } from "./models/vozilo";
export class View
{
    container: HTMLDivElement;
    header: HTMLDivElement;
    mainContainer: HTMLDivElement;
    constructor(parent: HTMLElement)
    {
        this.container = document.createElement("div");
        this.container.className = "container";

        this.header = document.createElement("div");
        this.header.className = "header";
        var naslov = document.createElement("h2");
        naslov.innerHTML = "Servis vozila";
        this.header.appendChild(naslov);
        this.container.appendChild(this.header);

        this.mainContainer = document.createElement("div");
        this.mainContainer.className = "main";
        this.container.appendChild(this.mainContainer);

        this.crtajGarazu(this.mainContainer);
        
        parent.appendChild(this.container);
    }

    crtajGarazu(path: HTMLDivElement)
    {
        vratiRadionice().then((radionice) => 
            radionice.forEach((radionica: Radionica) => {
                const garaza = document.createElement("div");// div cele garaze
                garaza.className = "garaza"; 
                const header = document.createElement("div");
                header.className = "gheader";// div za naslov garaze
                const naslov = document.createElement("h3");
                naslov.innerHTML = radionica.vrsta + " garaza";
                header.appendChild(naslov); // dodavanje teksta za naslov garaze
                const data = document.createElement("div");
                data.id = radionica.vrsta;
                data.className = "voziloData"; // div za podatke o vozilima
                //ovde ce da budu podaci o vozilu
                garaza.appendChild(header);
                garaza.appendChild(data);
                path.appendChild(garaza);
            })
        )
        
    }

    // //crtajVozilo(vozilo:Vozilo)
    // crtajVozilo = (vozilo:Vozilo) =>
    // {
    //     const garaza = document.getElementById(vozilo.vrstaKvara);
    //     const data = document.createElement("ul");
    //     var podatak = document.createElement("li");
    //     podatak.innerHTML = vozilo.marka;
    //     data.appendChild(podatak);
    //     podatak.innerHTML = vozilo.oznaka;
    //     data.appendChild(podatak);
    //     podatak.innerHTML = vozilo.registracija;
    //     data.appendChild(podatak);
    //     garaza.appendChild(data);
    // }
    
}