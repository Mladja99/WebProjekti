import { Majstor } from "./models/majstor";
import { vratiMajstore} from "./models/majstori.service";
import { Segrt } from "./models/segrt";
import { vratiSegrte } from "./models/segrti.service";
import { Vozilo } from "./models/vozilo";
import { debounceTime, switchMap, take } from "rxjs/operators";
import { vratiRadionice } from "./models/radionica.service";
import { Radionica } from "./models/radionica";

    var Majstori: Majstor[] = [];
    /*vratiMajstore().then(Majstori => {
        console.log("Ucitani majstori", Majstori);
    });*/
    vratiMajstore().then(data => {
        data.forEach((m: any) => {
            var maj = new Majstor(m["Id"],m["Ime"],m["Poznaje"]);
            Majstori.push(maj);
        })
    });
    var Segrti: Segrt[] = [];
    /*vratiSegrte().then(Segrti => {
        console.log("Ucitani segrti", Segrti);
    });*/
    vratiSegrte().then(data => {
        data.forEach((s: any) => {
            var seg = new Segrt(s["Id"],s["Ime"]);
            Segrti.push(seg);
        })
    });
    let VozilaNaCekanju: any[] = null;
    var SveRadionice:Radionica[] = [];
    vratiRadionice().then(data => {
        data.forEach((v: any) => {
            var voz = new Radionica(v["Vrsta"]);
            SveRadionice.push(voz);
        })
    });
    //console.log(SvaVozila);

    /*var vozilaObservable = Observable.create((observer: any) => {
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
    );*/

    export async function Glavna(vozilo: Vozilo) //glavna funkcija koja pokrece sve
    {
        var slobodniSegrti:Segrt[] = NadjiSlobodnogSegrta();
        if(slobodniSegrti == null) VozilaNaCekanju.push(vozilo);
        else
        {
            if(DolazakVozila(vozilo))
            {
                console.log("Segrt ubacuje vozilo");
                console.log(await SegrtUbacujeVozilo(slobodniSegrti[0], vozilo));
                console.log("Segrt ubacio");

                var slobodniMajtsori:Majstor[] = NadjiSlobodnogMajstora();
                if(slobodniMajtsori!=null)
                {
                    console.log(await PosaljiMajstoraDaRadi(slobodniMajtsori[0],vozilo));
                }
                await SegrtIzbacujeVozilo(slobodniSegrti[0], vozilo);
                OdlazakVozila(vozilo);
            }
            else VozilaNaCekanju.push(vozilo);            
        }
    }

    async function DolazakVozila(vozilo:Vozilo) //mora da se uprosti da samo dodaje na red ili da se prosledi za ubacivanje
    {
        var j:number = 0;
        VozilaNaCekanju.forEach((element: Vozilo) => { //proverava da li ima neko vozilo koje ceka za istu radionicu
            if(vozilo.VrstaKvara == element.VrstaKvara) j++;
        });
        j = VozilaNaCekanju.filter((voz:Vozilo) => voz.VrstaKvara == vozilo.VrstaKvara).map((v:Vozilo) => 1).reduce((acc,val)=> acc+val);//broj ponavljanja istih vrsta kvarova
        return new Promise((resolve,reject) =>{
            if(j==0 && !ProveriZauzeto(vozilo.VrstaKvara))
                return resolve(true);
            else
                return reject(false);
        });
    }

    function OdlazakVozila(vozilo: Vozilo)
    {
       console.log("Vozilo je otislo");
       //pusti za sledece vozilo       
    }

    async function SegrtUbacujeVozilo(segrt: Segrt, vozilo: Vozilo)
    {
        segrt.Zauzet = true;
        SveRadionice.forEach(rad => {
            if(rad.Vrsta == vozilo.VrstaKvara)
            {
                rad.Zauzeto = true;
                debounceTime(Math.floor(Math.random()*3000)+2000);//random br izmedju 2000 i 5000
                rad.Vozilo = vozilo;
                segrt.Zauzet = false;
                return "vozilo ubaceno u garazu za "+ rad.Vrsta;
            }
        });
        
    }

    async function SegrtIzbacujeVozilo(segrt: any, vozilo: any) 
    {
        segrt.Zauzet = true;
        SveRadionice.forEach(rad => {
            if(rad.Vrsta == vozilo.VrstaKvara)
            {
                debounceTime(Math.floor(Math.random()*3000)+2000);//random br izmedju 2000 i 5000
                rad.Zauzeto = false;
                rad.Vozilo = null;
                segrt.Zauzet = false;
                return "vozilo je izbaceno iz garaze za " + rad.Vrsta;
            }
        });
    }

    async function MajstorRadiNaVozilu(majstor: any)
    {
        //odradi pipe da se prikaze na stranici
        console.log("majstor poceo sa radom");
        debounceTime(Math.floor(Math.random()*3000)+2000);//random br izmedju 2000 i 5000
        console.log("majstor je zavrsio sa radom");
    }

    async function PosaljiMajstoraDaRadi(majstor: Majstor, vozilo: Vozilo)
    {
        majstor.Zauzet = true;
        majstor.RadiNa = vozilo;
        SveRadionice.forEach(rad => {
            if(rad.Vrsta == vozilo.VrstaKvara)
            {
                //rad.Vozilo = vozilo;
                rad.Majstor = majstor;
            }
        });
        await MajstorRadiNaVozilu(majstor)
        majstor.RadiNa = null;
        majstor.Zauzet = false;
        return "Majstor zavrsio sa radom";
    }

    function ProveriZauzeto(VrstaKvara: string)
    {
        SveRadionice.forEach(rad => {
            if(rad.Vrsta == VrstaKvara)
            {
                return rad.Zauzeto;
            }
        });
        return true;//morao sam da stavim da ne gleda funkciju kao void, ne znam zasto
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