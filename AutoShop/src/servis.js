import { ECU } from "./models";
import { Elektrika } from "./models";
import { Majstor } from "./models";
import { Mehanika } from "./models";
import { Segrt } from "./models";
import { Vozilo } from "./models";
import { forEachChild } from "typescript";
import {from, observable, Observable} from "rxjs";

    const SvaVozila$ = fetch("http://localhost:3000/vozila").then((res)=>res.json()).catch((err)=>console.log(err));
    const Majstori$ = fetch("http://localhost:3000/majstori").then((res)=>res.json()).catch((err)=>console.log(err));
    const Segrti$ = fetch("http://localhost:3000/segrti").then((res)=>res.json()).catch((err)=>console.log(err));
    
    let VozilaNaCekanju$ = null;
    let i$=0;
    let ecu$ = new ECU();
    let elektrika$ = new Elektrika();
    let mehanika$ = new Mehanika();

    async function DolazakVozila(vozilo) 
    {
        /*if(!mehanika.Zauzeto)
        {
            mehanika.Zauzeto = true;
            mehanika.Vozilo = vozilo;
        }
        else VozilaNaCekanju$[i$ ++]=vozilo;*/
        //iskoristi funkciju da pozivas sve ostale
    }

    async function OdlazakVozila(vozilo)
    {
       this.SvaVozila$ = this.SvaVozila$.pipe(filter(voz => voz.Registracija === vozilo.Registracija));
       
    }

    async function SegrtUbacujeVozilo(segrt, vozilo)
    {
        segrt.Zauzet = true;
        if(vozilo.VrstaKvara == "ecu")
        {
            this.ecu$.Vozilo = vozilo;
            segrt.Zauzet = false;
            return "vozilo ubaceno u garazu za ecu";
        }
        else if(vozilo.VrstaKvara == "mehanika")
        {
            this.mehanika$.Vozilo = vozilo;
            segrt.Zauzet = false;
            return "vozilo ubaceno u garazu za mehaniku";
        }
        else
        {
            this.elektrika$.Vozilo = vozilo;
            segrt.Zauzet = false;
            return "vozilo ubaceno u garazu za mehaniku";
        }
    }

    async function SegrtIzbacujeVozilo(segrt) 
    {

    }

    async function MajstorRadiNaVozilu(majstor, vozilo)
    {
        //odradi pipe da se prikaze na stranici
        debounceTime(Math.floor(Math.random()*3000)+2000);//random br izmedju 2000 i 5000
    }

    async function PosaljiMajstoraDaRadi(majstor, vozilo)
    {
        majstor.Zauzet = true;
        majstor.RadiNa = vozilo;
        if(vozilo.VrstaKvara == "ecu")
        {
            this.ecu$.Vozilo = vozilo;
            this.ecu$.Majstor = majstor;
        }
        else if(vozilo.VrstaKvara == "mehanika")
        {
            this.mehanika$.Vozilo = vozilo;
            this.mehanika$.Majstor = majstor;
        }
        else
        {
            this.elektrika$ = vozilo;
            this.elektrika$.Majstor = majstor;
        }
        await MajstorRadiNaVozilu(majstor)
        majstor.RadiNa = null;
        majstor.Zauzet = false;
        return "Majstor zavrsio sa radom";
    }
