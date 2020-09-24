import { from, Observable } from "rxjs";
import { Vozilo } from "./vozilo";
import {fromFetch} from 'rxjs/fetch'
import { switchMap } from "rxjs/operators";

const url_vozila = "http://localhost:3000/vozila";
//vraca sva vozila iz baze
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
//vraca vozilo po registarskoj oznaci (mora niz zato sto kako god da stavim vraca niz)
export function getVoziloByReg(reg:string):Observable<Vozilo[]> {
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
//radi update za vozilo
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
//vraca vozilo sa trazenim id-em
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

//vraca vozila koja su zavrsena
export function vratiZavrsenaVozila():Observable<Vozilo[]>
{
  const data$ = fromFetch(url_vozila + "?status=" + "Izbacuje se").pipe(
    switchMap(response => {
      if(response.ok)
      {
        return response.json();
      }
    }),
  );
  return data$;
}