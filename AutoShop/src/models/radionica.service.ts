import { Observable } from "rxjs";
import { Radionica } from "./radionica";
import { fromFetch } from "rxjs/fetch";
import { switchMap } from "rxjs/operators";

const url_radionice = "http://localhost:3002/radionice";
//vraca sve radionice iz bazae
export function vratiRadionice():Observable<Radionica[]>
{
    //return fetch(url_radionice).then(res => res.json());
    const data$ = fromFetch(url_radionice).pipe(
        switchMap(response =>{
            if(response.ok)
            {
                return response.json();
            }
        }),
    )  
    return data$;
}
//vraca radionicu po vrsti kvara koja moze da se resi u toj radionici
export function vratiRadionicuPoVrsti(vrsta:string):Observable<Radionica[]>
{
    const data$ = fromFetch(url_radionice+"?vrsta="+vrsta).pipe(
        switchMap(response => {
            if(response.ok)
            {
                return response.json();
            }
        })
    )
    return data$;
}
//radi update radionice
export async function updateRadionica(radionica:Radionica):Promise<void>
{
    console.log(radionica);
    const UpdateTask ={
        method:"put",
        body: JSON.stringify(radionica),
        headers:{'Content-Type':'application/json'},
    };
    await fetch(url_radionice+"/"+radionica.id, UpdateTask);
}