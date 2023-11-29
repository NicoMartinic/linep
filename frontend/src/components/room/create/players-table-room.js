import React from 'react';
import { Box, TableCell, IconButton} from '@mui/material';
import GenericTable from '../../common/generic-table/generic-table';
import ClearIcon from '@mui/icons-material/Clear';


const headCells = (headCellPlayer) => {
    let cells = [

        {
            id: 'player',
            numeric: false,
            disablePadding: false,
            label: headCellPlayer,
            disableSort: false,
            width: '0.1%',
        },

        {
            id: 'remove',
            numeric: false,
            disablePadding: false,
            label: 'Remove',
            width: '0.1%',
            disableSort: false
        }
        
    ];

    return cells;
};


function TableCells({row, removeCallback, owner}){

    return(
        <>

            <TableCell 
                sx={{ borderBottom: 'none' }}
                align="left">{row}</TableCell>
            
            {row != owner ? 
            <TableCell 
                sx={{ borderBottom: 'none' }}
                align="left">
                    <IconButton
                        sx={{ 
                            visibility: (true ? "visible" : "hidden"), 
                            /* position: "absolute", 
                            right: "0px", */
                            stroke: "red",
                            strokeWidth: 2,
                            padding: 0
                        }}
                        onClick={(e) => {e.stopPropagation(); removeCallback(row)}}
                    >
                        <ClearIcon />
                    </IconButton>
            </TableCell>
            : 
            <TableCell 
                sx={{ borderBottom: 'none' }}
                align="left">{"Can't remove"}</TableCell>
            }

        </>
    );
}
    
function PlayersTable(props) {

    const removeCallback = (player) => {
        let players = props.players.filter(p => p !== player);
        players.forEach((l, i) => l = (i + 1));
        props.setPlayers(players);
        if (props && props.setEdited){
            props.setEdited(true);
        }
    }

    return (
<       Box sx={{ width: '100%'}}>

            {
                props.players?
                <GenericTable
                    headCells={headCells(props.headCellPlayer)}
                    isSearching={false}
                    rows={props.players}
                    renderCells={(row) => <TableCells row={row} players={props.players} removeCallback={removeCallback} owner={props.owner}></TableCells>}
                    hidePagination={true}
                    serverPagination={false}
                    pageConfig={props.pageConfig}
                    setPageConfig={props.setPageConfig}
                    totalRows={props.totalRows}
                    enableClientOrder={false}
                    
                />

                : ''
            
            }
        </Box>
    );
}

export default PlayersTable;