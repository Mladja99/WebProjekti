import { Vehicle } from '../models/Vehicle';
import { VehicleAction, VehicleAcionTypes } from '../actions/vehicles.actions';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createSelector, createReducer, on } from '@ngrx/store';
//import * as vehicleActions from '../actions/vehicles.actions';

export interface VehicleState extends EntityState<Vehicle>{
    loading: boolean,
    error: Error
}

export const vehicleAdapter: EntityAdapter<Vehicle> = createEntityAdapter<Vehicle>();

const defaultVehicle = {
    ids: ['123'],
    entities: {
        '123': {
            id: '1',
            manufacturer: "BMW",
            type: "320i E90",
            plateNumber: "NI248VU",
            description: "",
            status: "Waiting for user to check data",
            statusType: 0
        }
    },
    loading: false,
    error: null
}

const initialState: VehicleState = vehicleAdapter.getInitialState(defaultVehicle);



export function VehicleReducer(state: VehicleState = initialState, action: VehicleAction)
{

    switch(action.type){
        case VehicleAcionTypes.GET_VEHICLES:
            return {...state, loading:true};
        case VehicleAcionTypes.GET_VEHICLES_SUCCESS:
            return vehicleAdapter.setAll(action.payload, {...state, loading:false});
        case VehicleAcionTypes.GET_VEHICLES_FAILURE:
            return {...state, error: action.payload, loading: false};
        case VehicleAcionTypes.ADD_VEHICLE:
            return {...state, loading:true};
        case VehicleAcionTypes.ADD_VEHICLE_SUCCESS:
            return vehicleAdapter.addOne(action.payload, {...state, loading: false});
        case VehicleAcionTypes.ADD_VEHICLE_FAILURE:
            return {...state, error: action.payload, loading: false};
        case VehicleAcionTypes.DELETE_VEHICLE:
            return {...state, loading:true};
        case VehicleAcionTypes.DELETE_VEHICLE_SUCCESS:
            return vehicleAdapter.removeOne(action.payload, state);
        case VehicleAcionTypes.DELETE_VEHICLE_FAILURE:
            return {...state, error: action.payload, loading: false};
        default:
            return state;
    }    
}

export const getVehicleState = createFeatureSelector<VehicleState>("vehicle");

export const selectAllEntites = createSelector(getVehicleState, (state:VehicleState) => state.entities);

export const selectAll = createSelector(
    selectAllEntites,
    (entities) => {
        return Object.keys(entities).map(id => entities[id]);
    }  
)

export const selectByIserId = (userId:string) => createSelector(
    selectAllEntites,
    (entities) =>{
        return Object.keys(entities).filter(id => entities[id].userId == userId).map(id => entities[id]);
    }
)
