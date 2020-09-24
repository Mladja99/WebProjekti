import { Observable } from "rxjs";
import { Segrt } from "./segrt";
import { fromFetch } from "rxjs/fetch";
import { switchMap } from "rxjs/operators";

const url_segrti = "http://localhost:3003/segrti";
//vraca sve segrte iz baze
export function vratiSegrte():Observable<Segrt[]>
{
    //return fetch(url_segrti).then(res => res.json());
    const data$ = fromFetch(url_segrti).pipe(
        switchMap(response =>{
            if(response.ok)
            {
                return response.json();
            }
        }),
    )  
    return data$;
}
//vraca slobodne segrte kao niz (kasnije se uzima prvi slobodan)
export function vratiSlobodnogSegrta():Observable<Segrt[]>
{
    const data$ = fromFetch(url_segrti + "?zauzet=false").pipe(
        switchMap(response =>{
            if(response.ok)
            {
                return response.json();
            }
        }),
    )  
    return data$;
}
//radi update za segrta
export async function updateSergrt(segrt:Segrt):Promise<void>
{
    const UpdateTask ={
        method:"put",
        body: JSON.stringify(segrt),
        headers:{'Content-Type':'application/json'},
    };
    await fetch(url_segrti+"/"+segrt.id, UpdateTask);
}