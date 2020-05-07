const url_radionice = "http://localhost:3000/radionice";
export function vratiRadionice()
{
    return fetch(url_radionice).then(res => res.json());
}