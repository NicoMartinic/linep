import React, { useState } from 'react';
import { Grid, TextField, Box, Select, FormControl, MenuItem, Button, ButtonGroup } from '@mui/material';
import { useDispatch } from "react-redux";
import * as ALERT_ACTIONS from '../../../actions/alert-actions';
import TableHeader from '../../common/table-header/table-header';
import PlayersTable from './players-table-room';

const EditFields = (props) => {

    const dispatch = useDispatch();

    const [invitedPlayerText, setInvitedPlayerText] = useState('')

    const publicPrivateOptions = [
        {value: 0, label: 'Public', callback: () => {props.setPublicOrPrivate(0)}},
        {value: 1, label: 'Private', callback: () => {props.setPublicOrPrivate(1)}}, 
    ];

    const InvitePlayer = (invitedPlayer) => {
        const newValue = invitedPlayer.trim(); // Remove leading and trailing spaces
        if (props.invitedPlayers.length > 9){
            dispatch(ALERT_ACTIONS.setAlert({ type: 'error', message: 'You can not invite more than 10 players'}));
        }
        else if (newValue !== '' && !(props.invitedPlayers.some(player => player === newValue)) ) {
          props.setInvitedPlayers([...props.invitedPlayers, newValue]); // Update the array using spread operator
          setInvitedPlayerText('');
        } 
        else{
            dispatch(ALERT_ACTIONS.setAlert({ type: 'error', message: 'The user you want to add is already invited'}));
        }
    }

    return (
        <>
        <Box p={2}>
           
           <Grid container display='flex' justifyContent='space-between' alignItems="center">

                <Grid item xs={12} lg={2}>

                    <TableHeader 
                        title="CREATE ROOM"
                    ></TableHeader>

                </Grid>

                <Grid container display='flex' justifyContent='flex-end' width="50%" spacing={2}>

                    <Grid item xs={12} lg={3}>

                        <Button
                            onClick={props.createRoomRequest} 
                            variant="contained" 
                            color="success"
                        >
                            Create
                        </Button>

                    </Grid>

                </Grid>

            </Grid>

           <Grid spacing={2} container mb="2rem" pr="0.5rem">

                <Grid item xs={12} md={6} lg={4} mt={2}>

                    <FormControl variant="standard" fullWidth size="small">

                        <Select
                            labelId="game-label-id"
                            id={"game-select"}
                            value={props.game}
                            label="game"
                            onChange={(e) => props.setGame(e.target.value)}
                        >
                            <MenuItem value='' disabled>
                                Select a game
                            </MenuItem>
                            <MenuItem value="Chess">Chess</MenuItem>
                        </Select>

                    </FormControl>

                        <TextField label="Ticket amount" type="text" fullWidth variant="standard" value={props.ticketAmmount} 
                        onChange={(e) => props.setTicketAmmount(e.target.value)} InputProps={{ inputProps: {type: "number", step: "1"} }}
                        />
               
                </Grid>

           <Grid item xs={12} md={6} lg={4}>

                <Grid container>

                    <Grid item xs={10.5}>

                        <TextField type="text" label="Invite player" variant="standard" value={invitedPlayerText} onChange={(e) => setInvitedPlayerText(e.target.value)} fullWidth size="small"/>

                    </Grid>

                    <Grid item xs={1.5} mt={2.3}>
                        <Button
                            onClick={() => {InvitePlayer(invitedPlayerText)}}
                            variant="contained" 
                            color="success"
                            >
                            +
                        </Button>
                    </Grid>
                </Grid>
               
                   <Grid item xs={11.7} mt={1.5}>

                        <PlayersTable
                            players={props.invitedPlayers}
                            setPlayers={props.setInvitedPlayers}
                            totalRows={props.invitedPlayers.length}
                            isSearching={props.isSearching}
                            setIsSearching={props.setIsSearching}
                            pageConfig={props.pageConfig}
                            setPageConfig={props.setPageConfig}
                            headCellPlayer={'Invited Player'}
                            owner={props.PublicKeyOfUser}
                        />

                   </Grid>  
                   
           </Grid>
           
           <Grid item xs={12} md={6} lg={4} mt={2}>

                <ButtonGroup fullWidth className="container-button-group" variant="contained">

                    {publicPrivateOptions.map((e, index) => (
                        <Button 
                            key={e.value + index}
                            onClick={() => { props.setPublicOrPrivate(e.value); e.callback(); }}
                            className={props.publicOrPrivate == e.value ? 'active' : ''}
                        >{e.label}</Button>
                    ))}

                </ButtonGroup>

           </Grid>
           
        </Grid>

    </Box>
    </>
   );
}

export default EditFields;
