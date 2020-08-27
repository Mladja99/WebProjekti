import { Vehicle } from "./Vehicle";
import { VehicleState } from "../reducers/vehicle.reducer";

export interface AppState{
    readonly vehicle: VehicleState;
}