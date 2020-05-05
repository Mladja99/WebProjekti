import { Vozilo } from "./vozilo";

const url_vozila = "http://localhost:3000/vozila";

export function vratiVozila()
{
    return fetch(url_vozila).then(res => res.json());
}