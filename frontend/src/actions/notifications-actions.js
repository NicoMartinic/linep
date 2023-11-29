import * as ACTION_TYPES from './action-types';
import axios from 'axios';
import { CONFIG } from '../config';
import * as AUTH_ACTIONS from './auth-actions';

export const getNotifications = () => {
    return dispatch => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken){
            axios.get(CONFIG.API_SERVER_ADDRESS+'/notifications/',
                {
                    headers: {
                        'Authorization': 'Token ' + localStorage.getItem("access_token")
                    }
                })
                .then(response => {
                    const notifications = response.data;
                    dispatch(setNotifications(notifications));              
                })
                .catch(error => {
                    console.log(error.message);
                });
        }
        else {
            dispatch(AUTH_ACTIONS.logoutClient(""));
        }
    }
}

export const setNotifications = notifications => {
    return {
        type: ACTION_TYPES.SET_NOTIFICATIONS,
        payload: notifications
    }
}

export const appendNotificationFromWebSocket = notification => {
    return {
        type: ACTION_TYPES.APPEND_NOTIFICATION,
        payload: notification
    }
}