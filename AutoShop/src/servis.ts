import { vratiSlobodnogMajstora, updateMajstor} from "./models/majstori.service";
import { updateSergrt, vratiSlobodnogSegrta } from "./models/segrti.service";
import { Vozilo } from "./models/vozilo";
import { take } from "rxjs/operators";
import { vratiRadionicuPoVrsti, updateRadionica } from "./models/radionica.service";
import { Radionica } from "./models/radionica";
import { interval } from "rxjs";
import {crtajVozilo,IspisiMajstora,IzbrisiMajstora,brisiVozilo, IscrtajUradjenoVozilo} from "./view"
import { updateVozilo, vratiVoziloPoID } from "./models/vozila.service";

    //funkcija koja se poziva za inicranje ubacivanja vozila u neku od garaza
    //vraca radionicu po vrsti kvara koja je potrebna vozilu iz baze i 
    //ukoliko je prazna zove funkciju za ubacivanje vozila
    export async function DolazakVozila(vozilo:Vozilo):Promise<boolean>
    {  
        return new Promise<boolean>((resolve,reject)=>{
            vratiRadionicuPoVrsti(vozilo.vrstaKvara).subscribe(async radionica => {
                if(!radionica[0].zauzeto)
                {
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
                    reject("Radionica je zauzeta");
                    throw new Error("Radionica je zauzeta");                    
                }
            });
        });
    }
    //nalazi slobodnog segrta iz baze ukoliko vrati vise od jednog uzima uvek prvog
    //nalazi radionicu iz baze i ubacuje vozilo u tu radionicu
    async function SegrtUbacujeVozilo(vozilo:Vozilo)
    {     
        try
        {      
            vratiSlobodnogSegrta().subscribe(segrt => {
                if(segrt.length > 0)
                {
                    return new Promise(async (resolve)=>{
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
                            else throw new Error("Radionica nije pronadjena");
                        });
                        segrt[0].zauzet = false;
                        updateSergrt(segrt[0]);
                    });
                }
                else
                    throw new Error("nema slobodnog segrta");
            });
        }
        catch(err)
        {
            throw new Error(err);
        }
    }
    //nalazi majstora koji je slobodan iz baze i trazi radionicu iz baze i onda zove funkciju koja simulira rad majstora
    export async function PosaljiMajstoraDaRadi(vozilo:Vozilo)
    {
        try
        {
            vratiSlobodnogMajstora().subscribe(majstor => {
                if(majstor.length > 0)
                {
                    return new Promise((resolve)=>{
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
                            else
                            {
                                throw new Error("radionica je zauzeta");
                            } 
                        });
                    })
                }
                else throw new Error("Trenutno su svi majstori zauzeti");
            });
        }
        catch(e)
        {
            throw new Error(e);            
        }
    }
    //funkcija za simulaciju rada majstora 
    async function MajstorRadiNaVozilu(vozilo:Vozilo)
    {
        return new Promise((resolve)=>{
            let interval$ = interval(Math.floor(Math.random()*5000)+4000);
            let pauza = interval$.pipe(take(1))
            pauza.subscribe(async ()=>{
                vozilo.status = "Majstor Radi";
                await updateVozilo(vozilo);
                resolve(true);
            });
        })
    }
    //vraca iz baze slobodne segrte i vraca vozilo po id-u vozila i onda izbacuje vozilo iz radionice i brise tekst vezaan za vozilo iz prikaza
    export async function SegrtIzbacujeVozilo(radionica:Radionica) 
    {
        try
        {
            vratiSlobodnogSegrta().subscribe(segrt => {
                if(segrt.length > 0)
                {
                    return new Promise(async (resolve)=>{
                        segrt[0].zauzet=true;
                        await updateSergrt(segrt[0]);
                        vratiVoziloPoID(radionica.vozilo).subscribe(async vozilo =>{
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
                    throw new Error("Trenutno nema slobodnih segrta");
                }
            });
        }
        catch(err)
        {
            throw new Error(err);
        }
    }