import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../../models/Vehicle';
import { CarServiceService } from '../../services/car-service.service'
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppState } from '../../models/app-state.model';
import { Store } from '@ngrx/store';
import { AddVehicleAction, DeleteVehicleAction, GetVehiclesAction } from '../../actions/vehicles.actions';
@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {

  vehicles: Observable<Array<Vehicle>>;
  loading$: Observable<boolean>;
  errors$: Observable<Error>;

  constructor(private carServiceService : CarServiceService,
    private route: ActivatedRoute, 
    private store:Store<AppState>,
    private _router:Router) { }

  ngOnInit():void {
    this.vehicles = this.store.select(store => store.vehicle.list);
    this.loading$ = this.store.select(store => store.vehicle.loading);
    this.errors$ = this.store.select(store => store.vehicle.error);
    this.store.dispatch(new GetVehiclesAction());
  }

  onEdit(id:string){
    this._router.navigate([`${"edit"}/${id}`]);
  }
  
  onDelete(id: string)
  {
    //this.carServiceService.deleteVehicle(id).subscribe();
    this.store.dispatch(new DeleteVehicleAction(id));
  }

  onRespond(id:string){
    this._router.navigate([`${"respond"}/${id}`]);
  }
}
