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

export function getVoziloByReg(reg:string):Observable<Vozilo[]> {
  // return from(
  //   fetch("http://localhost:3000/vozila?Registracija="+ reg)
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error("reg not found")
  //       }
  //       else {
  //         return response.json();
  //       }
  //     })
  //     .catch(err => console.log(`Error `, err))
  // )
  const data$ = fromFetch(url_vozila + "?Registracija=" + reg).pipe(
    switchMap(response => {
      if(response.ok)
      {
        return response.json();
      }
    }),
  );
  return data$;
}

export async function updateVozilo(vozilo:Vozilo):Promise<void>
{
  console.log(vozilo);
  const UpdateTask ={
      method:"put",
      body: JSON.stringify(vozilo),
      headers:{'Content-Type':'application/json'},
  };
  await fetch(url_vozila+"/"+vozilo.id,UpdateTask);
}

export function vratiVoziloPoID(id:number):Observable<Vozilo>
{
  const data$ = fromFetch(url_vozila + "/" + id).pipe(
    switchMap(response => {
      if(response.ok)
      {
        return response.json();
      }
    }),
  )    
  return data$;
}