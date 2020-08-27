import { Action } from "@ngrx/store";
import { User } from "../models/User";


export enum UserActionTypes{
    GET_USER = "[USERS] Get User",
    GET_USER_SUCCESS = "[USERS] Get User Success",
    GET_USER_FAILURE = "[USERS] Get User Failure",
    REGISTER_USER = "[USERS] Register User",
    REGISTER_USER_SUCCESS = "[USERS] Register User Success",
    REGISTER_USER_FAILURE = "[USERS] Register User Failure",
    UPDATE_USER = "[USERS] Update User",
    UPDATE_USER_SUCCESS = "[USERS] Update User Success",    
    UPDATE_USER_FAILURE = "[USERS] Update User Failure",
}

export class GetUserAction implements Action{
    readonly type = UserActionTypes.GET_USER;
}

export class GetUserActionSuccess implements Action{
    readonly type = UserActionTypes.GET_USER_SUCCESS;
    constructor(public payload: User){} 
}

export class GetUserActionFailure implements Action{
    readonly type = UserActionTypes.GET_USER_FAILURE;
    constructor(public payload: Error){} 
}

export class RegisterUserAction implements Action{
    readonly type = UserActionTypes.REGISTER_USER;
    constructor(public payload: User){}
}

export class RegisterUserActionSuccess implements Action{
    readonly type = UserActionTypes.REGISTER_USER_SUCCESS;
    constructor(public payload: User){}
}

export class RegisterUserActionFailure implements Action{
    readonly type = UserActionTypes.REGISTER_USER_FAILURE;
    constructor(public payload: Error){}
}

export class UpdateUserAction implements Action{
    readonly type = UserActionTypes.UPDATE_USER;
    constructor(public payload: User){}
}

export class UpdateUserActionSuccess implements Action{
    readonly type = UserActionTypes.UPDATE_USER_SUCCESS;
    constructor(public payload: User){}
}

export class UpdateUserActionFailure implements Action{
    readonly type = UserActionTypes.UPDATE_USER_FAILURE;
    constructor(public payload: Error){}
}

export type UserAction = 
    GetUserAction
    | GetUserActionSuccess
    | GetUserActionFailure
    | UpdateUserAction
    | UpdateUserActionSuccess
    | UpdateUserActionFailure
    | RegisterUserAction
    | RegisterUserActionSuccess
    | RegisterUserActionFailure;