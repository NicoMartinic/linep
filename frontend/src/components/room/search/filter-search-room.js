import React, { useEffect, useState } from 'react';
import { CONFIG } from '../../../config';
import * as ALERT_ACTIONS from '../../../actions/alert-actions';
import { Grid, TextField, Box, Stack, Button, ButtonGroup, MenuItem, Select, FormControl} from '@mui/material';
import axios from 'axios';
import { createUseEffectsForTablePagination, convertDateToLastHour, convertDateToCeroHours } from '../../../common.js'
import { useSelector, useDispatch } from "react-redux";
import TableHeader from '../../common/table-header/table-header';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

function FilterForRooms(props) {

    const [dateSince, setDateSince] = useState(null);
    const [dateUntil, setDateUntil] = useState(null);
    const [ticketAmmount, setTicketAmmount] = useState('');
    const [publicOrPrivate, setPublicOrPrivate] = useState(0);
    const [owner, setOwner] = useState('');
    const [winner, setWinner] = useState('');
    const [player, setPlayer] = useState('');
    const [status, setStatus] = useState('');
    const [game, setGame] = useState('');
    const PublicKeyOfUser = useSelector((state) => state.user.public_key);

    

    const dispatch = useDispatch();

    const restoreFilters = () => {
        setDateSince(null);
        setDateUntil(null);
        setTicketAmmount('');
        setPublicOrPrivate(0);
        setOwner('');
        setWinner('');
        setPlayer('');
        setStatus('');
        setGame('');
    }

    const publicPrivateOptions = [
        {value: 0, label: 'All', callback: () => {setPublicOrPrivate(0)}},
        {value: 1, label: 'Public', callback: () => {setPublicOrPrivate(1)}}, 
        {value: 2, label: 'Private', callback: () => {setPublicOrPrivate(2)}},
    ];

    const searchAllRooms = (paginationStartIndex, paginationEndIndex, orderBy, order) => {
        props.setIsSearching(true);
        let filters = {
               date_since: dateSince ? dateSince : null,
               date_until: dateUntil ? dateUntil : null,
               owner: owner ? owner : null,
               player: player ? player : null,
               winner: winner ? winner : null,
               amount: ticketAmmount ? ticketAmmount : null,
               public: publicOrPrivate ? publicOrPrivate : null,
               status: status ? status : null,
               user_public_key: PublicKeyOfUser ? PublicKeyOfUser : null,
               game: game ? game : null,
        }

        axios.post(CONFIG.API_SERVER_ADDRESS+'/room/search_rooms', {
               ...filters,
                start: paginationStartIndex,
                end: paginationEndIndex,
                order_by: orderBy,
                order: order
            },
        {
            headers: {
                'Authorization': 'Token ' + localStorage.getItem("access_token")
            }
        },
        ).then(response => {
            props.setRooms(response.data.result);
            props.setTotalRows(response.data.total_rows);
            props.setIsSearching(false);

        })
        .catch(error => {
            console.log(error);
            dispatch(ALERT_ACTIONS.setAlert({ type: 'error', message: error.response.data.error }));
            props.setIsSearching(false);
        })

    }


    const [useEffect1, useEffect2, useEffect3] = createUseEffectsForTablePagination(restoreFilters, searchAllRooms, props, true);
    useEffect(useEffect1.func, useEffect1.deps);
    useEffect(useEffect2.func, useEffect2.deps);
    useEffect(useEffect3.func, useEffect3.deps);


    return (
         <Box p={2}>
            <TableHeader 
                title="FILTERS TO SEARCH"
            ></TableHeader>

            <Grid spacing={2} container mb="2rem" pr="0.5rem">

            <Grid item xs={12} md={6} lg={4}>

                <TextField type="text" label="Owner" variant="standard" value={owner} onChange={(e) => setOwner(e.target.value)} fullWidth size="small"/>

                <TextField type="text" label="Winner" variant="standard" value={winner} onChange={(e) => setWinner(e.target.value)} fullWidth size="small"/>

                <TextField type="text" label="Players" variant="standard" value={player} onChange={(e) => setPlayer(e.target.value)} fullWidth size="small"/>

                
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
                <Grid container>
                    <Grid item xs={6} pr={2}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker 
                                label="Date since"
                                inputFormat="dd/MM/yyyy"
                                value={dateSince}
                                onChange={(value) => setDateSince(convertDateToCeroHours(value))}
                                inputProps={{ readOnly: true,}}
                                renderInput={(params) => 
                                    <TextField {...params} variant="standard" fullWidth/>
                                }
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6} pl={2}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                label="Date until"
                                inputFormat="dd/MM/yyyy"
                                value={dateUntil}
                                onChange={(value) => setDateUntil(convertDateToLastHour(value))}
                                inputProps={{ readOnly: true,}}
                                fullWidth
                                renderInput={(params) => 
                                    <TextField {...params} variant="standard" fullWidth/>
                                }
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
                
                <Grid container>
                    <Grid item xs={6} pr={2} >
                        <TextField 
                            label="Ticket amount" 
                            type="text" 
                            fullWidth 
                            variant="standard" 
                            value={ticketAmmount} 
                            onChange={(e) => setTicketAmmount(e.target.value)}
                            InputProps={{ inputProps: {type: "number", step: "1"} 
                            }}
                        />
                    </Grid>  

                    <Grid item xs={6} pl={2} pt={2}>
                        <FormControl variant="standard" fullWidth size="small">
                            <Select
                                labelId="status-labe-id"
                                id={"status-select"}
                                value={status}
                                label="Status"
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <MenuItem value='' disabled>
                                    Select a status
                                </MenuItem>
                                <MenuItem value="Open">Open</MenuItem>
                                <MenuItem value="Playing">Playing</MenuItem>
                                <MenuItem value="Closed">Closed</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    
                </Grid>

                <TextField type="text" label="Game" variant="standard" value={game} onChange={(e) => setGame(e.target.value)} fullWidth size="small"/>

            </Grid>
            
            <Grid item xs={12} md={6} lg={4} mt={2}>
                <ButtonGroup fullWidth className="container-button-group" variant="contained">
                    {publicPrivateOptions.map((e, index) => (
                        <Button 
                            key={e.value + index}
                            onClick={() => { setPublicOrPrivate(e.value); e.callback(); }}
                            className={publicOrPrivate == e.value ? 'active' : ''}
                        >{e.label}</Button>
                    ))}
                </ButtonGroup>
            </Grid>
            
            </Grid>

            <Grid spacing={2} container pr="0.5rem">
                <Grid item xs={12} md={5}>
                    <Stack direction="row" spacing={2}>
                        <Button
                            onClick={() => {props.setPageConfig({current: 0, size: props.pageConfig ? props.pageConfig.size : 10})}}
                            variant="contained"
                            color={!props.isSearching ? "success" : "darkGrey"}
                            className={!props.isSearching ? "" : "not-allowed"}
                            >
                            {props.isSearching ? "Searching" : "Search"}
                        </Button>
                        <Button 
                            onClick={restoreFilters}
                            variant="contained" 
                            color="primary"
                            endIcon={<RestartAltIcon />}>
                            Restore filters
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    )
}

export default FilterForRooms;