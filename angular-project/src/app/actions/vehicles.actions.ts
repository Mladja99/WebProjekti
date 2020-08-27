import { Action, createAction, props } from '@ngrx/store';
import { Vehicle } from '../models/Vehicle'
import { Update } from '@ngrx/entity';

export enum VehicleAcionTypes{
    GET_VEHICLES = '[VEHICLES] Get Items',
    GET_VEHICLES_SUCCESS = '[VEHICLES] Get Items Success',
    GET_VEHICLES_FAILURE = '[VEHICLES] Get Items Faliure',
    ADD_VEHICLE = '[VEHICLES] Add Item',
    ADD_VEHICLE_SUCCESS = '[VEHICLES] Add Item Success',
    ADD_VEHICLE_FAILURE = '[VEHICLES] Add Item Faliure',
    DELETE_VEHICLE = '[VEHICLES] Delete Item',
    DELETE_VEHICLE_SUCCESS = '[VEHICLES] Delete Item Success',
    DELETE_VEHICLE_FAILURE = '[VEHICLES] Delete Item Faliure',
}

export class GetVehiclesAction implements Action{
    readonly type = VehicleAcionTypes.GET_VEHICLES;
}

export class GetVehiclesActionSuccess implements Action{
    readonly type = VehicleAcionTypes.GET_VEHICLES_SUCCESS;

    constructor(public payload: Array<Vehicle>){}
}

export class GetVehiclesActionFailure implements Action{
    readonly type = VehicleAcionTypes.GET_VEHICLES_FAILURE;

    constructor(public payload: Error){}
}

export class AddVehicleAction implements Action{
    readonly type = VehicleAcionTypes.ADD_VEHICLE;
    
    constructor(public payload: Vehicle){}
}

export class AddVehicleActionSuccess implements Action{
    readonly type = VehicleAcionTypes.ADD_VEHICLE_SUCCESS;

    constructor(public payload: Vehicle){}
}

export class AddVehicleActionFailure implements Action{
    readonly type = VehicleAcionTypes.ADD_VEHICLE_FAILURE;

    constructor(public payload: Error){}
}

export class DeleteVehicleAction implements Action{
    readonly type = VehicleAcionTypes.DELETE_VEHICLE;
    
    constructor(public payload: string){}
}

export class DeleteVehicleActionSuccess implements Action{
    readonly type = VehicleAcionTypes.DELETE_VEHICLE_SUCCESS;

    constructor(public payload: string){}
}

export class DeleteVehicleActionFailure implements Action{
    readonly type = VehicleAcionTypes.DELETE_VEHICLE_FAILURE;

    constructor(public payload: Error){}
}

export type VehicleAction = 
    GetVehiclesAction 
    | GetVehiclesActionSuccess
    | GetVehiclesActionFailure
    | AddVehicleAction 
    | AddVehicleActionSuccess
    | AddVehicleActionFailure
    | DeleteVehicleAction
    | DeleteVehicleActionSuccess
    | DeleteVehicleActionFailure;