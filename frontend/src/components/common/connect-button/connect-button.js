import React, {  useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import * as AUTH_ACTIONS from "../../../actions/auth-actions";
import { useSelector, useDispatch } from "react-redux";
import { useAccount } from "wagmi";

export default function ConnectButtonCustom() {
    const dispatch = useDispatch();
    const state = useSelector((state) => state);
    const { isConnected } = useAccount({
        onConnect: ({ address }) => {
            if (isConnected) {
                dispatch(AUTH_ACTIONS.login(address));
            }
        },
        onDisconnect: () => {
            dispatch(AUTH_ACTIONS.logout());
        },
    });

    useEffect(() => {}, []);

    return <ConnectButton />;
}
