import React from 'react';
import { Box, TableCell } from '@mui/material';
import GenericTable from '../../common/generic-table/generic-table';
import { useHistory } from "react-router-dom";


const headCells = () => {
    let cells = [

        {
            id: 'created_at',
            numeric: false,
            disablePadding: false,
            label: 'Date'
        },

        {
            id: 'game',
            numeric: false,
            disablePadding: false,
            label: 'Game'
        },
        
        {
            id: 'status',
            numeric: false,
            disablePadding: false,
            label: 'Status'
        },

        {
            id: 'tickets',
            numeric: false,
            disablePadding: false,
            label: 'Amount'
        },

        {
            id: 'public',
            numeric: false,
            disablePadding: false,
            label: 'Public'
        },

        {
            id: 'created_by',
            numeric: false,
            disablePadding: false,
            label: 'Owner'
        },

        {
            id: 'winner',
            numeric: false,
            disablePadding: false,
            label: 'Winner'
        },

        {
            id: 'players',
            numeric: false,
            disablePadding: false,
            label: 'Players',
            disableSort: true,
        },
    ];

    return cells;
};


function TableCells({row}){

    return(
        <>

            <TableCell 
                sx={{ borderBottom: 'none' }}
                align="left">{row.created_at}</TableCell>
            
            <TableCell 
                sx={{ borderBottom: 'none' }}
                align="left">{row.game ? row.game : ' -'}</TableCell>

            <TableCell 
                sx={{ borderBottom: 'none' }}
                align="left">{row.status}</TableCell>
            
            <TableCell 
                sx={{ borderBottom: 'none' }}
                align="left">{row.tickets}</TableCell>
            
            <TableCell 
                sx={{ borderBottom: 'none' }}
                align="left">{row.public ? 'Yes' : 'No'}</TableCell>

            <TableCell 
                sx={{ borderBottom: 'none' }}
                align="left">{row.created_by.public_key}</TableCell>
            <TableCell 
                sx={{ borderBottom: 'none' }}
                align="left">{row.winner ? row.winner.public_key : 'No winner yet'}</TableCell>

            <TableCell 
                sx={{ borderBottom: 'none' }}
                align="left">
                {row.players.map(player => player.public_key).join(', ')}</TableCell>
        </>
    );
}
    
function RoomResults(props) {

    const history = useHistory();

    const getUrlForRedirect = (rowId) =>{
        if(rowId !== null){
            history.push('/room/view/' +rowId)
        }   else {
            history.push('/room/history')
        }

    }

    return (
        <Box sx={{ width: '99%', ml: 1, py: 2 }} >

            {
                props.rooms?
                <GenericTable
                    headCells={headCells()}
                    isSearching={props.isSearching}
                    rows={props.rooms}
                    renderCells={(row) => <TableCells row={row} rooms={props.rooms}></TableCells>}
                    hidePagination={props.hidePagination}
                    serverPagination={props.serverPagination}
                    pageConfig={props.pageConfig}
                    setPageConfig={props.setPageConfig}
                    totalRows={props.totalRows}
                                    //variable de order son undefined o el enableClientOrder es undefined, segun el uso
                    orderBy={props.orderBy}
                    order={props.order}
                    setOrderBy={props.setOrderBy}
                    setOrder={props.setOrder}
                    enableClientOrder={props.enableClientOrder}
                    onClickRow={(rowId) => {return getUrlForRedirect(rowId)}}
                    
                />

                : ''
            
            }
        </Box>
    );
}

export default RoomResults;