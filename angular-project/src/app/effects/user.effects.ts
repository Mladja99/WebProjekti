import { Actions, Effect, ofType } from "@ngrx/effects";
import { CarServiceService } from "../services/car-service.service";
import { Injectable } from "@angular/core";
import { GetUserAction, UserActionTypes, GetUserActionSuccess, GetUserActionFailure, UpdateUserAction, UpdateUserActionSuccess, UpdateUserActionFailure, RegisterUserActionSuccess, RegisterUserActionFailure, RegisterUserAction } from "../actions/user.actions";
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from "rxjs";

@Injectable()
export class UserEffects{

    @Effect() getCurrentUser = this.actions.pipe(
        ofType<GetUserAction>(UserActionTypes.GET_USER),
        mergeMap(
            () => this.carService.getCurrentUser().pipe(
                map(data => new GetUserActionSuccess(data)),
                catchError(error => of(new GetUserActionFailure(error))),
            ),
        ),
    );

    @Effect() updateUser = this.actions.pipe(
        ofType<UpdateUserAction>(UserActionTypes.UPDATE_USER),
        mergeMap(
            (data) => this.carService.updateUser(data.payload).pipe(
                map(data => new UpdateUserActionSuccess(data)),
                catchError(error => of(new UpdateUserActionFailure(error))),
            ),
        ),
    );

    @Effect() registerUser = this.actions.pipe(
        ofType<RegisterUserAction>(UserActionTypes.REGISTER_USER),
        mergeMap(
            (data) => this.carService.register(data.payload.username, data.payload.password).pipe(
                map(data => new RegisterUserActionSuccess(data)),
                catchError(error => of(new RegisterUserActionFailure(error))),
            ),
        ),
    );

    constructor (private actions: Actions, private carService: CarServiceService)  {}
}