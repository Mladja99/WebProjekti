import { View , iscrtajDanasnjeRadnike, iscrtajDanasnjaVozila, NapraviMesto} from "./src/view";
import { DolazakVozila } from "./src/servis"
import { vratiVozila, getVoziloByReg } from "./src/models/vozila.service";
import { from, interval, timer , merge , zip} from "rxjs";
import { switchMap, takeUntil, take } from "rxjs/operators";
import { vratiMajstore } from "./src/models/majstori.service";
import { vratiSegrte } from "./src/models/segrti.service";
const css = require('./style.css');
const view = new View(document.body);

const source = interval(Math.floor(Math.random()*2000)+2500);
var SvaVozila = vratiVozila().then(e => e.map((x:any) => x["registracija"]));
var SviMajstori = vratiMajstore().then(e => e.map((x:any) => x.ime));
var SviSegrti = vratiSegrte().then(e => e.map((x:any) => x.ime));
var vozilaObservable = from(SvaVozila);

vozilaObservable.pipe(
    switchMap(reg => getVoziloByReg(reg)),
).subscribe(v => ProslediUServis(v).then((res:any)=>{
    NapraviMesto();
    merge(res,v).subscribe(x=>iscrtajDanasnjaVozila(x));
}));

var timer$ = timer(30000);
async function ProslediUServis(vozila : any)
{   
    return new Promise((resolve,reject)=>{
        var VozilaZaDanas:any[] = [];
        const pauza = source.pipe(takeUntil(timer$));
        pauza.subscribe((x:any) => {
                DolazakVozila(vozila[x]);
                VozilaZaDanas.push(vozila[x]);
            });
        setTimeout(()=>{
            resolve(VozilaZaDanas);
        },30000);
    })
}

var radnici = zip(from(SviMajstori),from(SviSegrti),(majstori,segrti)=>({majstori,segrti}));
radnici.subscribe(x=>iscrtajDanasnjeRadnike(x));
