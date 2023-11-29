import React, { useEffect } from "react";
import { Grid, Box } from "@mui/material";
import BalanceCard from "../common/balance-card/balance-card";
import TableHeader from "../common/table-header/table-header";
import BuyTicketsForm from "../common/buy-tickets-form/buy-tickets-form";
import SellTicketsForm from "../common/sell-tickets-form/sell-tickets-form";
import RoomsToEnter from "./rooms-to-enter";

function Profile() {
    useEffect(() => {
        document.title = "Home | LINEP";
    }, []);

    return (
        <Box p={2}>
            <TableHeader title="HOME"></TableHeader>
            <Grid container display="flex" width="100%">
                <Grid item xs={12}>
                    <BalanceCard />
                </Grid>
                <Grid item xs={6}>
                    <BuyTicketsForm />
                </Grid>
                <Grid item xs={6}>
                    <SellTicketsForm />
                </Grid>
                <Grid item xs={12}>
                    <RoomsToEnter />
                </Grid>
            </Grid>
        </Box>
    );
}
export default Profile;
