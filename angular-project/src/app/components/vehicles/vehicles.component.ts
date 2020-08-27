import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../../models/Vehicle';
import { CarServiceService } from '../../services/car-service.service'
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store, createFeatureSelector, ActionReducerMap, createSelector } from '@ngrx/store';
import { AddVehicleAction, DeleteVehicleAction, GetVehiclesAction } from '../../actions/vehicles.actions';
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

  constructor(private carServiceService : CarServiceService,
    private route: ActivatedRoute, 
    private store: Store<AppState>,
    private _router:Router,
    ) { }

  async ngOnInit() {
    // this.store.dispatch(new GetVehiclesAction());
    await this.loadData();
    console.log("data loaded");
    this.loading$ = this.store.select(store => store.vehicle.loading);
    this.errors$ = this.store.select(store => store.vehicle.error);
    await this.populateVehicle();
  }

  async loadData() {
    this.store.dispatch(new GetVehiclesAction());
    console.log("loading data");
  }

  async populateVehicle()
  {
    this.vehicles = this.store.select(fromVehicle.selectAll);
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