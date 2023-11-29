import React from "react";
import { Typography, Grid } from "@mui/material";
//redux
import { useSelector } from "react-redux";
//import use account from wagmi
import { useBalance } from "wagmi";
//numbro
import numbro from "numbro";

function format4Decimals(number) {
    var string = numbro(number).format({
        thousandSeparated: true,
        mantissa: 4,
    });
    return string;
}

function format2Decimals(number) {
    var string = numbro(number).format({
        thousandSeparated: true,
        mantissa: 2,
    });
    return string;
}

//this fails if no public key in store
export default function BalanceCard() {
    const public_key = useSelector((state) => state.user.public_key);

    const { data: balanceETH } = useBalance({
        address: public_key,
        watch: true,
    });

    const { data: balanceTIC } = useBalance({
        address: public_key,
        token: "0x856434e0373Fa984E027f4b04a78cf107Ff06bAA",
        watch: true,
    });

    return (
        <Grid
            container
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <Grid
                item
                display="flex"
                justifyContent="center"
                alignItems="center"
                xs={6}
            >
                <Typography align="center" variant="h4" sx={{ color: "white" }}>
                    {format4Decimals(balanceETH?.formatted)}{" "}
                    {balanceETH?.symbol}
                </Typography>
            </Grid>
            <Grid
                item
                display="flex"
                justifyContent="center"
                alignItems="center"
                xs={6}
            >
                <Typography align="center" variant="h4" sx={{ color: "white" }}>
                    {format2Decimals(balanceTIC?.formatted)}{" "}
                    {balanceTIC?.symbol}
                </Typography>
            </Grid>
        </Grid>
    );
}
