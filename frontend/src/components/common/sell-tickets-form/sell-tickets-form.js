import React, { useState } from "react";
import {
    Grid,
    TextField,
    Select,
    FormControl,
    MenuItem,
    Button,
    Typography,
} from "@mui/material";
//redux
import { useSelector, useDispatch } from "react-redux";
//import use account from wagmi
import { useBalance, useContractWrite, usePrepareContractWrite } from "wagmi";
// import ABI
import ABI from "../../../utils/tokenContractABI.json";
// import alerts
import * as ALERT_ACTIONS from "../../../actions/alert-actions";

const RegisterForm = () => {
    const [ticketAmount, setTicketAmount] = useState("");

    const dispatch = useDispatch();

    //this fails if no public key in store
    const public_key = useSelector((state) => state.user.public_key);

    //TIC balance
    const { data: balanceTIC } = useBalance({
        address: public_key,
        token: "0x856434e0373Fa984E027f4b04a78cf107Ff06bAA",
    });

    //preparecontract write
    const { config } = usePrepareContractWrite({
        address: "0x856434e0373Fa984E027f4b04a78cf107Ff06bAA",
        abi: ABI,
        functionName: "depositTokensForEth",
        args: [ticketAmount],
        enabled: ticketAmount > 0,
        onError(error) {
            console.log("Error", error);
        },
    });

    const { write } = useContractWrite({
        ...config,
        onSettled(data, error) {
            console.log("Settled", { data, error });
            dispatch(
                ALERT_ACTIONS.setAlert({
                    type: error ? "error" : "success",
                    message: error
                        ? error.details
                        : ` Transaction ${data.hash} sent, check your wallet`,
                })
            );
        },
    });

    //validator functions
    const validateNumber = (num) => {
        const regex = /^[0-9\b]+$/;
        if (num === "" || regex.test(num)) {
            setTicketAmount(num);
        }
    };

    //custom functions
    function handleSubmit(event) {
        event.preventDefault();
        write?.();
        console.log(
            "Sent transaction to MM to SELL " + ticketAmount + " TIC tokens"
        );
    }

    return (
        <>
            <Grid
                spacing={2}
                container
                mb="2rem"
                pr="0.5rem"
                display="flex"
                justifyContent="space-between"
            >
                <Grid item xs={12} md={6} lg={8} mt={2}>
                    <FormControl
                        variant="standard"
                        fullWidth
                        size="small"
                        onSubmit={(e) => {
                            handleSubmit(e);
                        }}
                    >
                        <Select
                            labelId="coin-select-id"
                            id={"coin-select"}
                            label="coin"
                            value={balanceTIC?.symbol}
                        >
                            <MenuItem value="" disabled>
                                Select a coin
                            </MenuItem>
                            <MenuItem value={balanceTIC?.symbol}>
                                {balanceTIC?.symbol}
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Ticket amount"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={ticketAmount}
                        onChange={(e) => validateNumber(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={4} mt={4}>
                    <Grid container display="flex" justifyContent="center">
                        <Grid>
                            <Typography sx={{ color: "white" }}>
                                Total Amount: {ticketAmount}
                            </Typography>
                        </Grid>
                        <Grid
                            container
                            display="flex"
                            justifyContent="center"
                            mt={2}
                        >
                            <Button
                                variant="contained"
                                color="warning"
                                disabled={!write}
                                onClick={(e) => {
                                    handleSubmit(e);
                                }}
                                alignself="right"
                            >
                                Sell tickets
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default RegisterForm;
