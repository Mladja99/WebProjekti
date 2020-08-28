import { Component, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { Router } from '@angular/router';
import { CarServiceService } from '../../services/car-service.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  user:User;
  errorMessage:string
  
  constructor(
    private router:Router, 
    private carService: CarServiceService
  ) { }

  ngOnInit(): void {
    this.carService.getCurrentUser().subscribe(res => 
    {
      if(res)
        this.user = res;
      else
        this.router.navigate(['']);
    });
  }

  onSubmit(f:NgForm)
  {
    if(!f.valid)
    {
      this.errorMessage = "Form is not valid";
      return;
    }    
    this.carService.updateUser(this.user).subscribe(res => console.log(res));
    this.router.navigate([`${""}`]);
  }

}
