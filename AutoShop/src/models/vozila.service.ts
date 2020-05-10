import { from } from "rxjs";

const url_vozila = "http://localhost:3000/vozila";

export function vratiVozila()
{
    return fetch(url_vozila).then(res => res.json());
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