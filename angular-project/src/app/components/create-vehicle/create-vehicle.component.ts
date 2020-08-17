import { Component, OnInit } from '@angular/core';
import { CarServiceService } from '../../services/car-service.service';
import { Vehicle } from '../../models/Vehicle';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-vehicle',
  templateUrl: './create-vehicle.component.html',
  styleUrls: ['./create-vehicle.component.css']
})
export class CreateVehicleComponent implements OnInit {

  constructor(private carService:CarServiceService, private route: ActivatedRoute, private _router:Router) { }
  vehicle:Vehicle = null;
  ngOnInit(): void {
    this.vehicle = new Vehicle();
  }
  //Napraviti proveru za id da li postoji !!!
  async CreateVehicle()
  {
    if(this.vehicle.id != null && this.vehicle.manufacturer != null && this.vehicle.type != null)
    {
      await this.carService.createVehicle(this.vehicle);
      this._router.navigate([`${"vehicles"}`]);
    }
  }

}
