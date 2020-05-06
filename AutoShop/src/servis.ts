import { ECU } from "./models/ecu";
import { Elektrika } from "./models/elektrika";
import { Majstor } from "./models/majstor";
import { vratiMajstore} from "./models/majstori.service";
import { Mehanika } from "./models/mehanika";
import { Segrt } from "./models/segrt";
import { vratiSegrte } from "./models/segrti.service";
import { Vozilo } from "./models/vozilo";
import { vratiVozila } from "./models/vozila.service";
import { Observable } from "rxjs";
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
            console.log(voz);
            debounceTime(Math.floor(Math.random()*3000)+2000);//random br izmedju 2000 i 5000
            observer.next(voz); // ne znam sta ce vrati
            //observer.next(voz as Vozilo);
        });
    });

    vozilaObservable.subscribe(
        //(x: Vozilo) => DolazakVozila(x),
        (x: Vozilo) => Glavna(x),
        (error: any) => console.log(error)
    );

    async function Glavna(vozilo: Vozilo)
    {
        var slobodanSegrt:Segrt;
        slobodanSegrt = await DolazakVozila(vozilo);
        if(slobodanSegrt != null) 
        {
            console.log("Segrt ubacuje vozilo");
            console.log(await SegrtUbacujeVozilo(slobodanSegrt, vozilo));
            console.log("Segrt ubacio");
        }
        var slobodniMajtsori:Majstor[] = NadjiSlobodnogMajstora();
        if(slobodniMajtsori!=null)
        {
            console.log(await PosaljiMajstoraDaRadi(slobodniMajtsori[0],vozilo));
        }
        var slobodniSegrti = NadjiSlobodnogSegrta()
        await SegrtIzbacujeVozilo(slobodniSegrti[0], vozilo);
        OdlazakVozila(vozilo);
    }

    async function DolazakVozila(vozilo:Vozilo) //mora da se uprosti da samo dodaje na red ili da se prosledi za ubacivanje
    {
        var j = 0;
        VozilaNaCekanju.forEach((element: { VrstaKvara: any; }) => { //proverava da li ima neko vozilo koje ceka za istu radionicu
            if(vozilo.VrstaKvara == element.VrstaKvara) j++;
        });
        if(j==0 && !ProveriZauzeto(vozilo.VrstaKvara)) //slucaj kada jedini ceka za radionicu i ona je slobodna
        {
            let Slobodni = NadjiSlobodnogSegrta(); //nalazi slobodnog segrta
            if(Slobodni!=null) //ako ima slobodan segrt onda on ubacije vozilo ako ne onda ide na listu cekanja
            {
                //SegrtUbacujeVozilo(Slobodni[0], vozilo);//moze take da se koristi
                //SegrtUbacujeVozilo(Slobodni.take(1), vozilo);
                return Slobodni[0];
            }
            else
            {
                VozilaNaCekanju.push(vozilo);
                return null;
            }
        }
        else
        {
            VozilaNaCekanju.push(vozilo);
            return null;
        }
    }

    function OdlazakVozila(vozilo: Vozilo)
    {
       SvaVozila = SvaVozila.filter(x => x.Registracija != vozilo.Registracija);       
    }

    async function SegrtUbacujeVozilo(segrt: Segrt, vozilo: Vozilo)
    {
        segrt.Zauzet = true;
        if(vozilo.VrstaKvara == "ecu")
        {
            ecu.Zauzeto = true;
            debounceTime(Math.floor(Math.random()*3000)+2000);//random br izmedju 2000 i 5000
            ecu.Vozilo = vozilo;
            segrt.Zauzet = false;
            return "vozilo ubaceno u garazu za ecu";
        }
        else if(vozilo.VrstaKvara == "mehanika")
        {
            mehanika.Zauzeto = true;
            debounceTime(Math.floor(Math.random()*3000)+2000);//random br izmedju 2000 i 5000
            mehanika.Vozilo = vozilo;
            segrt.Zauzet = false;
            return "vozilo ubaceno u garazu za mehaniku";
        }
        else
        {
            elektrika.Zauzeto = true;
            debounceTime(Math.floor(Math.random()*3000)+2000);//random br izmedju 2000 i 5000
            elektrika.Vozilo = vozilo;
            segrt.Zauzet = false;
            return "vozilo ubaceno u garazu za mehaniku";
        }
    }

    async function SegrtIzbacujeVozilo(segrt: any, vozilo: any) 
    {
        segrt.Zauzet = true;
        if(vozilo.VrstaKvara == "ecu")
        {
            debounceTime(Math.floor(Math.random()*3000)+2000);//random br izmedju 2000 i 5000
            ecu.Zauzeto = false;
            ecu.Vozilo = null;
            segrt.Zauzet = false;
            return "vozilo izbaceno iz garaze za ecu";
        }
        else if(vozilo.VrstaKvara == "mehanika")
        {
            debounceTime(Math.floor(Math.random()*3000)+2000);//random br izmedju 2000 i 5000
            mehanika.Zauzeto = false;
            mehanika.Vozilo = null;
            segrt.Zauzet = false;
            return "vozilo izbaceno iz garaze za mehaniku";
        }
        else
        {
            debounceTime(Math.floor(Math.random()*3000)+2000);//random br izmedju 2000 i 5000
            elektrika.Zauzeto = false;
            elektrika.Vozilo = null;
            segrt.Zauzet = false;
            return "vozilo ubaceno u garazu za mehaniku";
        }
    }

    async function MajstorRadiNaVozilu(majstor: any, vozilo: any)
    {
        //odradi pipe da se prikaze na stranici
        debounceTime(Math.floor(Math.random()*3000)+2000);//random br izmedju 2000 i 5000
    }

    async function PosaljiMajstoraDaRadi(majstor: Majstor, vozilo: Vozilo)
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
        console.log("slobodniSegrti: ", Segrti.filter((segrti: Segrt) => segrti.Zauzet == false));
        return Segrti.filter((segrti: Segrt) => segrti.Zauzet == false);
    }

    function NadjiSlobodnogMajstora()
    {
        console.log("slobodniMajstori: ", Segrti.filter((m: Majstor) => m.Zauzet == false));
        return Majstori.filter((m: Majstor) => m.Zauzet == false);
    }