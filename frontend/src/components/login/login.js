import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConnectButtonCustom from "../common/connect-button/connect-button";
import Accordion from "../common/accordion/accordion";

import { Grid, Box } from "@mui/material";

function Login() {
    const dispatch = useDispatch();
    const loginError = useSelector((state) => state.loginError);

    useEffect(() => {
        document.title = "Log in | LINEP";
    }, []);

    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            height="100%"
            mt={5}
            mx={3}
            width="auto"
        >
            <Grid item xs={12}>
                <Box display="flex" justifyContent="center">
                    <img
                        src={process.env.PUBLIC_URL + "/images/Logo.png"}
                        alt={"Linep logo"}
                        loading="lazy"
                    />
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Box display="flex" justifyContent="center">
                    <ConnectButtonCustom />
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Accordion />
            </Grid>
        </Grid>
    );
}

export default Login;
