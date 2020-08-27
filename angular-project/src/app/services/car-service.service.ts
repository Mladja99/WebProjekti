import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Vehicle } from '../models/Vehicle';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { CookieService } from 'ngx-cookie-service';
import { v4 as uuid } from 'uuid';

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
  userUrl:string = 'http://localhost:3000/users';
  currentUser: User = null;

  constructor(private http:HttpClient, private cookie:CookieService) { }
  //vrati vozila iz baze
  getVehicles():Observable<Vehicle[]>{
    return this.http.get<Vehicle[]>(this.vehicleUrl);
  }

  //vrati vozilo po id
  getSingleVehicle(id:string):Observable<Vehicle>{
    const url:string = this.vehicleUrl+'/'+id;
    return this.http.get<Vehicle>(url,httpOptions);
  }

  //izmeni vozilo u bazi
  editVehicle(vehicle: Vehicle):Observable<any> {
    const url:string = this.vehicleUrl+'/'+vehicle.id;
    return this.http.put(url, vehicle, httpOptions);
  }
  //brisi bozilo u bazi
  deleteVehicle(id:string):Observable<any>{
    const url:string = this.vehicleUrl + '/' + id;
    return this.http.delete(url, httpOptions);
  }
  //dodaj novo vozilo
  createVehicle(veh:Vehicle):Observable<any> {
    const url:string = this.vehicleUrl;
    return this.http.post<Vehicle>(url, veh, httpOptions);
  }
  //user login
  login(username:string, password:string):Observable<any>
  {
    const url:string = this.userUrl + '?username=' + username + "&password=" + password;
    return this.http.get(url,httpOptions);
  }
  //proveri da li je user logovan
  loggedIn():boolean
  {
    if(this.cookie.check("username") && this.cookie.check("userId") && this.cookie.check("role"))
    {
      return true;
    } 
    else 
    {
      return false
    }
  }
  //user logout
  logout()
  {
    this.currentUser = null;
    this.cookie.delete("userId");
    this.cookie.delete("username");
    this.cookie.delete("role");
  }
  //proveri da li postoji username u bazi
  usernameAvailable(username:string):Observable<any>
  {
    const url:string = this.userUrl + '?username=' + username;
    return this.http.get(url,httpOptions);
  }
  //registracija usera
  register(username:string, password:string):Observable<User>
  {
    const url:string = this.userUrl;
    var user = new User();
    user.id = uuid();
    user.password = password;
    user.username = username;
    user.role = "user";
    return this.http.post<User>(url, user, httpOptions);
  }

  //vrati usera po id-u
  getCurrentUser():Observable<any>
  {
    if(this.cookie.check("userId"))
    {
      let id:string = this.cookie.get("userId");
      const url: string = this.userUrl + "/" + id;
      return this.http.get<User>(url,httpOptions);
    }
    throw new Error("No cookie");
  }

  //update usera
  updateUser(user: User):Observable<any>
  {
    const url:string = this.userUrl+'/'+user.id;
    return this.http.put(url, user, httpOptions);
  }
}
