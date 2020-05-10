import { Majstor } from "./models/majstor";
import { vratiMajstore} from "./models/majstori.service";
import { Segrt } from "./models/segrt";
import { vratiSegrte } from "./models/segrti.service";
import { Vozilo } from "./models/vozilo";
import { debounceTime, delay } from "rxjs/operators";
import { vratiRadionice } from "./models/radionica.service";
import { Radionica } from "./models/radionica";
import { interval } from "rxjs";
const source = interval(100);
    var Majstori: Majstor[] = [];
    /*vratiMajstore().then(Majstori => {
        console.log("Ucitani majstori", Majstori);
    });*/
    vratiMajstore().then(data => {
        data.forEach((m: any) => {
            var maj = new Majstor(m["id"],m["ime"],m["poznaje"]);
            Majstori.push(maj);
        })
    });
    var Segrti: Segrt[] = [];
    /*vratiSegrte().then(Segrti => {
        console.log("Ucitani segrti", Segrti);
    });*/
    vratiSegrte().then(data => {
        data.forEach((s: any) => {
            var seg = new Segrt(s["id"],s["ime"]);
            Segrti.push(seg);
        })
    });
    let VozilaNaCekanju: Vozilo[] = null;
    var SveRadionice:Radionica[] = [];
    vratiRadionice().then(data => {
        data.forEach((v: any) => {
            var voz = new Radionica(v["vrsta"]);
            SveRadionice.push(voz);
        })
    });

    export async function Glavna(v: Vozilo) //glavna funkcija koja pokrece sve
    {
        let rnd:number = Math.floor(Math.random()*5000)+5000;
        let x:number = 0;
        source.subscribe(() => {
            if(x < rnd) x+=100; 
        });
            
        console.log(VozilaNaCekanju);
        var vozilo = new Vozilo(v["id"],v["marka"],v["oznaka"],v["registracija"],v["vrstaKvara"],v["opisProblema"]);
        console.log(vozilo);
        var slobodniSegrti:Segrt[] = NadjiSlobodnogSegrta();
        if(slobodniSegrti == null)
        {
            VozilaNaCekanju.push(vozilo);
        }
        else
        {
            if(DolazakVozila(vozilo))
            {
                await SegrtUbacujeVozilo(slobodniSegrti[0], vozilo);

                var slobodniMajtsori:Majstor[] = NadjiSlobodnogMajstora();
                if(slobodniMajtsori!=null)
                {
                    console.log("Majstor" + slobodniMajtsori[0]);
                    await PosaljiMajstoraDaRadi(slobodniMajtsori[0],vozilo);
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
        if(VozilaNaCekanju != null)
        {
            VozilaNaCekanju.forEach((element: Vozilo) => { //proverava da li ima neko vozilo koje ceka za istu radionicu
                if(vozilo.vrstaKvara == element.vrstaKvara) j++;
            });
            j = VozilaNaCekanju.filter((voz:Vozilo) => voz.vrstaKvara == vozilo.vrstaKvara).map((v:Vozilo) => 1).reduce((acc,val)=> acc+val);//broj ponavljanja istih vrsta kvarova
        }        
        return new Promise((resolve,reject) =>{
            if(j==0 && !ProveriZauzeto(vozilo.vrstaKvara))
                return resolve(true);
            else
                return reject(false);
        });
    }

    function OdlazakVozila(vozilo: Vozilo)
    {
       console.log("Vozilo je otislo", vozilo);
       //pusti za sledece vozilo
       pustiSaRedaCekanja();        
    }

    async function SegrtUbacujeVozilo(segrt: Segrt, vozilo: Vozilo)
    {
        segrt.zauzet = true;
        SveRadionice.forEach(rad => {
            if(rad.vrsta == vozilo.vrstaKvara)
            {
                rad.Zauzeto = true;       

                let rnd:number = Math.floor(Math.random()*5000)+5000;
                let x:number = 0;
                source.subscribe(() => {
                    if(x < rnd) x+=100; 
                });

                rad.Vozilo = vozilo;
                segrt.zauzet = false;
                crtajVozilo(vozilo);
                return "vozilo ubaceno u garazu za "+ rad.vrsta;
            }
        });        
    }

    async function SegrtIzbacujeVozilo(segrt: any, vozilo: any) 
    {
        segrt.Zauzet = true;
        SveRadionice.forEach(rad => {
            if(rad.vrsta == vozilo.VrstaKvara)
            {
                //debounceTime(Math.floor(Math.random()*3000)+2000);//random br izmedju 2000 i 5000
                //delay(Math.floor(Math.random()*3000)+2000);
                let rnd:number = Math.floor(Math.random()*5000)+5000;
                let x:number = 0;
                source.subscribe(() => {
                if(x < rnd) x+=100; 
                });
                brisiVozilo(rad.vrsta);
                rad.Zauzeto = false;
                rad.Vozilo = null;
                segrt.Zauzet = false;
                return "vozilo je izbaceno iz garaze za " + rad.vrsta;
            }
        });
    }

    async function MajstorRadiNaVozilu(majstor: any)
    {
        //prikazi nekako da radi
        console.log("majstor poceo sa radom");
        //debounceTime(Math.floor(Math.random()*3000)+2000);//random br izmedju 2000 i 5000
        //delay(Math.floor(Math.random()*3000)+2000);
        let rnd:number = Math.floor(Math.random()*5000)+5000;
        let x:number = 0;
        source.subscribe(() => {
            if(x < rnd) x+=100; 
        });
        console.log("majstor je zavrsio sa radom");
    }

    async function PosaljiMajstoraDaRadi(majstor: Majstor, vozilo: Vozilo)
    {
        console.log("u funkciji:",majstor);
        majstor.zauzet = true;
        majstor.radiNa = vozilo;
        SveRadionice.forEach(rad => {
            if(rad.vrsta == vozilo.vrstaKvara)
            {
                //rad.Vozilo = vozilo;
                rad.Majstor = majstor;
            }
        });
        await MajstorRadiNaVozilu(majstor)
        majstor.radiNa = null;
        majstor.zauzet = false;
        return "Majstor zavrsio sa radom";
    }

    function ProveriZauzeto(VrstaKvara: string)
    {
        SveRadionice.forEach(rad => {
            if(rad.vrsta == VrstaKvara)
            {
                return rad.Zauzeto;
            }
        });
        return false;//morao sam da stavim da ne gleda funkciju kao void, ne znam zasto
    }
    
    function NadjiSlobodnogSegrta()
    {
        console.log("slobodniSegrti: ", Segrti.filter((segrti: Segrt) => segrti.zauzet == false));
        return Segrti.filter((segrti: Segrt) => segrti.zauzet == false);
    }

    function NadjiSlobodnogMajstora()
    {
        console.log("slobodniMajstori: ", Majstori.filter((m: Majstor) => m.zauzet == false));
        return Majstori.filter((m: Majstor) => m.zauzet == false);
    }

    async function pustiSaRedaCekanja()
    {
        let slobodne:string[] = SveRadionice.filter((r:Radionica) => r.Zauzeto == false)
        .map((rad:Radionica) => rad.vrsta);
        if(slobodne != null && VozilaNaCekanju != null)
        {
            slobodne.forEach((s:string) => {
                let voz = VozilaNaCekanju.filter((v:Vozilo) => v.vrstaKvara == s)[0];
                VozilaNaCekanju = VozilaNaCekanju.filter((v:Vozilo) => v.registracija != voz.registracija);
                Glavna(voz);
            })
        }
    }

    //crtajVozilo(vozilo:Vozilo)
    function crtajVozilo(vozilo:Vozilo)
    {
        const garaza = document.getElementById(vozilo.vrstaKvara);
        const data = document.createElement("ul");
        const podatak = document.createElement("li");
        podatak.innerHTML = vozilo.marka;
        data.appendChild(podatak);
        const podatak2 = document.createElement("li");
        podatak2.innerHTML = vozilo.oznaka;
        data.appendChild(podatak2);
        const podatak3 = document.createElement("li");
        podatak3.innerHTML = vozilo.registracija;
        data.appendChild(podatak3);
        garaza.appendChild(data);
    }

    function brisiVozilo(radionica : string)
    {
        const garaza = document.getElementById(radionica);
        console.log("dete na garazu");
        console.log(garaza.children);
        console.log(Math.floor(Math.random()*3000)+2000);
        garaza.removeChild(garaza.childNodes[0]);
    }