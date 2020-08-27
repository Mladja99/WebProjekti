import { Component, OnInit } from '@angular/core';
import { CarServiceService } from '../../services/car-service.service';
import { Vehicle } from '../../models/Vehicle';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../models/app-state.model';
import { AddVehicleAction } from '../../actions/vehicles.actions';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-create-vehicle',
  templateUrl: './create-vehicle.component.html',
  styleUrls: ['./create-vehicle.component.css']
})
export class CreateVehicleComponent implements OnInit {

  constructor(private carService:CarServiceService, private route: ActivatedRoute, private _router:Router, private store:Store<AppState>) { }
  vehicle:Vehicle = null;
  ngOnInit(): void {
    this.vehicle = new Vehicle();
  }

  async CreateVehicle()
  {
    if(this.vehicle.manufacturer != null && this.vehicle.type != null)
    {
      
      this.vehicle.id = uuid();
      this.vehicle.status = "Waiting for user to check data";
      this.vehicle.statusType = 0;
      this.store.dispatch(new AddVehicleAction(this.vehicle));
      this._router.navigate([`${"vehicles"}`]);
    }
  }

}
