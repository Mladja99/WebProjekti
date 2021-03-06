import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../../models/Vehicle';
import { CarServiceService } from '../../services/car-service.service'
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { DeleteVehicleAction, GetVehiclesAction } from '../../actions/vehicles.actions';
import * as fromVehicle from '../../reducers/vehicle.reducer';
import { AppState } from '../../models/app-state.model';
@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {

  vehicles: Observable<Array<Vehicle>>;
  loading$: Observable<boolean> = null;
  errors$: Observable<Error>;
  errorMessage: string = "";
  constructor(
    private carServiceService : CarServiceService,
    private store: Store<AppState>,
    private _router:Router,
    ) { }

  async ngOnInit() {
    if(!this.carServiceService.loggedIn())
    {
      this._router.navigate(['']);
    }
    await this.loadData();
    this.loading$ = this.store.select(store => store.vehicle.loading);
    this.errors$ = this.store.select(store => store.vehicle.error);
    await this.populateVehicle();
  }

  async loadData() {
    this.store.dispatch(new GetVehiclesAction());
  }

  async populateVehicle()
  {
    if(this.carServiceService.getCurrentUserRole() == "admin")
    {
      this.vehicles = this.store.select(fromVehicle.selectAll);
    }
    else
    {
      let id = this.carServiceService.getCurrentUserId();
      this.vehicles = this.store.select(fromVehicle.selectByIserId(id));
    }
  }

  onEdit(id:string){
    this.carServiceService.getSingleVehicle(id).subscribe(res=>{
      if(res.statusType %2 == 0 && this.carServiceService.getCurrentUserRole() === 'user')
      {
        this._router.navigate([`${"edit"}/${id}`]);
      }
      else if(res.statusType %2 == 1 && this.carServiceService.getCurrentUserRole() === 'admin')
      {
        this._router.navigate([`${"edit"}/${id}`]);
      }
      else this.errorMessage = "You cant edit chossen vehicle, you have to wait for respond";
    });
  }
  
  onDelete(id: string)
  {
    this.carServiceService.getSingleVehicle(id).subscribe(res=>{
      if(res.statusType %2 == 0 && this.carServiceService.getCurrentUserRole() === 'user')
      {
        this.store.dispatch(new DeleteVehicleAction(id));
      }
      else if(res.statusType %2 == 1 && this.carServiceService.getCurrentUserRole() === 'admin')
      {
        this.store.dispatch(new DeleteVehicleAction(id));
      }
      else this.errorMessage = "You cant delete chossen vehicle, you have to wait for respond";
    });
    
  }

  respond(vehicle:Vehicle){
    if(vehicle.statusType %2 == 0 && this.carServiceService.getCurrentUserRole() === 'user')
    {
      vehicle.statusType = +vehicle.statusType + 1;
      vehicle.status = "Waiting for mechanic to respond";
      this.carServiceService.editVehicle(vehicle).subscribe(veh => console.log(veh));
      window.location.reload(false);
    }
    else if(vehicle.statusType %2 == 1 && this.carServiceService.getCurrentUserRole() === 'admin')
    {
      vehicle.statusType = +vehicle.statusType + 1;
      vehicle.status = "Waiting for user to respond";
      this.carServiceService.editVehicle(vehicle).subscribe(veh => console.log(veh));
      window.location.reload(false);
    }
    else this.errorMessage = "You cant respond to chossen vehicle, you have to wait for respond";
  }
}