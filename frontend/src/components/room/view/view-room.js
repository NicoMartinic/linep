import React, { useEffect, useState } from 'react';
import RoomDetails from './detail-room';
import { useSelector, useDispatch } from "react-redux";
import { CONFIG } from '../../../config';
import axios from 'axios';
import { Grid } from '@mui/material';
import * as ALERT_ACTIONS from '../../../actions/alert-actions';


const ViewRoom = (props) => {
  const [roomData, setRoomData] = useState(null);
  const PublicKeyOfUser = useSelector((state) => state.user.public_key);
  const [edited, setEdited] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {

    document.title = props.title + " | LINEP";

    let filters = {
            id: props && props.id ? props.id : null,
            public_key: PublicKeyOfUser ? PublicKeyOfUser : null,
    }
    let url = '/room/view/' + props.id 
    axios.post(CONFIG.API_SERVER_ADDRESS + url, {
            ...filters
        },
    {
        headers: {
            'Authorization': 'Token ' + localStorage.getItem("access_token")
        }
    },
    ).then(response => {
        setRoomData(response.data.result);
    })
    .catch(error => {
        console.log(error);
        dispatch(ALERT_ACTIONS.setAlert({ type: 'error', message: error.response.data.error }));
    })
  }, []);

  return (
    <>

      <Grid>

          {roomData ? 
            <RoomDetails 
              roomData={roomData} setEdited={setEdited} edited={edited} setRoomData={setRoomData}
            /> 
          : 'Loading...'}

      </Grid>

    </>
);

};

export default ViewRoom;