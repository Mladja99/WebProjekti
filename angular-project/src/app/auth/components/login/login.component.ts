import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CarServiceService } from '../../../services/car-service.service';
import { User } from '../../../models/User';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private carService:CarServiceService, private route: ActivatedRoute, private _router:Router) { }
  user:User;
  errorMessage:string;
  ngOnInit(): void {
  }
  
  onSubmit(f: NgForm){
    this.carService.login(f.value.username, f.value.password).subscribe(res => {
      if(res == null) this.errorMessage = "Wrong username or password";
      else
      {
        this.errorMessage = "";
        this.user.id = res.id;
        this.user.username = res.username;
        this.user.role = res.role;
      }
    });
  }
}
