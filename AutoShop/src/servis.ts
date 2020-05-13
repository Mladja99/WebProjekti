import { Majstor } from "./models/majstor";
import { vratiMajstore} from "./models/majstori.service";
import { Segrt } from "./models/segrt";
import { vratiSegrte } from "./models/segrti.service";
import { Vozilo } from "./models/vozilo";
import { take } from "rxjs/operators";
import { vratiRadionice } from "./models/radionica.service";
import { Radionica } from "./models/radionica";
import { interval, timer , zip} from "rxjs";
import {crtajVozilo,IspisiMajstora,IzbrisiMajstora,brisiVozilo} from "./view"

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

    var int1: any;
    var int2: any;
    var int3: any;

    export async function Glavna() 
    {
        
        SveRadionice.forEach(rad => {
            if(rad.zauzeto == false)
            {
                SegrtUbacujeVozilo().then(() => {
                    PosaljiMajstoraDaRadi().then(() => {
                        SegrtIzbacujeVozilo();
                    })
                });
            }
        });
    }

    export async function DolazakVozila(vozilo:Vozilo) 
    {
        
        if(prviProlaz == 0)
        {
            prviProlaz++;
            Glavna();
        }
        VozilaNaCekanju.push(vozilo);
        
    }

    async function SegrtUbacujeVozilo()
    {
        int1 = setInterval(()=>{
            Segrti.forEach(segrt => {
                if(!segrt.zauzet)
                {
                    return new Promise((resolve,reject)=>{
                        segrt.zauzet=true;
                        var Vozilo:Vozilo;
                        VratiSlobodnoVozilo(segrt).then((res:Vozilo) => {
                            Vozilo = res;
                            SveRadionice.forEach(rad => {
                                if(rad.vrsta == Vozilo.vrstaKvara)
                                {     
                                    segrt.zauzet = true;
                                    rad.zauzeto == true;
                                    let interval$ = interval(Math.floor(Math.random()*3000)+3000);
                                    let pauza = interval$.pipe(take(1))
                                    pauza.subscribe(()=>{
                                        rad.vozilo = Vozilo;
                                        Vozilo.status="Ceka Majstora";
                                        crtajVozilo(Vozilo);
                                        segrt.zauzet = false;
                                        segrt.radiNa = "";
                                        resolve(true);
                                    })
                                }
                        });
                        }).catch(err => console.log(err));
                        segrt.zauzet = false;
                    });
                }
            });
        },10000);            
    }

    async function PosaljiMajstoraDaRadi()
    {
        int2 = setInterval(()=>{
            Majstori.forEach(majstor => {
                if(!majstor.zauzet)
                {
                    return new Promise((resolve,reject)=>{
                        SveRadionice.forEach(rad => {
                            if(rad.vozilo!=null  && rad.vozilo.status == "Ceka Majstora" && majstor.radiNa=="")
                            {
                                majstor.radiNa=rad.vozilo;
                                rad.vozilo.status = "Majstor Radi";
                                majstor.zauzet = true;
                                rad.majstor = majstor;
                                IspisiMajstora(rad);
                                MajstorRadiNaVozilu(rad).then((res)=>{
                                    majstor.zauzet = false;
                                    rad.majstor = null;
                                    rad.vozilo.status = "Popravljeno";
                                    IzbrisiMajstora(rad);
                                    majstor.radiNa = "";
                                    resolve(true);
                                })
                            }
                        });
                    })
                }
            });
        },10000);  
    }
    
    async function MajstorRadiNaVozilu(rad:Radionica)
    {
        return new Promise((resolve,reject)=>{
            let interval$ = interval(Math.floor(Math.random()*5000)+4000);
            let timer$ = timer(Math.floor(Math.random()*5000)+4000)
            let pauza = interval$.pipe(take(1))
            pauza.subscribe(()=>{
                rad.vozilo.status = "Majstor Radi";
                resolve(true);
            });
        })
    }

    async function SegrtIzbacujeVozilo() 
    {
        int3 = setInterval(()=>{
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
                                    rad.zauzeto = false;
                                    resolve(true);
                                })
                            }
                        });
                        segrt.zauzet = false;
                    });
                }
            });
            proveriKraj();   
        },10000);       
    }

    

    async function VratiSlobodnoVozilo(segrt:Segrt)
    {
        return new Promise((resolve,reject)=>{
            for(let i=0;i<VozilaNaCekanju.length;i++)
            {
                SveRadionice.forEach(radionica => {
                    if(!radionica.zauzeto && VozilaNaCekanju[i].vrstaKvara == radionica.vrsta  && VozilaNaCekanju[i].status == "" && segrt.radiNa=="")
                    {
                        radionica.zauzeto = true; // da ne upadne neko drugo\
                        segrt.radiNa = "123";
                        let interval$ = interval(1000);
                        let pauza = interval$.pipe(take(1))
                        pauza.subscribe(()=>{
                            VozilaNaCekanju[i].status = "Kod segrta";
                            var Vozilo:Vozilo = VozilaNaCekanju[i];
                            //VozilaNaCekanju = VozilaNaCekanju.filter((voz:Vozilo) => voz.id != Vozilo.id);
                            resolve(Vozilo);
                        })
                    }
                });
            }
        })
    }

    function proveriKraj()
    {
        return new Promise((resolve,reject)=>
        {
            let i = 0;
            SveRadionice.forEach(rad => {
                if(rad.zauzeto)
                {
                    i++;
                }
            });
            VozilaNaCekanju.forEach(voz =>{
                if(voz.status!="Izbacuje se")
                {
                    i++;
                }
            })
            setTimeout(()=>{
                if(i==0)
                {
                    clearInterval(int1);
                    clearInterval(int2);
                    clearInterval(int3);
                    resolve(true);                    
                }
                else
                {
                    resolve(false);
                }
            },1000);
        })
    }