
export class View
{
    constructor(parent)
    {
        this.container = document.createElement("div");
        this.container.className = "container";

        this.header = document.createElement("div");
        this.header.className = "header";
        this.container.appendChild(this.header);

        this.mainContainer = document.createElement("div");
        this.mainContainer.className = "main";
        this.container.appendChild(this.mainContainer);

        /*this.ecu = document.createElement("div");
        this.ecu.className = "ecu";
        this.mainContainer.appendChild(this.ecu);

        this.elektrika = document.createElement("div");
        this.elektrika.className = "elektrika";
        this.mainContainer.appendChild(this.elektrika);

        this.mehanika = document.createElement("div");
        this.mehanika.className = "mehanika";
        this.mainContainer.appendChild(this.mehanika);*/

        this.crtajGarazu(this.mainContainer, "ecu");
        this.crtajGarazu(this.mainContainer, "elektrika");
        this.crtajGarazu(this.mainContainer, "mehanika");
        
        parent.appendChild(this.container);
    }

    crtajGarazu(path, name)
    {
        const garaza = document.createElement("div");
        garaza.className = name; // div cele garaze
        const header = document.createElement("div");
        header.className = "header";// div za naslov garaze
        const naslov = document.createElement("h3");
        naslov.innerHTML = name + " garaza";
        header.appendChild(naslov); // dodavanje teksta za naslov garaze
        const data = document.createElement("div");
        data.className = "data"; // div za podatke o vozilima
        //nekako moram da menjam podatke kasnije
        garaza.appendChild(header);
        garaza.appendChild(data);
        path.appendChild(garaza);
    }
    
}