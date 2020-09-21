import { Majstor } from "./models/majstor";
import { vratiMajstore, vratiSlobodnogMajstora, updateMajstor} from "./models/majstori.service";
import { Segrt } from "./models/segrt";
import { vratiSegrte, updateSergrt, vratiSlobodnogSegrta } from "./models/segrti.service";
import { Vozilo } from "./models/vozilo";
import { take } from "rxjs/operators";
import { vratiRadionice, vratiRadionicuPoVrsti, updateRadionica } from "./models/radionica.service";
import { Radionica } from "./models/radionica";
import { interval, timer , zip} from "rxjs";
import {crtajVozilo,IspisiMajstora,IzbrisiMajstora,brisiVozilo, IscrtajUradjenoVozilo} from "./view"
import { updateVozilo, vratiVoziloPoID } from "./models/vozila.service";
import { ucitaj } from "./../index";

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

    // var VozilaNaCekanju: Vozilo[] = [];
    // var prviProlaz = 0;

    // var int1: any;
    // var int2: any;
    // var int3: any;

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

    export async function DolazakVozila(vozilo:Vozilo):Promise<boolean>
    {        
        // if(prviProlaz == 0)
        // {
        //     prviProlaz++;
        //     Glavna();
        // }
        // VozilaNaCekanju.push(vozilo);
        return new Promise<boolean>((resolve,reject)=>{
            vratiRadionicuPoVrsti(vozilo.vrstaKvara).subscribe(async radionica => {
                console.log(radionica)
                if(!radionica[0].zauzeto)
                {
                    console.log(radionica[0]);
                    radionica[0].zauzeto = true;
                    radionica[0].vozilo = vozilo.id;
                    await updateRadionica(radionica[0]);
                    vozilo.status = "Ceka segrta da ubaci vozilo";
                    await updateVozilo(vozilo);
                    await SegrtUbacujeVozilo(vozilo);
                    resolve(true);
                }
                else
                {
                    console.log("Radionica je zauzeta");
                    reject("Radionica je zauzeta");
                }
            });
        });
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
                return new Promise(async (resolve,reject)=>{
                    segrt[0].zauzet=true;
                    await updateSergrt(segrt[0]);
                    vratiRadionicuPoVrsti(vozilo.vrstaKvara).subscribe(async rad => {
                        if(rad.length > 0)
                        {     
                            rad[0].zauzeto == true;
                            await updateRadionica(rad[0]);
                            let interval$ = interval(Math.floor(Math.random()*3000)+3000);
                            let pauza = interval$.pipe(take(1))
                            pauza.subscribe(async ()=>{
                                rad[0].vozilo = vozilo.id;
                                await updateRadionica(rad[0]);
                                vozilo.status="Ceka Majstora";
                                await updateVozilo(vozilo);
                                crtajVozilo(vozilo);
                                segrt[0].zauzet = false;
                                segrt[0].radiNa = "";
                                await updateSergrt(segrt[0]);
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

    export async function PosaljiMajstoraDaRadi(vozilo:Vozilo)
    {
        vratiSlobodnogMajstora().subscribe(majstor => {
            if(majstor.length > 0)
            {
                return new Promise((resolve,reject)=>{
                    vratiRadionicuPoVrsti(vozilo.vrstaKvara).subscribe(async rad => {
                        if(rad.length > 0)
                        {
                            majstor[0].radiNa = vozilo.id.toString();
                            majstor[0].zauzet = true;
                            await updateMajstor(majstor[0]);
                            vozilo.status = "Majstor Radi";
                            await updateVozilo(vozilo);
                            rad[0].majstor = majstor[0].id;
                            await updateRadionica(rad[0]);
                            IspisiMajstora(rad[0]);
                            MajstorRadiNaVozilu(vozilo).then(async ()=>{
                                majstor[0].zauzet = false;
                                majstor[0].radiNa = "";
                                await updateMajstor(majstor[0]);
                                rad[0].majstor = null;
                                await updateRadionica(rad[0]);
                                vozilo.status = "Popravljeno";
                                await updateVozilo(vozilo);
                                IzbrisiMajstora(rad[0]);
                                resolve(true);
                            })
                        }
                        else throw new Error("radionica je zauzeta");
                    });
                })
            }
            else throw new Error("Trenutno su svi majstori zauzeti");
        });
    }
    
    async function MajstorRadiNaVozilu(vozilo:Vozilo)
    {
        return new Promise((resolve,reject)=>{
            let interval$ = interval(Math.floor(Math.random()*5000)+4000);
            let pauza = interval$.pipe(take(1))
            pauza.subscribe(async ()=>{
                vozilo.status = "Majstor Radi";
                await updateVozilo(vozilo);
                resolve(true);
            });
        })
    }

    export async function SegrtIzbacujeVozilo(radionica:Radionica) 
    {
        vratiSlobodnogSegrta().subscribe(segrt => {
            if(segrt.length > 0)
            {
                return new Promise(async (resolve,reject)=>{
                    segrt[0].zauzet=true;
                    await updateSergrt(segrt[0]);
                    vratiVoziloPoID(radionica.vozilo).subscribe(async vozilo =>{
                        console.log("vozilo",vozilo);
                        vozilo.status = "Izbacuje se";
                        await updateVozilo(vozilo);
                        let interval$ = interval(Math.floor(Math.random()*3000)+3000);
                        let pauza = interval$.pipe(take(1))
                        pauza.subscribe(async ()=>{
                            radionica.vozilo = null;
                            radionica.zauzeto = false;
                            await updateRadionica(radionica);
                            segrt[0].zauzet = false;
                            await updateSergrt(segrt[0]);
                            brisiVozilo(radionica.vrsta);
                            IscrtajUradjenoVozilo(vozilo);
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