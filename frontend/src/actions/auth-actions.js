import * as ACTION_TYPES from "./action-types";
import axios from "axios";
import { CONFIG } from "../config";

export const checkAuth = (address) => {
    return async (dispatch) => {
        if (address) {
            dispatch(loadingPage());
            await dispatch(login(address));
        } else {
            dispatch(stopLoadingPage());
        }
    };
};

export const login = (address) => {
    return async (dispatch) => {
        dispatch(apiLogin(address));
    };
};

export const loadingPage = () => {
    return {
        type: ACTION_TYPES.LOADING_PAGE,
    };
};

export const stopLoadingPage = () => {
    return {
        type: ACTION_TYPES.STOP_LOADING_PAGE,
    };
};

export const loginSuccess = (user, group) => {
    return {
        type: ACTION_TYPES.LOGIN_SUCCESS,
        payload: { user: user, group: group },
    };
};

export const loginFailure = (error) => {
    return {
        type: ACTION_TYPES.LOGIN_FAILURE,
        payload: error,
    };
};

export const logoutClient = (error) => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("group");
    return {
        type: ACTION_TYPES.LOGOUT,
        payload: error,
    };
};

export const apiLogin = (address) => {
    return (dispatch) => {
        return axios
            .post(CONFIG.API_SERVER_ADDRESS + "/create_login_user", {
                public_key: address,
            })
            .then(async (response) => {
                const user = { ...response.data };
                const token = response.data.token;
                const group =
                    response.data.groups && response.data.groups[0]
                        ? response.data.groups[0].name
                        : "";
                localStorage.setItem("access_token", token);
                localStorage.setItem("group", group);
                await dispatch(loginSuccess(user, group));
                dispatch(stopLoadingPage());
            })
            .catch((error) => {
                console.log(error);
            });
    };
};

export const logout = (error) => {
    return (dispatch) => {
        axios
            .get(CONFIG.API_SERVER_ADDRESS + "/logout", {
                headers: {
                    Authorization:
                        "Token " + localStorage.getItem("access_token"),
                },
            })
            .then((response) => {
                dispatch(logoutClient(error));
            })
            .catch((error) => {
                console.log(error);
                dispatch(logoutClient(""));
            });
    };
};

// const accessToken = localStorage.getItem("access_token");
// if (accessToken) {
//     // dispatch(loadingPage());
//     //NOT NEEDED --> 'loading' in initial state set to 1 before do anything
//     axios
//         .get(CONFIG.API_SERVER_ADDRESS + "/user", {
//             headers: {
//                 Authorization: "Token " + accessToken,
//             },
//         })
//         .then((response) => {
//             const public_key = response.data.public_key;
//             const group =
//                 response.data.groups && response.data.groups[0]
//                     ? response.data.groups[0].name
//                     : "";
//             localStorage.setItem("group", group);
//             if (public_key && public_key !== "") {
//                 const user = { ...response.data };
//                 dispatch(loginSuccess(user, group));
//             } else {
//                 dispatch(logout("La sesión ha expirado"));
//             }
//         })
//         .catch((error) => {
//             console.log(error);
//         })
//         .finally(() => {
//             dispatch(stopLoadingPage());
//         });
// } else {
//     dispatch(logoutClient(""));
//     dispatch(stopLoadingPage());
// }
