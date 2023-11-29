import * as ACTION_TYPES from './action-types';
import axios from 'axios';
import { CONFIG } from '../config';
import * as AUTH_ACTIONS from './auth-actions';
import * as USER_ACTIONS from './user-actions';
import * as MODULES_ACTIONS from './modules-actions';

/************** EJEMPLO DE USO **************/

/*
let data_for_views = {
    datos_x: true,
    modules_actions_permissions: true,
    users: true,
    modules: true
}

dispatch(INITIAL_INFO_ACTIONS.getInitialInfo(data_for_views, true));
*/

export const getInitialInfo = (data_for_views, showSpinner, callback) => {
    return dispatch => {
        if (showSpinner) dispatch(AUTH_ACTIONS.loadingPage());

        axios.post(CONFIG.API_SERVER_ADDRESS+'/initial_info/', data_for_views, {
            headers: {
                'Authorization': 'Token ' + localStorage.getItem("access_token")
            }
        })
        .then(response => {
            dispatch(setInitialInfo(response.data.initial_info, data_for_views));
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            if (showSpinner) dispatch(AUTH_ACTIONS.stopLoadingPage());
            if (callback) callback();
        });
    }
}

export const setInitialInfo = (initial_info, data_for_views) => {
    return dispatch => {
        if(data_for_views.modules_actions_permissions){
            dispatch(setModulesActionsPermissions(initial_info.modules_actions_permissions));
        }
        if (data_for_views.users){
            const parsedUsers = initial_info.users.map((x, index) => ({
                ...x,
                index: index + 1
            }));
            dispatch(USER_ACTIONS.setUsers(parsedUsers));
        }
        if (data_for_views.modules){
            const parsedModules = initial_info.modules.map(x => {return {...x}});
            dispatch(MODULES_ACTIONS.setModules(parsedModules));
        }
    }
}


// export const getInitialInfoError = (error) => {
//     return {
//         type: ACTION_TYPES.GET_INITIAL_INFO_ERROR,
//         payload: error
//     }
// }

export const setModulesActionsPermissions = (modulesActionsPermissions) => {
    return {
        type: ACTION_TYPES.SET_MODULES_ACTIONS_PERMISSIONS,
        payload: modulesActionsPermissions
    }
}