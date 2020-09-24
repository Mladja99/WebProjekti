import { View , iscrtajDanasnjeRadnike, iscrtajDanasnjaVozila, NapraviMesto, prikaziTrajanjeRadnogVremena, PrikaziDanasUradjenaVozila, NapraviZaPrikazUradjenihBozila, PrikaziProfitNaFormi } from "./src/view";
import { DolazakVozila } from "./src/servis"
import { vratiVozila, vratiZavrsenaVozila } from "./src/models/vozila.service";
import { from, interval , merge , zip, fromEvent} from "rxjs";
import {  takeUntil, takeLast, map, reduce } from "rxjs/operators";
import { vratiMajstore } from "./src/models/majstori.service";
import { vratiSegrte } from "./src/models/segrti.service";
import { Vozilo } from "./src/models/vozilo";
const css = require('./style.css');
const view = new View(document.body);

//crta inicjalnu stranu i poziva funkciju za iscrtavanje vozila iz baze koja su spremna za ubacivanje u servis
export function ucitaj():void
{
    vratiVozila().subscribe(data => {
        NapraviMesto();
        data = data.filter((vozilo:Vozilo) => vozilo.status === "");
        data.forEach((element:Vozilo) => {
            iscrtajDanasnjaVozila(element);
        });
    });
}

ucitaj();
//preuzima iz baze majstore i segrte i spaja ih u jedan stream i prikazuje zatim u footeru
merge(vratiMajstore(),vratiSegrte()).subscribe(x=>{
    iscrtajDanasnjeRadnike(x);
});

export async function ProslediUServis(vozilo : Vozilo):Promise<boolean>
{  
    try
    {
        return DolazakVozila(vozilo);
    }
    catch(err)
    {
        console.log(err);
    }
}

//broji u intervalima od po 5 sekundi i kada se desi event klika na dugme za zavrsetak radnog vremena prikazuje vreme
export function RadnoVreme():void
{
    const dugme = document.getElementById("zatvori");
    const dugmeklik$ = fromEvent(dugme, 'click');
    interval(5000).pipe(
        takeUntil(dugmeklik$),
        takeLast(1),
        map(x=> {
            prikaziTrajanjeRadnogVremena(x);
            IzvuciVozilaKojaSuUradjena();
        })
    ).subscribe();
}
//Vadi iz forme na strani vozila koja su prikazana i vadi podatke i broj tablica za prikaz
export function IzvuciVozilaKojaSuUradjena():void
{
    NapraviZaPrikazUradjenihBozila();
    PrikaziProfit();
    const container = document.getElementById("danasUL");
    if(container.children !== null)
    {
        zip(
            from(container.children).pipe( 
                map( element => element.getElementsByTagName('li')[0].innerHTML)
            ),
            from(container.children).pipe(
                map( element => element.getElementsByTagName('li')[1].innerHTML)
            )
        ).subscribe(x => PrikaziDanasUradjenaVozila(x));
    }

}
//uzima vozila iz baze koja su sa statusom "izbacuje se"(zavrsena) i prepravlja samo na profit da bi se prikazao dnevni profit
export function PrikaziProfit():void
{
    vratiZavrsenaVozila().subscribe( (data:Vozilo[]) => {
        from(data).pipe(
            map(x => x.profit),
            reduce((acc,val)=> acc = acc + +val)
        ).subscribe(x => PrikaziProfitNaFormi(x));
    })
}