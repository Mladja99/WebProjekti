import { View } from "./src/view";
import { Glavna } from "./src/servis"
import { Vozilo } from "./src/models/vozilo";
import { vratiVozila, getVoziloByReg } from "./src/models/vozila.service";
import { merge , asyncScheduler, from, interval } from "rxjs";
import { switchMap, debounceTime, zip, delay } from "rxjs/operators";

const view = new View(document.body);

 var timeout = Math.floor(Math.random()*5000)+5000;
const source = interval(100);

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
    for await(const vozilo of vozila)
    {
        debounceTime(5000);
        await Glavna(vozilo);
    }
    /*let i = 1;
    vozila.forEach((vozilo:Vozilo) => {
        setTimeout(() => Glavna(vozilo),2000*i);
        i++;
    });*/

}

/*SvaVozila.pipe(
    switchMap(reg => getVoziloByReg(reg)),
).subscribe(v => console.log(v));*/

//ubaci nesto preko input da iskoristis take takeUntil(do nekog klika 
//ili napravi limit da radi posle toga da prekine 
//i da zipuje podatke nakon toga i da ih prikaze) i zip