import { Component, OnInit } from '@angular/core';
import { CarServiceService } from '../../services/car-service.service';
import { Vehicle } from '../../models/Vehicle';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-edit-vehicle',
  templateUrl: './edit-vehicle.component.html',
  styleUrls: ['./edit-vehicle.component.css']
})
export class EditVehicleComponent implements OnInit {
  constructor(
    private carService:CarServiceService, 
    private route: ActivatedRoute, 
    private _router:Router
  ) {}
  vehicle:Vehicle = null;
  ngOnInit(): void {
    if(!this.carService.loggedIn())
      this._router.navigate(['']);
    this.route.paramMap.subscribe(params =>{
      const vehicleId = params.get('id');
      if(vehicleId)
      {
        this.getSingleVehicle(vehicleId);
        if(this.carService.getCurrentUserId() != this.vehicle.userId || this.carService.getCurrentUserRole() != "admin")
          this._router.navigate(['']);
      }
    });
  }

  getSingleVehicle(id: string): void{
    this.carService.getSingleVehicle(id).subscribe((vehicle:Vehicle) => { 
      this.vehicle = vehicle;      
      if(vehicle.statusType % 2 === 0 && this.carService.getCurrentUserRole() === 'admin')
        this._router.navigate(['vehicles']);
      else if(vehicle.statusType % 2 === 1 && this.carService.getCurrentUserRole() === 'user')        
        this._router.navigate(['vehicles']);
    });
  }

  SaveEdit()
  {
    this.carService.editVehicle(this.vehicle).subscribe(veh => console.log(veh));
    this._router.navigate([`${"vehicles"}`]);
  }
}
