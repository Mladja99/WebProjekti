import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import { CarServiceService } from '../../../services/car-service.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private carService:CarServiceService,
    private _router:Router,
    private cookie: CookieService
    ) { }

  errorMessage:string;

  ngOnInit(): void {
    this.errorMessage = "";
  }

  onSubmit(f: NgForm){
    //ovde proveri da li postoji isti username u bazi
    if(!f.valid)
    {
      this.errorMessage = "Form is not valid";
      return;
    }
    this.carService.usernameAvailable(f.value.username).subscribe(res => {
      if(res.length !=0)
      {
        console.log(res);
        this.errorMessage = "username is already in use";
        return;
      }
      else
      {
        this.carService.register(f.value.username, f.value.password);
      }
    });
  }
}
