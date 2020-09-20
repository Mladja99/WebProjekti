import { Observable } from "rxjs";
import { Segrt } from "./segrt";
import { fromFetch } from "rxjs/fetch";
import { switchMap, take } from "rxjs/operators";

const url_segrti = "http://localhost:3000/segrti";

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

export function updateSergrt(segrt:Segrt):void
{
    console.log(segrt);
    const UpdateTask ={
        method:"put",
        body: JSON.stringify(segrt),
        headers:{'Content-Type':'application/json'},
    };
    fetch(url_segrti+"/"+segrt.id, UpdateTask);
}