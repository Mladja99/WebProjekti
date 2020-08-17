import { Component, OnInit } from '@angular/core';
import { CarServiceService } from '../../services/car-service.service';
import { Vehicle } from '../../models/Vehicle';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-edit-vehicle',
  templateUrl: './edit-vehicle.component.html',
  styleUrls: ['./edit-vehicle.component.css']
})
export class EditVehicleComponent implements OnInit {
  constructor(private carService:CarServiceService, private route: ActivatedRoute, private _router:Router) {

  }
  vehicle:Vehicle = null;
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
    });
  }

  SaveEdit()
  {
    this.carService.editVehicle(this.vehicle).subscribe(veh => console.log(veh));
    this._router.navigate([`${"vehicles"}`]);
  }
}
