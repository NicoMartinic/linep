import React, { useEffect, useState, useRef } from "react";
import { Grid, Box, TextField } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import TableHeader from "../common/table-header/table-header";
import * as ALERT_ACTIONS from "../../actions/alert-actions";
import { CONFIG } from "../../config";
import EndGameSC from "./contract-game";

const PlayGame = (props) => {
    const PublicKeyOfUser = useSelector((state) => state.user.public_key);
    const dispatch = useDispatch();
    const [roomData, setRoomData] = useState(null);
    const [winner, setWinner] = useState(null);
    const [openSmartContract, setOpenSmartContract] = useState(false);
    const [interval, setInterval] = useState(0);
    const debounceTimerRef = useRef(null);


    const sendWinner = (winner) => {
        let newValues = {
    
               user_public_key: PublicKeyOfUser ? PublicKeyOfUser : null,
               players:  null,
               public: null,
               status: null,
               winner: winner ? winner : null,
               ready: null,
               delete: null,
               invited_players:  null, 
               leave : null,
               ready_smart_contract : null,
               all_players_ready_from_smart_contract : null,
        }
    
        axios.post(CONFIG.API_SERVER_ADDRESS + '/room/edit_room/' + (roomData.id), {
               ...newValues,
            },
        {
            headers: {
                'Authorization': 'Token ' + localStorage.getItem("access_token")
            }
        },
        ).then(response => {
            setRoomData(response.data.data);
            setWinner(winner); // Set the random winner in the state
            if (PublicKeyOfUser === winner) {
                setOpenSmartContract(true);
            }
            dispatch(
                ALERT_ACTIONS.setAlert({
                    type: "success",
                    message: "The winner is" + winner,
                })
            );
        })
        .catch(error => {
            console.log(error);
            dispatch(ALERT_ACTIONS.setAlert({ type: 'error', message: error.response.data.error }));
        })
    
    }



    const sendRequest = () => {
        let filters = {
            id: props && props.id ? props.id : null,
            public_key: PublicKeyOfUser ? PublicKeyOfUser : null,
        };
        let url = "/room/view/" + props.id;
        axios
            .post(
                CONFIG.API_SERVER_ADDRESS + url,
                {
                    ...filters,
                },
                {
                    headers: {
                        Authorization:
                            "Token " + localStorage.getItem("access_token"),
                    },
                }
            )
            .then((response) => {
                setRoomData(response.data.result);
                if (response.data.result.created_by.public_key === PublicKeyOfUser) {
                    if (response.data.result && !response.data.result.winner && response.data.result.all_players_ready_from_smart_contract && !winner){
                        if (response.data.result && response.data.result.players) {

                            const players = response.data.result.players;
                            const randomIndex = Math.floor(Math.random() * players.length);
                            const randomWinner = players[randomIndex].public_key;
                            sendWinner(randomWinner);
                        }
                    }else{
                        setInterval(interval + 1);
                    }
                } else {
                    if ( response.data.result && response.data.result.winner){
                        if (!winner){
                            setWinner(response.data.result.winner.public_key);
                        }
                        if (PublicKeyOfUser === response.data.result.winner.public_key ) {
                            setOpenSmartContract(true);
                        }
                    }
                    else{
                        setInterval(interval + 1);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                dispatch(
                    ALERT_ACTIONS.setAlert({
                        type: "error",
                        message: error.response.data.error,
                    })
                );
            });
    };

    useEffect(() => {
        document.title = props.title + " | LINEP";
        sendRequest();
    }, []);

    useEffect(() => {
        // Check conditions before setting the interval
        if (roomData && roomData.status === "Playing" && roomData.ready_smart_contract && !roomData.winner){
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = setTimeout(() => {
                sendRequest();
            }, 3000);
        }
    }, [interval]);

    return (
        <>
            {roomData ? (
                <Box p={2}>
                    {openSmartContract ? (
                        <EndGameSC
                            roomData={roomData}
                            setOpenSmartContract={setOpenSmartContract}
                        />
                    ) : null}
                    <TableHeader title="GAME" ></TableHeader>
                    <Grid container display="flex" width="100%">
                        <Grid item xs={12}>
                            <TextField
                                label="Choosing winner"
                                variant="outlined"
                                InputProps={{ readOnly: true }}
                                value={winner}
                                enabledfields={false.toString()}
                                fullWidth
                                readOnly={true}
                            />
                        </Grid>
                    </Grid>
                </Box>
            ) : null}
        </>
    );
};
export default PlayGame;
