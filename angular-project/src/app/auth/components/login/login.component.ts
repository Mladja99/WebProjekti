import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CarServiceService } from '../../../services/car-service.service';
import { User } from '../../../models/User';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private carService:CarServiceService,
    private _router:Router,
    private cookie: CookieService
    ) { }

  errorMessage:string;

  ngOnInit(): void {
  }
  
  onSubmit(f: NgForm){
    this.carService.login(f.value.username, f.value.password).subscribe(res => {
      if(res.length == 0) this.errorMessage = "Wrong username or password";
      else
      {
        this.errorMessage = "";
        this.carService.currentUser = new User();
        this.carService.currentUser.id = res[0].id;
        this.carService.currentUser.username = res[0].username;
        this.carService.currentUser.role = res[0].role;
        this.cookie.set("userId", this.carService.currentUser.id.toString());
        this.cookie.set("username", this.carService.currentUser.username);
        this.cookie.set("role", this.carService.currentUser.role);
        this._router.navigate([`${""}`]);
      }
    });
  }
}
