import { View } from "./src/view";
import { DolazakVozila } from "./src/servis"
import { Vozilo } from "./src/models/vozilo";
import { vratiVozila, getVoziloByReg } from "./src/models/vozila.service";
import { merge , asyncScheduler, from, interval, timer } from "rxjs";
import { switchMap, debounceTime, zip, delay, takeUntil, take } from "rxjs/operators";
const css = require('./style.css');
const view = new View(document.body);

const source = interval(Math.floor(Math.random()*6000)+2000);
var SvaVozila = merge(vratiVozila().then((e:any)=> e.map((x:any) => x["registracija"])));
var vozilaObservable = from(SvaVozila);


/*vozilaObservable.subscribe(
    (x: any) => {
        var int = interval(Math.floor(Math.random()*5000)+5000);
        let i =0;
        var voz:any;
        int.subscribe(()=>{
            var v:string = x[i];
            voz = switchMap( (v:string)  => {
                    return vratiVoziloByReg(v)
            });
            console.log(voz);
        });
        console.log("drugi put",voz);
    },
    //(x: Vozilo) => Glavna(x),
    (error: any) => console.log(error)
);*/

vozilaObservable.pipe(
    switchMap(reg => getVoziloByReg(reg)),
).subscribe(v => ProslediUServis(v));

async function ProslediUServis(vozila : any)
{   

    
    let i = 0;
    //var timer$ = timer(Math.floor(Math.random()*5000)+5000);
    const pauza = source.pipe(take(vozila["length"]));
    pauza.subscribe((x:any) => {
            DolazakVozila(vozila[x]);
        });//ovo nekim cudom radi samo da napravim da nije konstantan broj

}

//ubaci nesto preko input da iskoristis take takeUntil(do nekog klika 
//ili napravi limit da radi posle toga da prekine 
//i da zipuje podatke nakon toga i da ih prikaze) i zip