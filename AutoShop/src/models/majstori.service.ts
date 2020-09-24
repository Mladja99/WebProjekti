import { fromFetch } from "rxjs/fetch";
import { switchMap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Majstor } from "./majstor";

const url_majstori = "http://localhost:3001/majstori";
//preko fetch pravi observable sa majstorima iz baze i vraca podatke
export function vratiMajstore():Observable<Majstor[]>
{
    //return fetch(url_majstori).then(res => res.json());
    const data$ = fromFetch(url_majstori).pipe(
        switchMap(response =>{
            if(response.ok)
            {
                return response.json();
            }
        }),
    )  
    return data$;
}
//vraca slobodne majstore kao niz
export function vratiSlobodnogMajstora():Observable<Majstor[]>
{
    const data$ = fromFetch(url_majstori + "?zauzet=false").pipe(
        switchMap(response =>{
            if(response.ok)
            {
                return response.json();
            }
        }),
    )  
    return data$;
}
//vraca majstora po trazenom id-u
export async function vratiMajtoraPoID(id:number):Promise<Majstor>
{
    return await fetch(url_majstori + "/" + id)
        .then((res) => res.json())
        .catch((err) => console.log(err));
}
//Ubacuje izmene u bazu
export async function updateMajstor(majstor:Majstor):Promise<void>
{
    const UpdateTask ={
        method:"put",
        body: JSON.stringify(majstor),
        headers:{'Content-Type':'application/json'},
    };
    await fetch(url_majstori+"/"+majstor.id, UpdateTask);
}