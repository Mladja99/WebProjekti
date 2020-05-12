import { Majstor } from "./models/majstor";
import { vratiMajstore} from "./models/majstori.service";
import { Segrt } from "./models/segrt";
import { vratiSegrte } from "./models/segrti.service";
import { Vozilo } from "./models/vozilo";
import { debounceTime, delay, takeUntil, take } from "rxjs/operators";
import { vratiRadionice } from "./models/radionica.service";
import { Radionica } from "./models/radionica";
import { interval, timer } from "rxjs";

    var Majstori: Majstor[] = [];
    vratiMajstore().then(data => {
        data.forEach((m: any) => {
            var maj = new Majstor(m["id"],m["ime"],m["poznaje"]);
            Majstori.push(maj);
        })
    });

    var Segrti: Segrt[] = [];
    vratiSegrte().then(data => {
        data.forEach((s: any) => {
            var seg = new Segrt(s["id"],s["ime"]);
            Segrti.push(seg);
        })
    });

    var SveRadionice:Radionica[] = [];
    vratiRadionice().then(data => {
        data.forEach((v: any) => {
            var voz = new Radionica(v["vrsta"]);
            SveRadionice.push(voz);
        })
    });

    var VozilaNaCekanju: Vozilo[] = [];
    var prviProlaz = 0;
    //razdvoji funkciju da segrti i majstori ne zavise od dolaska vozila nego od posla koji obacljaju
    export async function Glavna() //glavna funkcija koja pokrece sve
    {
        
        SveRadionice.forEach(rad => {
            if(rad.zauzeto == false)
            {
                SegrtUbacujeVozilo().then(() => {
                    PosaljiMajstoraDaRadi().then(() => {
                        SegrtIzbacujeVozilo()
                    })
                });
            }
        });

        SveRadionice.forEach(rad => {
            if(rad.majstor == null)
            {
                PosaljiMajstoraDaRadi();
            }
        });

    }

    export async function DolazakVozila(vozilo:Vozilo) //mora da se uprosti da samo dodaje na red ili da se prosledi za ubacivanje
    {
        /*var j:number = 0;
        if(VozilaNaCekanju != null)
        {
            VozilaNaCekanju.forEach((element: Vozilo) => { //proverava da li ima neko vozilo koje ceka za istu radionicu
                if(vozilo.vrstaKvara == element.vrstaKvara) j++;
            });
            j = VozilaNaCekanju.filter((voz:Vozilo) => voz.vrstaKvara == vozilo.vrstaKvara).map((v:Vozilo) => 1).reduce((acc,val)=> acc+val);//broj ponavljanja istih vrsta kvarova
        }
        console.log("dolazak");     
        return new Promise((resolve,reject) =>{
            if(j==0 && !ProveriZauzeto(vozilo.vrstaKvara))
                return resolve(true);
            else
                return reject(false);
        });*/
        console.log(vozilo);
        if(prviProlaz == 0)
        {
            prviProlaz++;
            Glavna();
        }
        VozilaNaCekanju.push(vozilo);
    }

    async function SegrtUbacujeVozilo()
    {
        setInterval(()=>{
            Segrti.forEach(segrt => {
                if(!segrt.zauzet)
                {
                    return new Promise((resolve,reject)=>{
                        segrt.zauzet=true;
                        var Vozilo:Vozilo;
                        VratiSlobodnoVozilo().then((res:Vozilo) => {
                            Vozilo = res;
                            console.log(Vozilo);
                            SveRadionice.forEach(rad => {
                                if(rad.vrsta == Vozilo.vrstaKvara)
                                {     
                                    segrt.zauzet = true;
                                    let interval$ = interval(Math.floor(Math.random()*3000)+3000);
                                    let pauza = interval$.pipe(take(1))
                                    pauza.subscribe(()=>{
                                        rad.vozilo = Vozilo;
                                        Vozilo.status="Ceka Majstora";
                                        segrt.zauzet = false;
                                        crtajVozilo(Vozilo);
                                        console.log("vozilo" + Vozilo +"ubaceno u garazu za "+ rad.vrsta);
                                        resolve(true);
                                    })
                                }
                        });
                            
                        }).catch(err => console.log(err));
                        
                        segrt.zauzet = false;
                    });
                }
            });
            
        //console.log(VozilaNaCekanju);
        },20000);            
    }

    async function PosaljiMajstoraDaRadi()
    {
        setInterval(()=>{
            Majstori.forEach(majstor => {
                if(!majstor.zauzet)
                {
                    return new Promise((resolve,reject)=>{
                        SveRadionice.forEach(rad => {
                            if(rad.vozilo!=null  && rad.vozilo.status == "Ceka Majstora")
                            {
                                console.log("Garaza:",rad);
                                majstor.zauzet = true;
                                rad.vozilo.status = "Majstor Radi";
                                rad.majstor = majstor;
                                MajstorRadiNaVozilu(rad).then(()=>{
                                    majstor.zauzet = false;
                                    rad.majstor = null;
                                    rad.vozilo.status = "Popravljeno";
                                    console.log("Brisanje majstora");
                                    IzbrisiMajstora(rad);
                                    resolve(true);
                                })
                            }
                        });
                    })
                }
            });
        },20000);  
    }
    
    async function MajstorRadiNaVozilu(rad:Radionica)
    {
        return new Promise((resolve,reject)=>{
            IspisiMajstora(rad);
            let interval$ = interval(1000);
            let timer$ = timer(Math.floor(Math.random()*5000)+4000)
            let pauza = interval$.pipe(takeUntil(timer$))
            pauza.subscribe(()=>{
                rad.vozilo.status = "Majstor Radi";
                console.log("majstor radi");
            })
        });
    }

    async function SegrtIzbacujeVozilo() 
    {
        setInterval(()=>{
            Segrti.forEach(segrt => {
                if(!segrt.zauzet)
                {
                    return new Promise((resolve,reject)=>{
                        segrt.zauzet=true;
                        SveRadionice.forEach(rad => {
                            if(rad.zauzeto && rad.vozilo!=null && rad.vozilo.status == "Popravljeno")
                            {     
                                segrt.zauzet = true;
                                rad.vozilo.status="Izbacuje se";
                                let interval$ = interval(Math.floor(Math.random()*3000)+3000);
                                let pauza = interval$.pipe(take(1))
                                pauza.subscribe(()=>{
                                    rad.vozilo = null;
                                    segrt.zauzet = false;
                                    brisiVozilo(rad.vrsta);
                                    console.log("vozilo izbaceno iz: "+ rad.vrsta);
                                    resolve(true);
                                })
                            }
                        });
                        segrt.zauzet = false;
                        console.log(VozilaNaCekanju);
                    });
                }
            });
        },20000);         
    }

    /*function OdlazakVozila(vozilo: Vozilo)
    {
       console.log("Vozilo je otislo", vozilo);
       //pusti za vozilo sa liste cekanja ako je tu
       pustiSaRedaCekanja();        
    }

    

    

    function ProveriZauzeto(VrstaKvara: string)
    {
        SveRadionice.forEach(rad => {
            if(rad.vrsta == VrstaKvara)
            {
                return rad.zauzeto;
            }
        });
        return false;//morao sam da stavim da ne gleda funkciju kao void, ne znam zasto
    }
    
    function NadjiSlobodnogSegrta()
    {
        return Segrti.filter((segrti: Segrt) => segrti.zauzet == false);
    }

    function NadjiSlobodnogMajstora()
    {
        return Majstori.filter((m: Majstor) => m.zauzet == false);
    }

    async function pustiSaRedaCekanja()
    {
        let slobodne:string[] = SveRadionice.filter((r:Radionica) => r.zauzeto == false)
        .map((rad:Radionica) => rad.vrsta);
        if(slobodne != null && VozilaNaCekanju != null)
        {
            slobodne.forEach((s:string) => {
                let voz = VozilaNaCekanju.filter((v:Vozilo) => v.vrstaKvara == s)[0];
                VozilaNaCekanju = VozilaNaCekanju.filter((v:Vozilo) => v.registracija != voz.registracija);
                Glavna(voz);
            })
        }
    }*/

    async function VratiSlobodnoVozilo()
    {
        return new Promise((resolve,reject)=>{
            let izabrano = 0;
            for(let i=0;i<VozilaNaCekanju.length;i++)
            {
                SveRadionice.forEach(radionica => {
                    if(!radionica.zauzeto && VozilaNaCekanju[i].vrstaKvara == radionica.vrsta  && VozilaNaCekanju[i].status == "")
                    {
                        radionica.zauzeto = true; // da ne upadne neko drugo
                        VozilaNaCekanju[i].status = "Kod segrta";
                        var Vozilo:Vozilo = VozilaNaCekanju[i];
                        izabrano++;
                        VozilaNaCekanju = VozilaNaCekanju.filter((voz:Vozilo) => voz.id != Vozilo.id);
                        resolve(Vozilo);
                    }
                });
            }
        })
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
        console.log("upis")
    }

    function IspisiMajstora(radionica:Radionica)
    {
        const garaza = document.getElementById(radionica.vrsta);
        const data = document.createElement("ul");
        const podatak = document.createElement("li");
        podatak.innerHTML = "Majstor koji trenurno radi na vozilu:";
        data.appendChild(podatak);
        const podatak2 = document.createElement("li");
        podatak2.innerHTML = radionica.majstor.ime;
        data.appendChild(podatak2);
        garaza.appendChild(data);
    }

    function IzbrisiMajstora(rad:Radionica)
    {
        const garaza = document.getElementById(rad.vrsta);
        const data = garaza.lastChild;
        console.log("brisanje",data.childNodes)
        /*data.childNodes.forEach(node => {
            console.log ("Dete na majstora",node);
            node.remove();
        });*/
        data.remove();
    }
    function brisiVozilo(radionica : string)
    {
        const garaza = document.getElementById(radionica);
        const data = garaza.firstChild;
        console.log("brisanjeVozila",data.childNodes)
        
        data.remove();
    }
