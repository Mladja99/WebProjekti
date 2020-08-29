import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../../models/Vehicle';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../models/app-state.model';
import { AddVehicleAction } from '../../actions/vehicles.actions';
import { v4 as uuid } from 'uuid';
import { CarServiceService } from '../../services/car-service.service';

@Component({
  selector: 'app-create-vehicle',
  templateUrl: './create-vehicle.component.html',
  styleUrls: ['./create-vehicle.component.css']
})
export class CreateVehicleComponent implements OnInit {

  constructor(
    private carService: CarServiceService,
    private _router:Router, 
    private store:Store<AppState>
  ) { }
  vehicle:Vehicle = null;
  ngOnInit(): void {
    if(!this.carService.loggedIn())
      this._router.navigate(['']);
    this.vehicle = new Vehicle();
  }

  async CreateVehicle()
  {
    if(this.vehicle.manufacturer != null && this.vehicle.type != null)
    {
      
      this.vehicle.id = uuid();
      this.vehicle.status = "Waiting for mechanic to respond";
      this.vehicle.statusType = 1;
      this.vehicle.userId = this.carService.getCurrentUserId();
      this.store.dispatch(new AddVehicleAction(this.vehicle));
      this._router.navigate([`${"vehicles"}`]);
    }
  }

}
