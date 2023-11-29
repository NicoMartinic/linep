import React, { useEffect, useState } from 'react';
import EditFields from './edit-fields-create-room';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { CONFIG } from '../../../config';
import * as ALERT_ACTIONS from '../../../actions/alert-actions';

const CreateRoom = (props) => {

    const [game, setGame] = useState('');
    const [ticketAmmount, setTicketAmmount] = useState('');
    const [invitedPlayers, setInvitedPlayers] = useState([]);
    const [publicOrPrivate, setPublicOrPrivate] = useState(0);
    // const [orderBy, setOrderBy] = useState("player");
    // const [order, setOrder] = useState("desc");
    const [isSearching, setIsSearching] = useState(false);
    const [pageConfig, setPageConfig] = useState({current: 0, size: 10})
    const PublicKeyOfUser = useSelector((state) => state.user.public_key);
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {

        document.title = props.title + " | LINEP";

    }, []);

    const createRoomRequest = () => {
        
        if (!game || game === '' ) {
            dispatch(ALERT_ACTIONS.setAlert({ type: 'error', message: 'You must select a game'}));
        }
        else if (!ticketAmmount || ticketAmmount === '' ) {
            dispatch(ALERT_ACTIONS.setAlert({ type: 'error', message: 'You must select an amount of tickets' }));
        }
        else {
            let filters = {
                amount: ticketAmmount ? ticketAmmount : null,
                public: publicOrPrivate === 0 ? true : false,
                user_public_key: PublicKeyOfUser ? PublicKeyOfUser : null,
                game: game ? game : null,
                players: invitedPlayers ? invitedPlayers : null
            }

            axios.post(CONFIG.API_SERVER_ADDRESS+'/room/create_room', {
                ...filters,
                },
            {
                headers: {
                    'Authorization': 'Token ' + localStorage.getItem("access_token")
                }
            },
            ).then(response => {
                dispatch(ALERT_ACTIONS.setAlert({ type: 'success', message: response.data.msg}));
                history.push('/room/view/' + response.data.data.id)

            })
            .catch(error => {
                console.log(error);
                dispatch(ALERT_ACTIONS.setAlert({ type: 'error', message: error.response.data.error }));
                setIsSearching(false);
            })
    }

    }

  return (
    <>

        <EditFields
            game={game}
            setGame={setGame}
            ticketAmmount={ticketAmmount}
            setTicketAmmount={setTicketAmmount}
            invitedPlayers={invitedPlayers}
            setInvitedPlayers={setInvitedPlayers}
            publicOrPrivate={publicOrPrivate}
            setPublicOrPrivate={setPublicOrPrivate}
            createRoomRequest={createRoomRequest} 
            isSearching={isSearching}
            setIsSearching={setIsSearching}
            pageConfig={pageConfig}
            setPageConfig={setPageConfig}
            
        />

    </>
  );
};

export default CreateRoom;
