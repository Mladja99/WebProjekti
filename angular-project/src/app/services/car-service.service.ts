import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Vehicle } from '../models/Vehicle';
import { IdGenerator } from '../models/IdGenerator';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { CookieService } from 'ngx-cookie-service';

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
  userUrl:string = 'http://localhost:3000/users';
  currentUser:User = null;

  constructor(private http:HttpClient, private cookie:CookieService) { }
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
  //vrati sledeci id za generisanje
  getNextGeneratorId():Observable<any>{
    console.log("GetNextGeneratorID funkcija");
    const url:string = this.idGeneratorUrl+ '/' + 0;
    return this.http.get<IdGenerator>(url,httpOptions);
  }
  //povecaj id za generisanje
  incrementGeneratorId(id:IdGenerator):Observable<any>{
    const url:string = this.idGeneratorUrl + '/' + '0';
    console.log("incrementGeneratorId", id, url);
    return this.http.put(url, id, httpOptions);
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
      // if(this.currentUser == null)
      // {
      //   this.currentUser = new User();
      //   this.currentUser.id = +this.cookie.get("userId");
      //   this.currentUser.username = this.cookie.get("username");
      //   this.currentUser.role = this.cookie.get("role");
      // }
      return true;
    } 
    else 
    {
      if(this.currentUser!=null) this.currentUser = null;
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
  register(username:string, password:string)
  {
    const url:string = this.userUrl;
    var user = new User();
    var gen = new IdGenerator();
    this.getNextGeneratorId().subscribe(res => {
      gen = res;
      user.id=gen.userId;
      gen.userId = +gen.userId + 1;
      user.password = password;
      user.username = username;
      user.role = "user";
      this.incrementGeneratorId(gen).subscribe(res => console.log(res));
      this.http.post<User>(url, user, httpOptions).subscribe(res => 
      {
        console.log(res);
      });
    });
  }
}
