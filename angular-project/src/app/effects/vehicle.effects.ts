import { Injectable } from "@angular/core";
import { Actions,  Effect, ofType } from '@ngrx/effects';
import { GetVehiclesAction , VehicleAcionTypes, GetVehiclesActionSuccess, GetVehiclesActionFailure, AddVehicleAction, AddVehicleActionSuccess, AddVehicleActionFailure, DeleteVehicleAction, DeleteVehicleActionSuccess, DeleteVehicleActionFailure} from "../actions/vehicles.actions";
import { CarServiceService } from "../services/car-service.service";
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from "rxjs";

@Injectable()
export class VehicleEffects{

    @Effect() getVehicles = this.actions.pipe(
        ofType<GetVehiclesAction>(VehicleAcionTypes.GET_VEHICLES),
        mergeMap(
            () => this.carService.getVehicles().pipe(
                map(data => new GetVehiclesActionSuccess(data)),
                catchError(error => of(new GetVehiclesActionFailure(error))),
            ),
        ),
    );
    
    @Effect() addVehicle = this.actions.pipe(
        ofType<AddVehicleAction>(VehicleAcionTypes.ADD_VEHICLE),
        mergeMap(
            (data) => this.carService.createVehicle(data.payload).pipe(
                map(() => new AddVehicleActionSuccess(data.payload)),
                catchError(error => of(new AddVehicleActionFailure(error)),
                ),
            ),
        ),
    );

    @Effect() deleteVehicle = this.actions.pipe(
        ofType<DeleteVehicleAction>(VehicleAcionTypes.DELETE_VEHICLE),
        mergeMap(
            (data) => this.carService.deleteVehicle(data.payload).pipe(
                map(() => new DeleteVehicleActionSuccess(data.payload)),
                catchError(error => of(new DeleteVehicleActionFailure(error)),
                ),
            ),
        ),
    );

    constructor (private actions: Actions, private carService: CarServiceService)  {}
}