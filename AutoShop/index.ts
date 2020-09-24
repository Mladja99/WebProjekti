import { View , iscrtajDanasnjeRadnike, iscrtajDanasnjaVozila, NapraviMesto, prikaziTrajanjeRadnogVremena, PrikaziDanasUradjenaVozila, NapraviZaPrikazUradjenihBozila, PrikaziProfitNaFormi } from "./src/view";
import { DolazakVozila } from "./src/servis"
import { vratiVozila, getVoziloByReg, vratiZavrsenaVozila } from "./src/models/vozila.service";
import { from, interval, timer , merge , zip, fromEvent, of} from "rxjs";
import { switchMap, takeUntil, take, tap, takeLast, map, reduce, filter, count } from "rxjs/operators";
import { vratiMajstore } from "./src/models/majstori.service";
import { vratiSegrte, vratiSlobodnogSegrta } from "./src/models/segrti.service";
import { Vozilo } from "./src/models/vozilo";
const css = require('./style.css');
const view = new View(document.body);

//const source = interval(Math.floor(Math.random()*2000)+2500);
//var SvaVozila = vratiVozila().then(e => e.map((x:any) => x["registracija"]));
//var SviMajstori = vratiMajstore().then(e => e.map((x:any) => x.ime));
//var SviSegrti = vratiSegrte().then(e => e.map((x:any) => x.ime));
//var vozilaObservable = from(SvaVozila);

// vozilaObservable.pipe(
//     switchMap(reg => getVoziloByReg(reg)),
// ).subscribe(v => ProslediUServis(v).then((res:any)=>{
//     NapraviMesto();
//     merge(res,v).subscribe(x=>iscrtajDanasnjaVozila(x));
// }));

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
merge(vratiMajstore(),vratiSegrte()).subscribe(x=>{
    console.log(x);
    iscrtajDanasnjeRadnike(x);
});

//var timer$ = timer(30000);
export async function ProslediUServis(vozilo : Vozilo):Promise<boolean>
{   
    // return new Promise((resolve,reject)=>{
    //     var VozilaZaDanas:any[] = [];
    //     const pauza = source.pipe(takeUntil(timer$));
    //     pauza.subscribe((x:any) => {
    //             DolazakVozila(vozila[x]);
    //             VozilaZaDanas.push(vozila[x]);
    //         });
    //     setTimeout(()=>{
    //         resolve(VozilaZaDanas);
    //     },30000);
    // })
    return DolazakVozila(vozilo);
}


export function RadnoVreme():void
{
    const dugme = document.getElementById("zatvori");
    const dugmeklik$ = fromEvent(dugme, 'click');
    console.log(dugme);
    // const example = source.pipe(takeUntil(dugmeklik$));
    // const subscribe = example.subscribe(val => console.log(val));
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
        console.log(data);
        from(data).pipe(
            map(x => x.profit),
            reduce((acc,val)=> acc = acc + +val)
        ).subscribe(x => PrikaziProfitNaFormi(x));
    })
}