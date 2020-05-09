import {View} from "./src/view";
import {Glavna} from "./src/servis"
import { Observable, of } from "rxjs";
import { Vozilo } from "./src/models/vozilo";
import { vratiVozila } from "./src/models/vozila.service";
import { debounceTime , merge, switchMap} from "rxjs/operators";
const view = new View(document.body);

/*var SvaVozila: Vozilo[] = []
    vratiVozila().then(SvaVozila => {
        console.log("Ucitano",SvaVozila);
    });
    console.log(SvaVozila);

    vratiVozila().then(data => {
        data.forEach((v: any) => {
            var voz = new Vozilo(v["Marka"],v["Oznaka"],v["Registracija"],v["VrstaKvara"],v["OpisProblema"]);
            SvaVozila.push(voz);
        })
    });
    console.log(SvaVozila);*/
var vozilaObservable = Observable.create((observer: any) => {//probaj da namuvas switchMap()
    vratiVozila().then((e:any) => e.forEach((voz:Vozilo) => {
        setInterval(()=>{
            console.log(voz);
            var v = new Vozilo(voz["Marka"],voz["Oznaka"],voz["Registracija"],voz["VrstaKvara"],voz["OpisProblema"]);
            //debounceTime(Math.floor(Math.random()*3000)+2000);//random br izmedju 2000 i 5000
            observer.next(voz);
        },Math.floor(Math.random()*3000)+2000);
    }))
});

vozilaObservable.subscribe( //prepravi ga da bude bez svih vozila i koristi ovde da napravis klasu
    //(x: Vozilo) => DolazakVozila(x),
    (x: Vozilo) => Glavna(x),
    (error: any) => console.log(error)
);