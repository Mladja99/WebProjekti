import { ECU } from "./models/ecu";
import { Elektrika } from "./models/elektrika";
import { Majstor } from "./models/majstor";
import { vratiMajstore} from "./models/majstori.service";
import { Mehanika } from "./models/mehanika";
import { Segrt } from "./models/segrt";
import { vratiSegrte } from "./models/segrti.service";
import { Vozilo } from "./models/vozilo";
import { vratiVozila } from "./models/vozila.service";
import {from, Observable, concat} from "rxjs";
import { debounceTime } from "rxjs/operators";

   // const url_db = "http://localhost:3000/"
    var SvaVozila: Vozilo[] = []
    vratiVozila().then(SvaVozila => {
        console.log("Ucitano",SvaVozila);
    });
    var Majstori: Majstor[] = [];
    vratiMajstore().then(Majstori => {
        console.log("Ucitani majstori", Majstori);
    });
    var Segrti: Segrt[] = [];
    vratiSegrte().then(Segrti => {
        console.log("Ucitani segrti", Segrti);
    });
    
    let VozilaNaCekanju: any[] = null;
    let ecu = new ECU();
    let elektrika = new Elektrika();
    let mehanika = new Mehanika();

    var vozilaObservable = Observable.create((observer: any) => {
        SvaVozila.forEach(voz => {
            debounceTime(Math.floor(Math.random()*3000)+2000);//random br izmedju 2000 i 5000
            observer.next(voz); // ne znam sta ce vrati
        });
    });

    vozilaObservable.subscribe(
        (x: Vozilo) => DolazakVozila(x),
        (error: any) => console.log(error)
    );

    function DolazakVozila(vozilo:Vozilo) //mora da se uprosti da samo dodaje na red ili da se prosledi za ubacivanje
    {
        var j = 0;
        VozilaNaCekanju.forEach((element: { VrstaKvara: any; }) => { //proverava da li ima neko vozilo koje ceka za istu radionicu
            if(vozilo.VrstaKvara == element.VrstaKvara) j++;
        });
        if(j==0 && !this.ProveriZauzeto(vozilo.VrstaKvara)) //slucaj kada jedini ceka za radionicu i ona je slobodna
        {
            let Slobodni = this.NadjiSlobodnogSegrta(); //nalazi slobodnog segrta
            if(Slobodni!=null) //ako ima slobodan segrt onda on ubacije vozilo ako ne onda ide na listu cekanja
            {
                //SegrtUbacujeVozilo(Slobodni[0], vozilo);//moze take da se koristi
                SegrtUbacujeVozilo(Slobodni.take(1), vozilo);
            }
            else
            {
                VozilaNaCekanju.push(vozilo);
            }
        }
        else
        {
            VozilaNaCekanju.push(vozilo);
        }
    }

    function OdlazakVozila(vozilo: Vozilo)
    {
       this.SvaVozila = SvaVozila.filter(x => x.Registracija != vozilo.Registracija);       
    }

    async function SegrtUbacujeVozilo(segrt: Segrt, vozilo: Vozilo)
    {
        segrt.Zauzet = true;
        if(vozilo.VrstaKvara == "ecu")
        {
            this.ecu.Zauzeto = true;
            debounceTime(Math.floor(Math.random()*3000)+2000);//random br izmedju 2000 i 5000
            this.ecu.Vozilo = vozilo;
            segrt.Zauzet = false;
            return "vozilo ubaceno u garazu za ecu";
        }
        else if(vozilo.VrstaKvara == "mehanika")
        {
            this.mehanika.Zauzeto = true;
            debounceTime(Math.floor(Math.random()*3000)+2000);//random br izmedju 2000 i 5000
            this.mehanika.Vozilo = vozilo;
            segrt.Zauzet = false;
            return "vozilo ubaceno u garazu za mehaniku";
        }
        else
        {
            this.elektrika.Zauzeto = true;
            debounceTime(Math.floor(Math.random()*3000)+2000);//random br izmedju 2000 i 5000
            this.elektrika.Vozilo = vozilo;
            segrt.Zauzet = false;
            return "vozilo ubaceno u garazu za mehaniku";
        }
    }

    async function SegrtIzbacujeVozilo(segrt: any, vozilo: any) 
    {

    }

    async function MajstorRadiNaVozilu(majstor: any, vozilo: any)
    {
        //odradi pipe da se prikaze na stranici
        debounceTime(Math.floor(Math.random()*3000)+2000);//random br izmedju 2000 i 5000
    }

    async function PosaljiMajstoraDaRadi(majstor: { Zauzet: boolean; RadiNa: any; }, vozilo: { VrstaKvara: string; })
    {
        majstor.Zauzet = true;
        majstor.RadiNa = vozilo;
        if(vozilo.VrstaKvara == "ecu")
        {
            ecu.Vozilo = vozilo;
            ecu.Majstor = majstor;
        }
        else if(vozilo.VrstaKvara == "mehanika")
        {
            mehanika.Vozilo = vozilo;
            mehanika.Majstor = majstor;
        }
        else
        {
            elektrika.Vozilo = vozilo;
            elektrika.Majstor = majstor;
        }
        await MajstorRadiNaVozilu(majstor, vozilo)
        majstor.RadiNa = null;
        majstor.Zauzet = false;
        return "Majstor zavrsio sa radom";
    }

    function ProveriZauzeto(VrstaKvara: string)
    {
        if(VrstaKvara == "ecu") return ecu.Zauzeto;
        else if(VrstaKvara == "elektrika") return elektrika.Zauzeto;
        else return mehanika.Zauzeto;
    }
    
    function NadjiSlobodnogSegrta()
    {
        console.log("slobodni: ", Segrti.map((segrti: Segrt) => segrti.Zauzet == false));
        return Segrti.map((segrti: Segrt) => segrti.Zauzet == false);
    }