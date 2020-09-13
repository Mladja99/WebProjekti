import { vratiRadionice } from "./models/radionica.service";
import { Radionica } from "./models/radionica";
import { Vozilo } from "./models/vozilo";
import * as indexTs from "./../index";
export class View
{
    container: HTMLDivElement;
    header: HTMLDivElement;
    mainContainer: HTMLDivElement;
    constructor(parent: HTMLElement)
    {
        this.container = document.createElement("div");
        this.container.className = "container";
        this.container.id = "container";
        this.header = document.createElement("div");
        this.header.className = "header";
        const naslov = document.createElement("h2");
        naslov.innerHTML = "Servis vozila";
        this.header.appendChild(naslov);
        this.container.appendChild(this.header);

        this.mainContainer = document.createElement("div");
        this.mainContainer.className = "main";
        this.mainContainer.id = "main";
        this.container.appendChild(this.mainContainer);

        const mainContainer2 = document.createElement("div");
        mainContainer2.className = "main";
        mainContainer2.id = "main2";
        this.container.appendChild(mainContainer2);

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
}
    export function crtajVozilo(vozilo:Vozilo)
    {
        const garaza = document.getElementById(vozilo.vrstaKvara);
        const data = document.createElement("ul");
        const podatak = document.createElement("li");
        podatak.innerHTML = vozilo.marka;
        data.appendChild(podatak);
        const podatak2 = document.createElement("li");
        podatak2.innerHTML = vozilo.oznaka;
        data.appendChild(podatak2);
        const podatak3 = document.createElement("li");
        podatak3.innerHTML = vozilo.registracija;
        data.appendChild(podatak3);
        garaza.appendChild(data);
    }

    export function IspisiMajstora(radionica:Radionica)
    {
        const garaza = document.getElementById(radionica.vrsta);
        const data = document.createElement("ul");
        const podatak = document.createElement("li");
        podatak.innerHTML = "Majstor koji trenurno radi na vozilu:";
        data.appendChild(podatak);
        const podatak2 = document.createElement("li");
        podatak2.innerHTML = radionica.majstor.ime;
        data.appendChild(podatak2);
        garaza.appendChild(data);
    }

    export function IzbrisiMajstora(rad:Radionica)
    {
        const garaza = document.getElementById(rad.vrsta);
        const data = garaza.lastChild;
        data.remove();
    }
    export function brisiVozilo(radionica : string)
    {
        const garaza = document.getElementById(radionica);
        const data = garaza.firstChild;
        
        data.remove();
    }

    export function iscrtajDanasnjeRadnike(array:any)
    {
        const contain = document.getElementById("container");
        var footer = document.createElement("div");
        footer.className = "footer";
        const labela = document.createElement("label");
        labela.innerHTML = "Danasnji radnici:";
        footer.appendChild(labela);
        var radnici = document.createElement("div");
        radnici.className = "radniciDiv";
        
        let i = 0;

        //majstori

        var div = document.createElement("div");
        div.className = "zaRadnike";

        const labela1 = document.createElement("label");
        labela1.innerHTML = "Majstori:";
        div.appendChild(labela1);
        const data = document.createElement("ul");
        data.className ="listaChild";
        for(i=0;i<array["majstori"].length;i++)
        {
            const podatak = document.createElement("li");
            podatak.innerHTML = array["majstori"][i];
            data.appendChild(podatak);
        }

        div.appendChild(data);
        radnici.appendChild(div);
        footer.appendChild(radnici);

        //segrti:
        
        var div2 = document.createElement("div");
        div2.className = "zaRadnike";

        const labela2 = document.createElement("label");
        labela2.innerHTML = "Segrti:";
        div2.appendChild(labela2);
        const data2 = document.createElement("ul");
        data2.className ="listaChild";
        for(i=0;i<array["majstori"].length;i++)
        {
            const podatak = document.createElement("li");
            podatak.innerHTML = array["segrti"][i];
            data2.appendChild(podatak);
        }
        div2.appendChild(data2);
        radnici.appendChild(div2);
        footer.appendChild(radnici);
        contain.appendChild(footer);
    }

    export function NapraviMesto()
    {
        const path = document.getElementById("main2");
        const lista = document.createElement("div");// div cele garaze
        lista.className = "lista"; 

        const sve = document.createElement("div");
        sve.className = "danas";
        const sveUL = document.createElement("ul");
        sveUL.className = "sveUL";
        sveUL.id = "sveUL";

        const labela2 = document.createElement("label");
        labela2.innerHTML = "Sva vozila za servis: ";
        sve.appendChild(labela2);

        sve.appendChild(sveUL);
         
        const danas = document.createElement("div");
        danas.className = "danas";
        const danasUL = document.createElement("ul");
        danasUL.className = "danasUL";
        danasUL.id = "danasUL";

        const labela = document.createElement("label");
        labela.innerHTML = "Vozila koja su danas uradjena:";
        danas.appendChild(labela);

        danas.appendChild(danasUL);
        lista.appendChild(sve);
        lista.appendChild(danas);
        path.appendChild(lista);
    }
    //let i = 0;
    export function iscrtajDanasnjaVozila(vozila : Vozilo)
    {
        // i++;
        // if(vozila.id == i)
        // {
        //     //danas vozila
        //     const ul = document.getElementById("danasUL");
        //     const podatak = document.createElement("li");
        //     podatak.innerHTML = vozila.marka + " " + vozila.oznaka;
        //     ul.appendChild(podatak);
        // }
        // else
        // {
        //     //sva vozila
        //     const ul = document.getElementById("sveUL");
        //     const podatak = document.createElement("li");
        //     podatak.innerHTML = vozila.marka + " " + vozila.oznaka;
        //     ul.appendChild(podatak);
        // }

        //Iscrtava vozilo u neuredjenoj listi za izbor vozila
        const ul = document.getElementById("sveUL");
        const voziloContainer = document.createElement("div");
        voziloContainer.className = "voziloContainer";
        const podatak = document.createElement("li");
        podatak.innerHTML = vozila.marka + " " + vozila.oznaka + " " + vozila.registracija;
        voziloContainer.appendChild(podatak);
        const dugme = document.createElement("button");
        dugme.className = "UbaciVoziloButton";
        dugme.innerHTML = "Ubaci vozilo";
        dugme.onclick = (ev) => {
            //ovde stavi za poziv funkcije za ubacivanje vozila
            indexTs.ProslediUServis(vozila);
        }
        voziloContainer.appendChild(dugme);
        ul.appendChild(voziloContainer);
    }
    
