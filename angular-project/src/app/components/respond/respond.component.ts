import { Component, OnInit } from '@angular/core';
import { CarServiceService } from '../../services/car-service.service';
import { Vehicle } from '../../models/Vehicle';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-respond',
  templateUrl: './respond.component.html',
  styleUrls: ['./respond.component.css']
})
export class RespondComponent implements OnInit {

  constructor(private carService:CarServiceService, private route: ActivatedRoute, private _router:Router) { }
  errorMessage:string = "";
  vehicle:Vehicle = null;
  oldDesc:string = null;
  ngOnInit(): void {
    this.route.paramMap.subscribe(params =>{
      const vehicleId = +params.get('id');
      if(vehicleId)
      {
        this.getSingleVehicle(vehicleId);
      }
    });
  }

  getSingleVehicle(id: number): void{
    this.carService.getSingleVehicle(id).subscribe((vehicle:Vehicle) => { 
      this.vehicle = vehicle;
      this.oldDesc = vehicle.description;
    });
  }

  respond():void{
    if(this.oldDesc != this.vehicle.description || this.vehicle.statusType == 0)
    {
      if(this.vehicle.statusType %2 == 0)
      {
        this.vehicle.statusType = +this.vehicle.statusType + 1;
        this.vehicle.status = "Waiting for mechanic to respond";
      }
      else
      {
        this.vehicle.statusType = +this.vehicle.statusType + 1;
        this.vehicle.status = "Waiting for user to respond";
      }
      this.carService.editVehicle(this.vehicle).subscribe(veh => console.log(veh));
      this._router.navigate([`${"vehicles"}`]);
    }
    else
    {
      this.errorMessage = "you have to set description";
    }
  }
}
