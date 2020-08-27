import { User } from '../models/User';
import { UserAction, UserActionTypes } from "../actions/user.actions";

export interface UserState
{
    list: User;
    error: Error;
}

var initialState: UserState = {
    list: null,
    error: undefined
};

export function UserReducer(state: UserState = initialState, action: UserAction)
{
    switch(action.type)
    {
        case UserActionTypes.GET_USER:
            return state;
        case UserActionTypes.GET_USER_SUCCESS:
            return {...state, list: action.payload};
        case UserActionTypes.GET_USER_FAILURE:
            return {...state, error: action.payload};
        case UserActionTypes.REGISTER_USER:
            return state;
        case UserActionTypes.REGISTER_USER_SUCCESS:
            return {...state, list: action.payload};
        case UserActionTypes.REGISTER_USER_FAILURE:
            return {...state, error: action.payload};
        case UserActionTypes.UPDATE_USER:
            return state;
        case UserActionTypes.UPDATE_USER_SUCCESS:
            return {...state, list: action.payload};
        case UserActionTypes.UPDATE_USER_FAILURE:
            return {...state, error: action.payload};
        default:
            return state;
    }
}
