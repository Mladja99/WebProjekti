import { Majstor } from "./models/majstor";
import { vratiMajstore, vratiSlobodnogMajstora, updateMajstor} from "./models/majstori.service";
import { Segrt } from "./models/segrt";
import { vratiSegrte, updateSergrt, vratiSlobodnogSegrta } from "./models/segrti.service";
import { Vozilo } from "./models/vozilo";
import { take } from "rxjs/operators";
import { vratiRadionice, vratiRadionicuPoVrsti, updateRadionica } from "./models/radionica.service";
import { Radionica } from "./models/radionica";
import { interval, timer , zip} from "rxjs";
import {crtajVozilo,IspisiMajstora,IzbrisiMajstora,brisiVozilo} from "./view"
import { updateVozilo, vratiVoziloPoID } from "./models/vozila.service";

    // var Majstori: Majstor[] = [];
    // vratiMajstore().then(data => {
    //     data.forEach((m: any) => {
    //         var maj = new Majstor(m["id"],m["ime"],m["poznaje"]);
    //         Majstori.push(maj);
    //     })
    // });

    // var Segrti: Segrt[] = [];
    // vratiSegrte().then(data => {
    //     data.forEach((s: any) => {
    //         var seg = new Segrt(s["id"],s["ime"]);
    //         Segrti.push(seg);
    //     })
    // });

    // var SveRadionice:Radionica[] = [];
    // vratiRadionice().then(data => {
    //     data.forEach((v: any) => {
    //         var voz = new Radionica(v["vrsta"]);
    //         SveRadionice.push(voz);
    //     })
    // });

    var VozilaNaCekanju: Vozilo[] = [];
    var prviProlaz = 0;

    var int1: any;
    var int2: any;
    var int3: any;

    export async function Glavna(vozilo:Vozilo) 
    {        
        // SveRadionice.forEach(rad => {
        //     if(rad.zauzeto == false)
        //     {
        //         SegrtUbacujeVozilo().then(() => {
        //             PosaljiMajstoraDaRadi().then(() => {
        //                 SegrtIzbacujeVozilo();
        //             })
        //         });
        //     }
        // }); mora da se prepravi da ide na klik
        // vratiRadionice().subscribe(rad => {
        //     rad.forEach(rad => {
        //         if(rad.zauzeto == false)
        //         {
        //             SegrtUbacujeVozilo().then(() => {
        //                 PosaljiMajstoraDaRadi().then(() => {
        //                     SegrtIzbacujeVozilo();
        //                 })
        //             });
        //         }
        //     });
        // });
    }

    export async function DolazakVozila(vozilo:Vozilo) 
    {        
        // if(prviProlaz == 0)
        // {
        //     prviProlaz++;
        //     Glavna();
        // }
        // VozilaNaCekanju.push(vozilo);
        vratiRadionicuPoVrsti(vozilo.vrstaKvara).subscribe(radionica => {
            if(!radionica[0].zauzeto)
            {
                console.log(radionica[0]);
                radionica[0].zauzeto = true;
                radionica[0].vozilo = vozilo.id;
                updateRadionica(radionica[0]);
                vozilo.status = "Ceka segrta da ubaci vozilo";
                updateVozilo(vozilo);
                SegrtUbacujeVozilo(vozilo);
            }
        })
        
    }

    async function SegrtUbacujeVozilo(vozilo:Vozilo)
    {
        // vratiSegrte().forEach(segrt => {
        //     if(!segrt.zauzet)
        //     {
        //         return new Promise((resolve,reject)=>{
        //             segrt.zauzet=true;
        //             var Vozilo:Vozilo;
        //             VratiSlobodnoVozilo(segrt).then((res:Vozilo) => {
        //                 Vozilo = res;
        //                 SveRadionice.forEach(rad => {
        //                     if(rad.vrsta == Vozilo.vrstaKvara)
        //                     {     
        //                         segrt.zauzet = true;
        //                         rad.zauzeto == true;
        //                         let interval$ = interval(Math.floor(Math.random()*3000)+3000);
        //                         let pauza = interval$.pipe(take(1))
        //                         pauza.subscribe(()=>{
        //                             rad.vozilo = Vozilo;
        //                             Vozilo.status="Ceka Majstora";

        //                             crtajVozilo(Vozilo);
        //                             segrt.zauzet = false;
        //                             segrt.radiNa = "";
        //                             resolve(true);
        //                         })
        //                     }
        //             });
        //             }).catch(err => console.log(err));
        //             segrt.zauzet = false;
        //         });
        //     }
        // });           
        vratiSlobodnogSegrta().subscribe(segrt => {
            console.log(segrt);
            if(segrt.length > 0)
            {
                return new Promise((resolve,reject)=>{
                    segrt[0].zauzet=true;
                    updateSergrt(segrt[0]);
                    vratiRadionicuPoVrsti(vozilo.vrstaKvara).subscribe(rad => {
                        if(rad.length > 0)
                        {     
                            rad[0].zauzeto == true;
                            updateRadionica(rad[0]);
                            let interval$ = interval(Math.floor(Math.random()*3000)+3000);
                            let pauza = interval$.pipe(take(1))
                            pauza.subscribe(()=>{
                                rad[0].vozilo = vozilo.id;
                                updateRadionica(rad[0]);
                                vozilo.status="Ceka Majstora";
                                updateVozilo(vozilo);
                                crtajVozilo(vozilo);
                                segrt[0].zauzet = false;
                                segrt[0].radiNa = "";
                                updateSergrt(segrt[0]);
                                resolve(true);
                            })
                        }
                        else console.log("Radionica nije pronadjena");
                    });
                    segrt[0].zauzet = false;
                    updateSergrt(segrt[0]);
                });
            }
            else
                console.log("nema slobodnog segrta");
        });
    }

    async function PosaljiMajstoraDaRadi(vozilo:Vozilo)
    {
        vratiSlobodnogMajstora().subscribe(majstor => {
            if(majstor.length > 0)
            {
                return new Promise((resolve,reject)=>{
                    vratiRadionicuPoVrsti(vozilo.vrstaKvara).subscribe(rad => {
                        if(!rad[0].zauzeto)
                        {
                            majstor[0].radiNa = vozilo.id.toString();
                            majstor[0].zauzet = true;
                            updateMajstor(majstor[0]);
                            vozilo.status = "Majstor Radi";
                            updateVozilo(vozilo);
                            rad[0].majstor = majstor[0].id;
                            updateRadionica(rad[0]);
                            IspisiMajstora(rad[0]);
                            MajstorRadiNaVozilu(vozilo).then(()=>{
                                majstor[0].zauzet = false;
                                majstor[0].radiNa = "";
                                updateMajstor(majstor[0]);
                                rad[0].majstor = null;
                                updateRadionica(rad[0]);
                                vozilo.status = "Popravljeno";
                                updateVozilo(vozilo);
                                IzbrisiMajstora(rad[0]);
                                resolve(true);
                            })
                        }
                        else console.log("radionica je zauzeta");
                    });
                })
            }
            else console.log("Trenutno su svi majstori zauzeti");
        });
    }
    
    async function MajstorRadiNaVozilu(vozilo:Vozilo)
    {
        return new Promise((resolve,reject)=>{
            let interval$ = interval(Math.floor(Math.random()*5000)+4000);
            let pauza = interval$.pipe(take(1))
            pauza.subscribe(()=>{
                vozilo.status = "Majstor Radi";
                updateVozilo(vozilo);
                resolve(true);
            });
        })
    }

    async function SegrtIzbacujeVozilo(radionica:Radionica) 
    {
        vratiSlobodnogSegrta().subscribe(segrt => {
            if(segrt.length > 0)
            {
                return new Promise((resolve,reject)=>{
                    segrt[0].zauzet=true;
                    updateSergrt(segrt[0]);
                    vratiVoziloPoID(radionica.vozilo).subscribe(vozilo =>{
                        vozilo[0].status = "Izbacuje se";
                        updateVozilo(vozilo[0]);
                        let interval$ = interval(Math.floor(Math.random()*3000)+3000);
                        let pauza = interval$.pipe(take(1))
                        pauza.subscribe(()=>{
                            radionica.vozilo = null;
                            radionica.zauzeto = false;
                            updateRadionica(radionica);
                            segrt[0].zauzet = false;
                            updateSergrt(segrt[0]);
                            brisiVozilo(radionica.vrsta);
                            resolve(true);
                        });
                    });                    
                });
            }
            else 
            {
                console.log("Trenutno nema slobodnih segrta");
            }
        });
    }

    

    // async function VratiSlobodnoVozilo(segrt:Segrt)
    // {
    //     return new Promise((resolve,reject)=>{
    //         for(let i=0;i<VozilaNaCekanju.length;i++)
    //         {
    //             SveRadionice.forEach(radionica => {
    //                 if(!radionica.zauzeto && VozilaNaCekanju[i].vrstaKvara == radionica.vrsta  && VozilaNaCekanju[i].status == "" && segrt.radiNa=="")
    //                 {
    //                     radionica.zauzeto = true; // da ne upadne neko drugo\
    //                     segrt.radiNa = "123";
    //                     let interval$ = interval(1000);
    //                     let pauza = interval$.pipe(take(1))
    //                     pauza.subscribe(()=>{
    //                         VozilaNaCekanju[i].status = "Kod segrta";
    //                         var Vozilo:Vozilo = VozilaNaCekanju[i];
    //                         //VozilaNaCekanju = VozilaNaCekanju.filter((voz:Vozilo) => voz.id != Vozilo.id);
    //                         resolve(Vozilo);
    //                     })
    //                 }
    //             });
    //         }
    //     })
    // }

    // function proveriKraj()
    // {
    //     return new Promise((resolve,reject)=>
    //     {
    //         let i = 0;
    //         SveRadionice.forEach(rad => {
    //             if(rad.zauzeto)
    //             {
    //                 i++;
    //             }
    //         });
    //         VozilaNaCekanju.forEach(voz =>{
    //             if(voz.status!="Izbacuje se")
    //             {
    //                 i++;
    //             }
    //         })
    //         setTimeout(()=>{
    //             if(i==0)
    //             {
    //                 clearInterval(int1);
    //                 clearInterval(int2);
    //                 clearInterval(int3);
    //                 resolve(true);                    
    //             }
    //             else
    //             {
    //                 resolve(false);
    //             }
    //         },1000);
    //     })
    // }