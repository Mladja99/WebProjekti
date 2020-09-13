import { from, Observable } from "rxjs";
import { Vozilo } from "./vozilo";
import {fromFetch} from 'rxjs/fetch'
import { switchMap } from "rxjs/operators";

const url_vozila = "http://localhost:3000/vozila";

export function vratiVozila():Observable<Vozilo[]>
{
    //return fetch(url_vozila).then(res => res.json());
  const data$ = fromFetch(url_vozila).pipe(
    switchMap(response =>{
        if(response.ok)
        {
            return response.json();
        }
    }),
  )
  
return data$;
}

export function getVoziloByReg(reg:string) {
    return from(
      fetch("http://localhost:3000/vozila?Registracija="+ reg)
        .then(response => {
          if (!response.ok) {
            throw new Error("reg not found")
          }
          else {
            return response.json();
          }
        })
        .catch(err => console.log(`Error `, err))
    )
  }