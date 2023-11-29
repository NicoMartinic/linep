import * as ACTION_TYPES from './action-types';
import axios from 'axios';
import { CONFIG } from '../config';
import * as AUTH_ACTIONS from './auth-actions';
import * as ALERT_ACTIONS from '../actions/alert-actions';

export const getProfile = () => {
    return dispatch => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            axios.get(CONFIG.API_SERVER_ADDRESS + '/user/',
                {
                    headers: {
                        'Authorization': 'Token ' + localStorage.getItem("access_token")
                    }
                })
                .then(
                    response => dispatch(setProfile(response.data, { status: null })),
                    error => dispatch(setProfileStatus({ status: 'error' })))
                .catch(error => dispatch(setProfileStatus({ status: 'error' })));
        }
        else {
            dispatch(AUTH_ACTIONS.logoutClient(""));
        }
    }
}

export const updateProfile = (profile) => {
    return dispatch => {
        dispatch(setProfileStatus({ status: 'loading' }));
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            axios.put(CONFIG.API_SERVER_ADDRESS + '/user/profile', profile,
                {
                    headers: {
                        'Authorization': 'Token ' + localStorage.getItem("access_token")
                    }
                })
                .then(
                    response => dispatch(ALERT_ACTIONS.setAlert({ type: 'success', message: 'Datos actualizados correctamente' })),
                    error => dispatch(ALERT_ACTIONS.setAlert({ type: 'error', message: 'Ocurrió un problema, vuelva a intentarlo' })))
                .catch(error => dispatch(ALERT_ACTIONS.setAlert({ type: 'error', message: 'Ocurrió un problema, vuelva a intentarlo' })));
        }
        else {
            dispatch(AUTH_ACTIONS.logoutClient(""));
        }
    }
}

export const updatePassword = (password, new_password) => {
    return dispatch => {
        dispatch(changePassword({ status: 'loading' }));
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            axios.put(CONFIG.API_SERVER_ADDRESS + '/user/change_password', { password, new_password },
                {
                    headers: {
                        'Authorization': 'Token ' + localStorage.getItem("access_token")
                    }
                })
                .then(
                    response => dispatch(changePassword({ status: 'ok' })),
                    error => {
                        dispatch(ALERT_ACTIONS.setAlert({ type: 'error', message: error.response.data.status }));
                        console.log(error.response.data.status)
                    })
                .catch(error => {
                    console.log("error")
                    console.log(error)
                })
        }
        else {
            dispatch(AUTH_ACTIONS.logoutClient(""));
        }
    }
}

export const clearProfileStatus = () => {
    return dispatch => {
        dispatch(clearStatus());
    }
}

export const setUsers = users => {
    return {
        type: ACTION_TYPES.SET_USERS,
        payload: users
    }
}

export const getUsersError = error => {
    return {
        type: ACTION_TYPES.GET_USERS_ERROR,
        payload: error
    }
}

export const setProfile = (profile, result) => {
    return {
        type: ACTION_TYPES.SET_PROFILE,
        payload: { profile, status: result.status }
    }
}

export const setProfileStatus = result => {
    return {
        type: ACTION_TYPES.SET_PROFILE_STATUS,
        payload: result.status
    }
}

export const changePassword = result => {
    return {
        type: ACTION_TYPES.CHANGE_PASSWORD,
        payload: result.status
    }
}

export const clearStatus = () => {
    return {
        type: ACTION_TYPES.CLEAR_STATUS,
        payload: null
    }
}