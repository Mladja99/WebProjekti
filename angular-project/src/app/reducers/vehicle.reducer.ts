import { Vehicle } from '../models/Vehicle';
import { VehicleAction, VehicleAcionTypes } from '../actions/vehicles.actions';

export interface VehicleState{
    list: Vehicle[],
    loading: boolean,
    error: Error
}

var initialState: VehicleState = {
    list: [],
    loading: false,
    error: undefined
};


export function VehicleReducer(state: VehicleState = initialState, action: VehicleAction)
{

    switch(action.type){
        case VehicleAcionTypes.GET_VEHICLES:
            return {...state, loading:true};
        case VehicleAcionTypes.GET_VEHICLES_SUCCESS:
            return {...state, list: action.payload, loading:false};
        case VehicleAcionTypes.GET_VEHICLES_FAILURE:
            return {...state, error: action.payload};
        case VehicleAcionTypes.ADD_VEHICLE:
            return {...state, loading:true};
        case VehicleAcionTypes.ADD_VEHICLE_SUCCESS:
            return {...state, list: action.payload, loading: false};
        case VehicleAcionTypes.ADD_VEHICLE_FAILURE:
            return {...state, error: action.payload};
        case VehicleAcionTypes.DELETE_VEHICLE:
            return {...state, loading:true};
        case VehicleAcionTypes.DELETE_VEHICLE_SUCCESS:
            return {...state, list: state.list.filter(item=> item.id !== action.payload), loading: false};
        case VehicleAcionTypes.DELETE_VEHICLE_FAILURE:
            return {...state, error: action.payload};
        default:
            return state;
    }    
}