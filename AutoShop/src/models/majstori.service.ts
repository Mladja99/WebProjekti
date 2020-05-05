import { Vozilo } from "./vozilo";

const url_majstori = "http://localhost:3000/majstori";

export function vratiMajstore()
{
    return fetch(url_majstori).then(res => res.json());
}