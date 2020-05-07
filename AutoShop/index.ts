import {View} from "./src/view";
import {Glavna} from "./src/servis"
import { Observable, of } from "rxjs";
import { Vozilo } from "./src/models/vozilo";
import { vratiVozila } from "./src/models/vozila.service";
import { debounceTime , merge} from "rxjs/operators";
const view = new View(document.body);

var SvaVozila: Vozilo[] = []
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
    console.log(SvaVozila);
var vozilaObservable = Observable.create((observer: any) => {
    SvaVozila.forEach(voz => {
        console.log(voz);
        debounceTime(Math.floor(Math.random()*3000)+2000);//random br izmedju 2000 i 5000
        observer.next(voz);
    })
});

vozilaObservable.subscribe( //prepravi ga da bude bez svih vozila i koristi ovde da napravis klasu
    //(x: Vozilo) => DolazakVozila(x),
    (x: Vozilo) => Glavna(x),
    (error: any) => console.log(error)
);