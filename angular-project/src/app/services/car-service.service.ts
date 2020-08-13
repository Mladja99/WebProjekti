import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { Vehicle } from '../models/Vehicle'
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
  constructor(private http:HttpClient) { }
  //vrati vozila iz baze
  getVehicles():Observable<Vehicle[]>{
    return this.http.get<Vehicle[]>(this.vehicleUrl);
  }

  //izmena vozila u bazi


}
