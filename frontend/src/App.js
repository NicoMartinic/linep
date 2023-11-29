import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import axios from "axios";

import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as AUTH_ACTIONS from "./actions/auth-actions";
import * as INITIAL_INFO_ACTIONS from "./actions/initial-info-actions";
//import use account from wagmi
import { getAccount } from "@wagmi/core";
//custom components
import Profile from "./components/profile/profile";
import SearchRoom from "./components/room/search/search-room";
import HistoryRoom from "./components/room/history/history-room";
import ViewRoom from "./components/room/view/view-room";
import CreateRoom from "./components/room/create/create-room";
import PageNotFound from "./components/common/page-not-found/page-not-found.js";
import Login from "./components/login/login";
import Spinner from "./components/common/spinner/spinner";
import Header from "./components/common/header/header";
import PlayGame from "./components/game/play-game";

function App(props) {
    const isAuthenticated = useSelector((state) => state.isAuthenticated);
    const user = useSelector((state) => state.user);
    const loading = useSelector((state) => state.loading);
    const modules = useSelector((state) => state.modules);
    const dispatch = useDispatch();
    const [currentPath, setCurrentPath] = useState("/");
    const location = useLocation();

    //wagmi
    const account = getAccount();

    useEffect(() => {
        if (location) {
            if (location.pathname !== "/" && location.pathname !== currentPath)
                setCurrentPath(location.pathname + location.search);
        }
    }, [location]);

    const setHttpInterceptor = () => {
        axios.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                if (error.message.includes("401")) {
                    dispatch(
                        AUTH_ACTIONS.logoutClient("La sesión ha expirado")
                    );
                }
                return Promise.reject(error);
            }
        );
        axios.interceptors.request.use(
            (config) => {
                let a = Number(localStorage.getItem("a"));
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    };

    useEffect(() => {
        setHttpInterceptor();
        dispatch(AUTH_ACTIONS.checkAuth(account?.address));
    }, []);

    const hasPermissionInPath = (pathToCheck, userModules) => {
        let module_tree = pathToCheck.split("/");
        if (module_tree.length > 1) {
            let m = userModules.find((m) => m.url === module_tree[1]);
            if (m) {
                if (module_tree.length > 2) {
                    let s_m = m.submodules.find(
                        (s) => s.url === module_tree[2]
                    );
                    if (s_m) {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }
        return false;
    };

    useEffect(() => {
        if (modules && modules.length > 0) {
            if (
                currentPath === "/" ||
                !hasPermissionInPath(currentPath, modules)
            ) {
                setCurrentPath("/" + modules[0].url);
            }
        }
    }, [modules]);

    useEffect(() => {
        if (isAuthenticated) {
            // WEBSOCKET.initWebSocket(props.store);

            let data_for_views = {
                modules_actions_permissions: true,
                modules: true,
            };

            dispatch(INITIAL_INFO_ACTIONS.getInitialInfo(data_for_views, true));
        }
        // else {
        // 	WEBSOCKET.closeWebSocket();
        // }
    }, [isAuthenticated]);

    return loading !== 0 ? (
        <Spinner></Spinner>
    ) : //else
    !isAuthenticated ? (
        <Switch>
            <Route exact={true} path="/">
                <Login />
            </Route>
            <Route path="*">
                <Redirect to="/"></Redirect>
            </Route>
        </Switch>
    ) : (
        //else
        <div>
            <Header></Header>
            {user ? (
                <Switch>
                    <Route exact={true} path="/">
                        <Redirect to={currentPath}>
                            <Profile title="Profile" />
                        </Redirect>
                    </Route>
                    <Route exact={true} path="/home">
                        <Profile title="Profile" />
                    </Route>
                    <Route exact={true} path="/profile">
                        <Profile title="Profile" />
                    </Route>
                    <Route exact={true} path="/rooms/search">
                        <SearchRoom title="Rooms search" />
                    </Route>
                    <Route exact={true} path="/rooms/history">
                        <HistoryRoom title="Rooms history" />
                    </Route>
                    <Route exact={true} path="/rooms">
                        <HistoryRoom title="Rooms history" />
                    </Route>
                    <Route
                        exact={true}
                        path="/room/view/:id?"
                        render={(props) => (
                            <ViewRoom
                                title="View room"
                                id={props.match.params.id}
                            ></ViewRoom>
                        )}
                    ></Route>
                    <Route exact={true} path="/rooms/create">
                        <CreateRoom title="Create room"></CreateRoom>
                    </Route>

                    <Route
                        exact={true}
                        path="/game/:id?"
                        render={(props) => (
                            <PlayGame
                                title="Game"
                                id={props.match.params.id}
                            ></PlayGame>
                        )}
                    ></Route>

                    <Route path="*">
                        <PageNotFound />
                    </Route>
                </Switch>
            ) : (
                ""
            )}
        </div>
    );
}

export default App;
