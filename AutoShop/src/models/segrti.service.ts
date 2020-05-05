import { Vozilo } from "./vozilo";

const url_segrti = "http://localhost:3000/segrti";

export function vratiSegrte()
{
    return fetch(url_segrti).then(res => res.json());
}