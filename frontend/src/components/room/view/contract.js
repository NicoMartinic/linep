import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ABI from "../../../utils/tokenContractABI.json";
import * as ALERT_ACTIONS from "../../../actions/alert-actions";
import { CONFIG } from "../../../config";
const ethers = require("ethers");

const CreateJoinSC = ({ roomData, setOpenSmartContract }) => {
    // Initialize ethers provider and signer.
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contractABI = ABI; // Your ABI here
    const contractAddress = "0x856434e0373Fa984E027f4b04a78cf107Ff06bAA";
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    async function createGame() {
        try {
            const senderAddress = await signer.getAddress();
            if (!senderAddress) {
                throw new Error("No accounts available.");
            }
            
            // Estimate gas
            const gasEstimate = await contract.estimateGas.createGame(
                roomData.id,
                roomData.players.map((obj) => obj.public_key),
                roomData.tickets,
                roomData.tickets
            );

            const tx = await contract.createGame(
                roomData.id,
                roomData.players.map((obj) => obj.public_key),
                roomData.tickets,
                roomData.tickets,
                { gasLimit: gasEstimate }
            );

            const receipt = await tx.wait();

            if (receipt.status === 1) {

                // Check if the game is in process
                const gameInfo = await contract.games(roomData.id);
                if (gameInfo.inProcess) {
                    readyAllPlayers();
                }

                if (publicKeyOfUser === roomData.created_by.public_key) {
                    readySmartContract();
                    setOpenSmartContract(false);
                }
            } else {
                throw new Error("Transaction failed");
            }
        } catch (error) {
            dispatch(
                ALERT_ACTIONS.setAlert({
                    type: "error",
                    message: error.message,
                })
            );
        }
    }

    async function joinGame() {
        try {
            const senderAddress = await signer.getAddress();
            if (!senderAddress) {
                throw new Error("No accounts available.");
            }
            
            // Estimate gas
            const gasEstimate = await contract.estimateGas.joinGame(
                roomData.id,
                roomData.tickets
            );
            

            const tx = await contract.joinGame(roomData.id, roomData.tickets, { gasLimit: gasEstimate });
            const receipt = await tx.wait();

            if (receipt.status === 1) {
                dispatch(
                    ALERT_ACTIONS.setAlert({
                        type: "success",
                        message: "You have joined the room. Hash: " + tx.hash,
                    })
                );
                setOpenSmartContract(false);
                // Check if the game is in process
                const gameInfo = await contract.games(roomData.id);
                if (gameInfo.inProcess) {
                    readyAllPlayers();
                }
                history.push("/game/" + roomData.id);
            } else {
                throw new Error("Transaction failed");
            }
        } catch (error) {
            dispatch(
                ALERT_ACTIONS.setAlert({
                    type: "error",
                    message: error.message,
                })
            );
        }
    }

    const publicKeyOfUser = useSelector((state) => state.user.public_key);
    const history = useHistory();
    const dispatch = useDispatch();

    const readySmartContract = () => {
        let newValues = {
            user_public_key: publicKeyOfUser ? publicKeyOfUser : null,
            players: null,
            public: null,
            status: null,
            winner: null,
            ready: null,
            delete: null,
            leave: null,
            invited_players: null,
            ready_smart_contract: true,
            all_players_ready_from_smart_contract: null,
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
                        message: "The game is starting.",
                    })
                );
                history.push("/game/" +roomData.id);
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

    const readyAllPlayers = () => {
        let newValues = {
            user_public_key: publicKeyOfUser ? publicKeyOfUser : null,
            players: null,
            public: null,
            status: null,
            winner: null,
            ready: null,
            delete: null,
            leave: null,
            invited_players: null,
            ready_smart_contract: null,
            all_players_ready_from_smart_contract: true,
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
                        message: "The game is starting.",
                    })
                );
                history.push("/game/" +roomData.id);
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
        if (roomData) {
            publicKeyOfUser === roomData.created_by.public_key
                ? createGame()
                : joinGame();
        }
    }, []);

    return <></>;
};

export default CreateJoinSC;
