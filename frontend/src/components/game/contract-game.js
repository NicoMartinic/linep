import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ABI from '../../utils/tokenContractABI.json';
import * as ALERT_ACTIONS from '../../actions/alert-actions';
const ethers = require("ethers");

const EndGameSC = ({ roomData, setOpenSmartContract}) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contractABI = ABI; // Your ABI here
    const contractAddress = "0x856434e0373Fa984E027f4b04a78cf107Ff06bAA";
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const dispatch = useDispatch();

    async function endGameFunc(id, winner) {
        try {
            const senderAddress = await signer.getAddress();
            if (!senderAddress) {
                throw new Error("No accounts available.");
            }
            
            // Estimate gas
            const gasEstimate = await contract.estimateGas.endGame(id, winner);
            
            const tx = await contract.endGame(id,winner, { gasLimit: gasEstimate });
            const receipt = await tx.wait();
            setOpenSmartContract(false);
            if (receipt.status === 1) {
                dispatch(
                    ALERT_ACTIONS.setAlert({
                        type: "success",
                        message: "The winner is: " + winner + " hash:" + tx.hash,
                    })
                );
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

    useEffect(() => {
        if (roomData && roomData.winner ) endGameFunc(roomData.id, roomData.winner.public_key);
    }, []);

    return (<></>);
};

export default EndGameSC;
