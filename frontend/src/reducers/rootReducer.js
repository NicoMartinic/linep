import * as ACTION_TYPES from "../actions/action-types";

const initialState = {
    loading: 0,
    loginError: "",
    //modules
    modules: [],
    modulesError: "",
    modulesActionsPermissions: [],
    //users
    isAuthenticated: false,
    userGroup: "",
    user: null,
    users: [],
    usersError: "",
    //notifications
    notifications: [],
    //alerts
    alert: null,
    //initialInfo
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.LOADING_PAGE:
            return {
                ...state,
                loading: state.loading + 1,
            };
        case ACTION_TYPES.STOP_LOADING_PAGE:
            return {
                ...state,
                loading: (state.loading = 0),
            };
        case ACTION_TYPES.LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                loginError: "",
                userGroup: action.payload.group,
            };
        case ACTION_TYPES.LOGIN_FAILURE:
            return {
                ...state,
                loginError: action.payload,
            };
        case ACTION_TYPES.LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                loginError: action.payload,
                userGroup: "",
            };
        // USERS
        case ACTION_TYPES.SET_USERS:
            return {
                ...state,
                users: action.payload,
                usersError: "",
            };
        case ACTION_TYPES.GET_USERS_ERROR:
            return {
                ...state,
                users: [],
                usersError: action.payload,
            };
        // MODULES
        case ACTION_TYPES.SET_MODULES:
            return {
                ...state,
                modules: action.payload,
                modulesError: "",
            };
        case ACTION_TYPES.SET_MODULES_ACTIONS_PERMISSIONS:
            return {
                ...state,
                modulesActionsPermissions: action.payload,
            };
        case ACTION_TYPES.GET_MODULES_ERROR:
            return {
                ...state,
                modules: [],
                modulesError: action.payload,
            };
        // NOTIFICATIONS
        case ACTION_TYPES.SET_NOTIFICATIONS:
            return {
                ...state,
                notifications: action.payload,
            };
        case ACTION_TYPES.APPEND_NOTIFICATION:
            return {
                ...state,
                notifications: [action.payload, ...state.notifications],
            };
        case ACTION_TYPES.SET_ALERT:
            return {
                ...state,
                alert: {
                    message: action.payload.message,
                    type: action.payload.type,
                },
            };
        default:
            return state;
    }
}

export default rootReducer;
