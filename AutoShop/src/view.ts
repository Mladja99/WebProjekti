import { vratiRadionice } from "./models/radionica.service";
import { Radionica } from "./models/radionica";
import { Vozilo } from "./models/vozilo";
import * as indexTs from "./../index";
import * as servisTs from "./servis";
import { vratiMajtoraPoID } from "./models/majstori.service"
import { Majstor } from "./models/majstor";
import { Segrt } from "./models/segrt";
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

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "main2";
        buttonContainer.id = "buttonContainer";
        this.container.appendChild(buttonContainer);

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

        CrtajDugmeZaPocetakRadnogVremena();
        crtajFooter();
    }
    //funkcija koja crta div za garazu postavlja header i sve za prikaz te jedne radionice
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
//funkcija koja se koristi za prikaz vozila
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
//funkcija koja brise neuredjenu listu sa podacima vozila iz radionice 
export function brisiVozilo(radionica : string)
{
    const garaza = document.getElementById(radionica);
    const data = garaza.firstChild;
    
    data.remove();
}
//funkcija za iscrtavanje futera i postavljanje neuredjene liste koja je inicijalno prazna (za dodavanja imena radnika)
export function crtajFooter()
{
    const contain = document.getElementById("container");
    const footer = document.createElement("div");
    footer.className = "footer";

    const labela = document.createElement("label");
    labela.innerHTML = "Danasnji radnici:";

    const radnici = document.createElement("div");
    radnici.className = "radniciDiv";

    const data = document.createElement("ul");
    data.className ="listaChild";
    data.id = "footerUL";

    radnici.appendChild(data);
    footer.appendChild(labela);
    footer.appendChild(radnici);
    contain.appendChild(footer);
}

//Popunjava vec napravljenu lancanu listu imenima radnika iz baze
export function iscrtajDanasnjeRadnike(array: Majstor[] | Segrt[])
{
    
    
    const data = document.getElementById("footerUL");
    
    for(let i=0;i<array.length;i++)
    {
        const podatak = document.createElement("li");
        podatak.innerHTML = array[i].ime;
        data.appendChild(podatak);
    }
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
//Iscrtava vozilo koje je prosledjeno iz baze za prikaz vozila koja cekaju red, 
//postavljanje eventa na klik za dugme gde se vozilo prosldjuje u servis
export function iscrtajDanasnjaVozila(vozila : Vozilo)
{
    const ul = document.getElementById("sveUL");
    const voziloContainer = document.createElement("div");
    voziloContainer.className = "voziloContainer";

    const hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.innerHTML = vozila.id.toString();
    voziloContainer.appendChild(hidden);

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
//iscrtava dugme za pokretanje radnog vremena
export function CrtajDugmeZaPocetakRadnogVremena()
{
    const container = document.getElementById("buttonContainer");
    const dugme = document.createElement("button");
    dugme.className = "ZapocniRadnoVreme";
    dugme.innerHTML = "Otvori servis";
    dugme.onclick = (ev) => {
        container.firstChild.remove()
        CrtajDugmeZaKrajRadnogVremena();
        indexTs.RadnoVreme();
    }
    container.appendChild(dugme);
}
//iscrtava dugme za kraj radnog vremena
export function CrtajDugmeZaKrajRadnogVremena():void
{
    const container = document.getElementById("buttonContainer");
    const dugme = document.createElement("button");
    dugme.className = "ZapocniRadnoVreme";
    dugme.id = "zatvori";
    dugme.innerHTML = "Zatvori servis";
    dugme.onclick = (ev) => {
        container.firstChild.remove();
    }
    container.appendChild(dugme);
}
//prikazuje koliko je trajalo radno vreme tog dana
export function prikaziTrajanjeRadnogVremena(value:number):void
{
    const container = document.getElementById("buttonContainer");
    console.log(value);

    const podnaslov = document.createElement("h4");
    if(value % 10 === 1)
        podnaslov.innerHTML = "Danas je radjeno " + value + " sat";
    else if(value % 10 > 1 && value % 10 < 5)
        podnaslov.innerHTML = "Danas je radjeno " + value + " sata";
    else if(value % 10 > 5 || value % 10 === 0)
        podnaslov.innerHTML = "Danas je radjeno " + value + " sati";
    container.appendChild(podnaslov);
}
//crta listu nakon zavrsetka radnog vremena koja 
export function NapraviZaPrikazUradjenihBozila()
{
    const container = document.getElementById("buttonContainer");
    const lista = document.createElement("ul");
    lista.id = "danasUradjenoPrikaz";
    container.appendChild(lista);
}
//prikazuje koje vozilo je uradjeno i njegove registarske oznake
export function PrikaziDanasUradjenaVozila(vozilo:string[])
{
    const lista = document.getElementById("danasUradjenoPrikaz");
    const item = document.createElement("li");
    item.innerHTML = "Vozilo: " + vozilo[0] + " Registracia: " + vozilo[1];
    lista.appendChild(item);
}

export function PrikaziProfitNaFormi(profit:number):void
{
    const container = document.getElementById("buttonContainer");
    const lblProfit = document.createElement("label");
    lblProfit.innerHTML = "Danasnji profit je: " + profit;

    container.appendChild(lblProfit);
}