import React, { useState } from "react";
import {Grid, TextField, Select, FormControl, MenuItem, Button, Typography} from "@mui/material";
import { useSelector } from "react-redux";
import { useBalance, usePrepareContractWrite, useContractWrite} from "wagmi";

const RegisterForm = () => {
    const [ticketAmount, setTicketAmount] = useState("");
    const [ticketValue, setTicketValue] = useState("");

    //this fails if no public key in store
    const public_key = useSelector((state) => state.user.public_key);
    const {
        data: balanceData,
        isError: balanceError,
        isLoading: balanceLoading,
    } = useBalance({
        address: public_key,
    });

    const { config } = usePrepareContractWrite({
        address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
        abi: [
            {
                name: "mint",
                type: "function",
                stateMutability: "nonpayable",
                inputs: [
                    { internalType: "uint32", name: "tokenId", type: "uint32" },
                ],
                outputs: [],
            },
        ],
        functionName: "mint",
        args: [parseInt(ticketAmount)],
        enabled: Boolean(ticketAmount),
    });

    const { write } = useContractWrite(config);

    //validator functions
    const validateNumber = (num) => {
        const regex = /^[0-9\b]+$/;
        if (num === "" || regex.test(num)) {
            setTicketAmount(num);
            calculateTicketValue(num);
        }
    };

    //custom functions
    function handleSubmit(event) {
        event.preventDefault();
        write?.();
        console.log(ticketAmount);
    }

    function calculateTicketValue(tickets) {
        const value = tickets * 10;
        setTicketValue(value);
    }

    return (
        <>
            <Grid spacing={2} container mb="2rem" pr="0.5rem">
                <Grid item xs={12} md={6} lg={4} mt={2}>
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
                            value={balanceData?.symbol}
                        >
                            <MenuItem value="" disabled>
                                Select a coin
                            </MenuItem>
                            <MenuItem value={balanceData?.symbol}>
                                {balanceData?.symbol}
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
                    <Typography sx={{ color: "white" }}>
                        Total Amount: {ticketValue}
                    </Typography>
                </Grid>
            </Grid>
            <Grid
                container
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Grid container justifyContent="flex-end" mr={5}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={(e) => {
                            handleSubmit(e);
                        }}
                    >
                        Buy Ticket
                    </Button>
                </Grid>
            </Grid>
    </>
    );
};

export default RegisterForm;
