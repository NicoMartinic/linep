import * as ACTION_TYPES from './action-types';
import axios from 'axios';
import { CONFIG } from '../config';
import * as AUTH_ACTIONS from './auth-actions';

export const setModules = (modules) => {
    return {
        type: ACTION_TYPES.SET_MODULES,
        payload: modules
    }
}

export const getModulesError = (error) => {
    return {
        type: ACTION_TYPES.GET_MODULES_ERROR,
        payload: error
    }
}