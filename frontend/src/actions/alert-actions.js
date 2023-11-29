import * as ACTION_TYPES from './action-types';

export const setAlert = (alert) => {
    return {
        type: ACTION_TYPES.SET_ALERT,
        payload: alert
    }
}