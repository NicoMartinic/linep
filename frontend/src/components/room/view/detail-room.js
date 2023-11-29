import React, { useState, useEffect, useRef } from "react";
import { Grid, TextField, Box, Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import PlayersTable from "../create/players-table-room";
import { useDispatch } from "react-redux";
import * as ALERT_ACTIONS from "../../../actions/alert-actions";
import { CONFIG } from "../../../config";
import axios from "axios";
import { useHistory } from "react-router-dom";
import CreateJoin from "./contract";

const RoomDetails = ({ roomData, setEdited, edited, setRoomData }) => {
    const [isSearching, setIsSearching] = useState(false);
    const [pageConfig, setPageConfig] = useState({ current: 0, size: 10 });
    const PublicKeyOfUser = useSelector((state) => state.user.public_key);
    const [invitedPlayers, setInvitedPlayers] = useState([]);
    const [players, setPlayers] = useState([]);
    const [invitedPlayerText, setInvitedPlayerText] = useState("");
    const [enter, setEnter] = useState(false);
    const [ready, setReady] = useState(false);
    const debounceTimerRef = useRef(null);
    const [interval, setInterval] = useState(0);
    const [openSmartContract, setOpenSmartContract] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();

    const SaveChanges = () => {
        setIsSearching(true);
        let newValues = {
            user_public_key: PublicKeyOfUser ? PublicKeyOfUser : null,
            all_players_ready_from_smart_contract: null,
            players: players && players.length > 0 ? players : null,
            public: null,
            status: null,
            winner: null,
            ready: null,
            delete: null,
            invited_players:
                invitedPlayers && invitedPlayers.length > 0
                    ? invitedPlayers
                    : null,
            ready_smart_contract: null,
        };

        axios
            .post(
                CONFIG.API_SERVER_ADDRESS + "/room/edit_room/" + roomData.id,
                {
                    ...newValues,
                },
                {
                    headers: {
                        Authorization:
                            "Token " + localStorage.getItem("access_token"),
                    },
                }
            )
            .then((response) => {
                dispatch(
                    ALERT_ACTIONS.setAlert({
                        type: "success",
                        message: "You have successfully saved the changes",
                    })
                );
                let varPlayers = players;
                let varInvitedPlayers = invitedPlayers;
                setPlayers(varPlayers);
                setInvitedPlayerText(varInvitedPlayers);
                let newRoomData = roomData;
                newRoomData.players = varPlayers;
                newRoomData.invitedPlayer = varInvitedPlayers;
                setRoomData(newRoomData);
                setIsSearching(false);
            })
            .catch((error) => {
                console.log(error);
                dispatch(
                    ALERT_ACTIONS.setAlert({
                        type: "error",
                        message: error.response.data.error,
                    })
                );
                setIsSearching(false);
            });
    };

    const EnterRoom = () => {
        setIsSearching(true);
        let newValues = {
            user_public_key: PublicKeyOfUser ? PublicKeyOfUser : null,
            all_players_ready_from_smart_contract: null,
            players: PublicKeyOfUser ? PublicKeyOfUser : null,
            public: null,
            status: null,
            winner: null,
            ready: null,
            delete: null,
            leave: null,
            invited_players: null,
            ready_smart_contract: null,
        };

        axios
            .post(
                CONFIG.API_SERVER_ADDRESS + "/room/edit_room/" + roomData.id,
                {
                    ...newValues,
                },
                {
                    headers: {
                        Authorization:
                            "Token " + localStorage.getItem("access_token"),
                    },
                }
            )
            .then((response) => {
                dispatch(
                    ALERT_ACTIONS.setAlert({
                        type: "success",
                        message: "You have entered the room successfully",
                    })
                );
                setIsSearching(false);
                let varPlayers = players;
                varPlayers.push(PublicKeyOfUser);
                setPlayers(varPlayers);
                let newRoomData = roomData;
                newRoomData.players = varPlayers;
                setRoomData(newRoomData);
                setEnter(true);
            })
            .catch((error) => {
                console.log(error);
                dispatch(
                    ALERT_ACTIONS.setAlert({
                        type: "error",
                        message: error.response.data.error,
                    })
                );
                setIsSearching(false);
            });
    };

    const LeaveRoom = () => {
        setIsSearching(true);
        const filteredPlayers = players.filter(
            (player) => player !== PublicKeyOfUser
        );

        let newValues = {
            user_public_key: PublicKeyOfUser ? PublicKeyOfUser : null,
            all_players_ready_from_smart_contract: null,
            players: null,
            public: null,
            status: null,
            winner: null,
            ready: null,
            delete: null,
            leave: filteredPlayers ? filteredPlayers : null,
            invited_players: null,
            ready_smart_contract: null,
        };

        axios
            .post(
                CONFIG.API_SERVER_ADDRESS + "/room/edit_room/" + roomData.id,
                {
                    ...newValues,
                },
                {
                    headers: {
                        Authorization:
                            "Token " + localStorage.getItem("access_token"),
                    },
                }
            )
            .then((response) => {
                dispatch(
                    ALERT_ACTIONS.setAlert({
                        type: "success",
                        message: "You have successfully left the room",
                    })
                );
                setIsSearching(false);
                setPlayers(filteredPlayers);
                let newRoomData = roomData;
                newRoomData.players = filteredPlayers;
                setRoomData(newRoomData);
                setEnter(false);
                history.push("/rooms/history");
            })
            .catch((error) => {
                console.log(error);
                dispatch(
                    ALERT_ACTIONS.setAlert({
                        type: "error",
                        message: error.response.data.error,
                    })
                );
                setIsSearching(false);
            });
    };

    const DeleteRoom = () => {
        setIsSearching(true);

        let newValues = {
            user_public_key: PublicKeyOfUser ? PublicKeyOfUser : null,
            all_players_ready_from_smart_contract: null,
            players: null,
            public: null,
            status: null,
            winner: null,
            ready: null,
            delete: true,
            leave: null,
            invited_players: null,
            ready_smart_contract: null,
        };

        axios
            .post(
                CONFIG.API_SERVER_ADDRESS + "/room/edit_room/" + roomData.id,
                {
                    ...newValues,
                },
                {
                    headers: {
                        Authorization:
                            "Token " + localStorage.getItem("access_token"),
                    },
                }
            )
            .then((response) => {
                dispatch(
                    ALERT_ACTIONS.setAlert({
                        type: "success",
                        message: "You have successfully deleted the room",
                    })
                );
                setIsSearching(false);
                history.push("/rooms/history");
            })
            .catch((error) => {
                console.log(error);
                dispatch(
                    ALERT_ACTIONS.setAlert({
                        type: "error",
                        message: error.response.data.error,
                    })
                );
                setIsSearching(false);
            });
    };

    const ReadyRoom = (timerRequest) => {
        setIsSearching(true);

        let newValues = {
            user_public_key: PublicKeyOfUser ? PublicKeyOfUser : null,
            all_players_ready_from_smart_contract: null,
            players: null,
            public: null,
            status: null,
            winner: null,
            ready: timerRequest ? true : null,
            delete: null,
            leave: null,
            invited_players: null,
            ready_smart_contract: null,
        };

        axios
            .post(
                CONFIG.API_SERVER_ADDRESS + "/room/edit_room/" + roomData.id,
                {
                    ...newValues,
                },
                {
                    headers: {
                        Authorization:
                            "Token " + localStorage.getItem("access_token"),
                    },
                }
            )
            .then((response) => {
                setInterval(interval + 1);
                if (roomData != response.data.data) setRoomData(response.data.data)

                if (response.data.data.status === "Playing") {
                    setIsSearching(false);
                    setReady(true);
                    if (
                        (roomData.created_by.public_key === PublicKeyOfUser &&
                            response.data.data.status === "Playing" &&
                            !response.data.data.ready_smart_contract) ||
                        response.data.data.ready_smart_contract
                    ) {
                        setOpenSmartContract(true);
                    }
                    if (
                        response.data.data.created_by.public_key ===
                        PublicKeyOfUser
                    ) {
                        dispatch(
                            ALERT_ACTIONS.setAlert({
                                type: "success",
                                message:
                                    "All the players are ready, sign the transfer of Tickets to start playing",
                            })
                        );
                    } else {
                        if (
                            response.data.data.created_by.public_key !=
                                PublicKeyOfUser &&
                            response.data.data.ready_smart_contract
                        ) {
                            dispatch(
                                ALERT_ACTIONS.setAlert({
                                    type: "success",
                                    message:
                                        "All the players are ready, sign the transfer of Tickets to start playing",
                                })
                            );
                        }
                    }
                } else {
                    if (timerRequest){
                        dispatch(
                            ALERT_ACTIONS.setAlert({
                                type: "success",
                                message: "You are ready to play",
                            })
                        );
                        setIsSearching(false);
                        setReady(true);
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
                setIsSearching(false);
            });
    };

    useEffect(() => {
        // Check conditions before setting the interval
        if (roomData && !roomData.ready_smart_contract && !openSmartContract) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = setTimeout(() => {
                ReadyRoom(false);
            }, 3000);
        }
    }, [interval]);

    useEffect(() => {
        let varInvitedPlayers = [];
        let varPlayers = [];
        if (
            roomData &&
            roomData.invited_players &&
            roomData.invited_players.length > 0
        ) {
            varInvitedPlayers = roomData.invited_players.map(
                (player) => player.public_key
            );
            setInvitedPlayers(varInvitedPlayers);
        }
        if (roomData && roomData.players && roomData.players.length > 0) {
            varPlayers = roomData.players.map((player) => player.public_key);
            setPlayers(varPlayers);
        }
    }, [roomData]);

    const InvitePlayer = (invitedPlayer) => {
        const newValue = invitedPlayer.trim(); // Remove leading and trailing spaces
        if (invitedPlayers.length > 9) {
            dispatch(
                ALERT_ACTIONS.setAlert({
                    type: "error",
                    message: "You can not invite more than 10 players",
                })
            );
        } else if (
            newValue !== "" &&
            !invitedPlayers.some((player) => player === newValue) &&
            !players.some((player) => player === newValue)
        ) {
            setInvitedPlayers([...invitedPlayers, newValue]); // Update the array using spread operator
            setInvitedPlayerText("");
            setEdited(true);
        } else {
            dispatch(
                ALERT_ACTIONS.setAlert({
                    type: "error",
                    message:
                        "The user you want to add is already invited or a player already",
                })
            );
        }
    };

    return (
        <>
            {roomData ? (
                <Box p={2}>
                    {openSmartContract ? (
                        <CreateJoin roomData={roomData} setOpenSmartContract={setOpenSmartContract} />
                    ) : null}
                    <Grid
                        container
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Grid item xs={12} lg={2}>
                            <Typography
                                variant="h4"
                                sx={{
                                    color: (theme) =>
                                        theme.palette.lightGrey.main,
                                }}
                            >
                                ROOM DETAILS
                            </Typography>
                        </Grid>
                        <Grid
                            container
                            display="flex"
                            justifyContent="flex-end"
                            width="60%"
                        >
                            {edited ? (
                                <Grid item xs={12} lg={3}>
                                    <Button
                                        onClick={() => SaveChanges()}
                                        variant="contained"
                                        color="success"
                                        fullWidth
                                    >
                                        Save changes
                                    </Button>
                                </Grid>
                            ) : null}
                            {roomData && roomData.invited_players ? (
                                roomData.status === "Open" &&
                                !enter &&
                                (roomData.invited_players.some(
                                    (player) =>
                                        player.public_key === PublicKeyOfUser
                                ) ||
                                    (roomData.public &&
                                        !roomData.players.some(
                                            (player) =>
                                                player.public_key ===
                                                PublicKeyOfUser
                                        ))) ? (
                                    <Grid item xs={6} lg={3}>
                                        <Button
                                            onClick={() => EnterRoom()}
                                            variant="contained"
                                            color="success"
                                            fullWidth
                                        >
                                            Enter Room
                                        </Button>
                                    </Grid>
                                ) : roomData.status === "Open" &&
                                  (enter ||
                                      (roomData.players &&
                                          roomData.players.some(
                                              (player) =>
                                                  player.public_key ===
                                                  PublicKeyOfUser
                                          ))) ? (
                                    <Grid
                                        container
                                        display="flex"
                                        justifyContent="flex-end"
                                        width="60%"
                                        spacing={1}
                                    >
                                        {!ready && roomData.players.length > 1? (
                                            <Grid item xs={6} lg={3}>
                                                <Button
                                                    onClick={() =>
                                                        ReadyRoom(true)
                                                    }
                                                    variant="contained"
                                                    fullWidth
                                                    color="success"
                                                >
                                                    Accept match
                                                </Button>
                                            </Grid>
                                        ) : null}
                                        {roomData.created_by.public_key !==
                                        PublicKeyOfUser ? (
                                            <Grid item xs={6} lg={3}>
                                                <Button
                                                    onClick={() => LeaveRoom()}
                                                    variant="contained"
                                                    fullWidth
                                                    color="error"
                                                >
                                                    Leave room
                                                </Button>
                                            </Grid>
                                        ) : roomData.status === "Open" ? (
                                            <Grid item xs={6} lg={3}>
                                                <Button
                                                    onClick={() => DeleteRoom()}
                                                    variant="contained"
                                                    fullWidth
                                                    color="error"
                                                >
                                                    Delete room
                                                </Button>
                                            </Grid>
                                        ) : null}
                                    </Grid>
                                ) : null
                            ) : null}
                        </Grid>
                    </Grid>

                    <Grid spacing={2} container mb="2rem" pr="0.5rem">
                        <Grid item xs={12} md={6} lg={4}>
                            <Grid container>
                                <TextField
                                    label="Id"
                                    variant="outlined"
                                    InputProps={{ readOnly: true }}
                                    value={roomData.id}
                                    enabledfields={false.toString()}
                                    fullWidth
                                    readOnly={true}
                                />

                                <TextField
                                    label="Game"
                                    variant="outlined"
                                    InputProps={{ readOnly: true }}
                                    value={roomData.game ? roomData.game : " -"}
                                    enabledfields={false.toString()}
                                    fullWidth
                                    readOnly={true}
                                />
                            </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <Grid container>
                                <TextField
                                    label="Owner"
                                    variant="outlined"
                                    InputProps={{ readOnly: true }}
                                    value={roomData.created_by.public_key}
                                    enabledfields={false.toString()}
                                    fullWidth
                                    readOnly={true}
                                />

                                <TextField
                                    label="Players"
                                    variant="outlined"
                                    InputProps={{ readOnly: true }}
                                    value={players
                                        .map((player) => player)
                                        .join(", ")}
                                    enabledfields={false.toString()}
                                    fullWidth
                                    readOnly={true}
                                />
                            </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <Grid container>
                                <TextField
                                    label="Winner"
                                    variant="outlined"
                                    InputProps={{ readOnly: true }}
                                    value={
                                        roomData.winner
                                            ? roomData.winner.public_key
                                            : "No winner yet"
                                    }
                                    enabledfields={false.toString()}
                                    fullWidth
                                    readOnly={true}
                                />

                                {roomData.created_by.public_key !==
                                    PublicKeyOfUser ||
                                roomData.status !== "Open" ? (
                                    <TextField
                                        label="Invited players"
                                        variant="outlined"
                                        InputProps={{ readOnly: true }}
                                        value={
                                            invitedPlayers
                                                ? invitedPlayers
                                                      .map((player) => player)
                                                      .join(", ")
                                                : "Not invited players"
                                        }
                                        enabledfields={false.toString()}
                                        fullWidth
                                        readOnly={true}
                                    />
                                ) : (
                                    <Grid container>
                                        <Grid xs={10.5}>
                                            <TextField
                                                type="text"
                                                label="Invite player"
                                                variant="standard"
                                                value={invitedPlayerText}
                                                onChange={(e) =>
                                                    setInvitedPlayerText(
                                                        e.target.value
                                                    )
                                                }
                                                fullWidth
                                                size="small"
                                            />
                                        </Grid>

                                        <Grid xs={1.5} pt={2.5} pl={1.5}>
                                            <Button
                                                onClick={() => {
                                                    InvitePlayer(
                                                        invitedPlayerText
                                                    );
                                                }}
                                                variant="contained"
                                                color="success"
                                                //</Grid>endIcon={<CheckCircleOutlineIcon />}
                                            >
                                                +
                                            </Button>
                                        </Grid>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <Grid container>
                                <TextField
                                    label="Tickets"
                                    variant="outlined"
                                    InputProps={{ readOnly: true }}
                                    value={
                                        roomData.tickets
                                            ? roomData.tickets
                                            : "No winner yet"
                                    }
                                    enabledfields={false.toString()}
                                    fullWidth
                                    readOnly={true}
                                />

                                <TextField
                                    label="Date"
                                    variant="outlined"
                                    InputProps={{ readOnly: true }}
                                    value={roomData.created_at}
                                    enabledfields={false.toString()}
                                    fullWidth
                                    readOnly={true}
                                />
                            </Grid>
                        </Grid>

                        {roomData.created_by.public_key === PublicKeyOfUser &&
                        players &&
                        roomData.status === "Open" ? (
                            <Grid item xs={4} mt={1}>
                                <PlayersTable
                                    players={players}
                                    setPlayers={setPlayers}
                                    totalRows={players.length}
                                    isSearching={isSearching}
                                    setIsSearching={setIsSearching}
                                    pageConfig={pageConfig}
                                    setPageConfig={setPageConfig}
                                    headCellPlayer={"Player"}
                                    owner={PublicKeyOfUser}
                                    setEdited={setEdited}
                                />
                            </Grid>
                        ) : null}

                        {roomData.created_by.public_key === PublicKeyOfUser &&
                        invitedPlayers &&
                        roomData.status === "Open" ? (
                            <Grid item xs={4} mt={1}>
                                <PlayersTable
                                    players={invitedPlayers}
                                    setPlayers={setInvitedPlayers}
                                    totalRows={invitedPlayers.length}
                                    isSearching={isSearching}
                                    setIsSearching={setIsSearching}
                                    pageConfig={pageConfig}
                                    setPageConfig={setPageConfig}
                                    headCellPlayer={"Invited player"}
                                    owner={PublicKeyOfUser}
                                    setEdited={setEdited}
                                />
                            </Grid>
                        ) : null}
                    </Grid>
                </Box>
            ) : null}
        </>
    );
};

export default RoomDetails;
