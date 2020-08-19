import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Vehicle } from '../models/Vehicle';
import { IdGenerator } from '../models/IdGenerator';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}
@Injectable({
  providedIn: 'root'
})
export class CarServiceService {

  vehicleUrl:string = 'http://localhost:3000/vehicles';
  idGeneratorUrl:string = 'http://localhost:3000/idGenerator';

  constructor(private http:HttpClient) { }
  //vrati vozila iz baze
  getVehicles():Observable<Vehicle[]>{
    return this.http.get<Vehicle[]>(this.vehicleUrl);
  }

  //vrati vozilo po id
  getSingleVehicle(id:number):Observable<Vehicle>{
    const url:string = this.vehicleUrl+'/'+id;
    return this.http.get<Vehicle>(url,httpOptions);
  }

  //izmeni vozilo u bazi
  editVehicle(vehicle: Vehicle):Observable<any> {
    const url:string = this.vehicleUrl+'/'+vehicle.id;
    return this.http.put(url, vehicle, httpOptions);
  }
  //brisi bozilo u bazi
  deleteVehicle(veh:Vehicle):Observable<any>{
    const url:string = this.vehicleUrl + '/' + veh.id;
    return this.http.delete<Vehicle>(url, httpOptions);
  }
  //dodaj novo vozilo
  createVehicle(veh:Vehicle):Observable<any> {
    const url:string = this.vehicleUrl;
    console.log(veh);
    return this.http.post<Vehicle>(url, veh, httpOptions);
  }
  //vrati sledeci id za vozilo
  getNextGeneratorId():Observable<any>{
    console.log("GetNextGeneratorID funkcija");
    const url:string = this.idGeneratorUrl+ '/' + 0;
    return this.http.get<IdGenerator>(url,httpOptions);
  }
  //povecaj id za vozilo
  incrementGeneratorId(id:IdGenerator):Observable<any>{
    const url:string = this.idGeneratorUrl + '/' + '0';
    console.log("incrementGeneratorId", id, url);
    return this.http.put(url, id, httpOptions);
  }

}
