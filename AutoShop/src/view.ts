import { vratiRadionice } from "./models/radionica.service";
import { Radionica } from "./models/radionica";
import { Vozilo } from "./models/vozilo";
import * as indexTs from "./../index";
import * as servisTs from "./servis";
import { vratiMajtoraPoID } from "./models/majstori.service"
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
        vratiRadionice().subscribe((radionice) => {
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
                const errorMessage = document.createElement("label");
                errorMessage.className = "errorMessage";
                garaza.appendChild(header);
                garaza.appendChild(data);
                garaza.appendChild(errorMessage);
                path.appendChild(garaza);
            });
        })
        
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

        const dugme = document.createElement("button");
        dugme.innerHTML = "Posalji majstora";
        dugme.onclick = (ev) => {
            servisTs.PosaljiMajstoraDaRadi(vozilo)
            .then(() =>{
                dugme.remove();
            })
            .catch(error => {
                const lblError = garaza.querySelector("errorMessage");
                lblError.innerHTML = error;
            });
        }
        
        data.appendChild(dugme);

        garaza.appendChild(data);
    }
    //ispisuje ime majstora u odgovarajucoj radionici u kojoj radi
    export function IspisiMajstora(radionica:Radionica)
    {
        const garaza = document.getElementById(radionica.vrsta);
        const data = document.createElement("ul");
        const podatak = document.createElement("li");
        podatak.innerHTML = "Majstor koji trenurno radi na vozilu:";
        data.appendChild(podatak);
        const podatak2 = document.createElement("li");
        vratiMajtoraPoID(radionica.majstor).then (res => {
            console.log(res)
            podatak2.innerHTML = res.ime;
        });
        data.appendChild(podatak2);
        garaza.appendChild(data);
    }
    //brise ime majstora iz radionice i dodaje dugme za izbacivanje vozila
    export function IzbrisiMajstora(rad:Radionica)
    {
        const garaza = document.getElementById(rad.vrsta);
        const data = garaza.lastChild;
        data.remove();

        const dugme = document.createElement("button");
        dugme.innerHTML = "Izbaci vozilo";
        dugme.onclick = (ev) => {
            servisTs.SegrtIzbacujeVozilo(rad)
            .then(() =>{
                dugme.remove();
            })
            .catch(error => {
                const lblError = document.createElement("label");
                lblError.innerHTML = error;
                data.appendChild(lblError);
            });
        }
        garaza.appendChild(dugme);
    }
    export function brisiVozilo(radionica : string)
    {
        const garaza = document.getElementById(radionica);
        const data = garaza.firstChild;
        
        data.remove();
    }
    //funkcija za prikaz danasnjih radnika
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
            podatak.innerHTML = array["majstori"][i].ime;
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
            podatak.innerHTML = array["segrti"][i].ime;
            data2.appendChild(podatak);
        }
        div2.appendChild(data2);
        radnici.appendChild(div2);
        footer.appendChild(radnici);
        contain.appendChild(footer);
    }
    //Funkcija koja crta divove i naslove za garaze i ubacuje divode za danasnja vozila i za uradjena vozila
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
    //Iscrtava vozilo koje je prosledjeno iz baze za prikaz vozila koja cekaju red
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

        const hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.innerHTML = vozila.id.toString();
        voziloContainer.appendChild(hidden);

        // const podatak = document.createElement("li");
        // podatak.innerHTML = vozila.marka + " " + vozila.oznaka + " " + vozila.registracija;
        // voziloContainer.appendChild(podatak);

        const podatak = document.createElement("li");
        podatak.className = "podatak";
        podatak.innerHTML = vozila.marka + " " + vozila.oznaka;
        voziloContainer.appendChild(podatak);

        const podatak2 = document.createElement("li");
        podatak2.className = "podatak";
        podatak2.innerHTML = vozila.registracija;
        voziloContainer.appendChild(podatak2);

        const podatak3 = document.createElement("li");
        podatak3.className = "podatak";
        podatak3.innerHTML = vozila.vrstaKvara;
        voziloContainer.appendChild(podatak3);

        const dugme = document.createElement("button");
        dugme.className = "UbaciVoziloButton";
        dugme.innerHTML = "Ubaci vozilo";
        dugme.onclick = (ev) => {
            //ovde stavi za poziv funkcije za ubacivanje vozila            
            indexTs.ProslediUServis(vozila)
                .then(res => {
                    if(res === true)
                    {
                        voziloContainer.remove();
                    }
                })
                .catch(error => {
                    const lblError = document.createElement("label");
                    lblError.innerHTML = error;
                    voziloContainer.appendChild(lblError);
                });
        }
        voziloContainer.appendChild(dugme);
        ul.appendChild(voziloContainer);
    }

    //funkcija koja prikazuje vozilo koje je danas uradjena
    export function IscrtajUradjenoVozilo(vozilo:Vozilo)
    {
        const ul = document.getElementById("danasUL");
        const voziloContainer = document.createElement("div");
        voziloContainer.className = "voziloContainer";

        const podatak = document.createElement("li");
        podatak.className = "podatak";
        podatak.innerHTML = vozilo.marka + " " + vozilo.oznaka;
        voziloContainer.appendChild(podatak);

        const podatak2 = document.createElement("li");
        podatak2.className = "podatak";
        podatak2.innerHTML = vozilo.registracija;
        voziloContainer.appendChild(podatak2);

        const podatak3 = document.createElement("li");
        podatak3.className = "podatak";
        podatak3.innerHTML = vozilo.vrstaKvara;
        voziloContainer.appendChild(podatak3);
        ul.appendChild(voziloContainer);
    }
    
