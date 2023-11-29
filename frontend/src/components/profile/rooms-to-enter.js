import React, { useState } from 'react';
import HistoryResultsRooms from './result-rooms-to-enter';
import { Grid } from '@mui/material';


function RoomsToEnter() {
    
    const [isSearching, setIsSearching] = useState(false);
    const [pageConfig, setPageConfig] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [orderBy, setOrderBy] = useState("created_at");
    const [order, setOrder] = useState("desc");
    const [totalRows, setTotalRows] = useState(0);



    return (
        <>

            <Grid pl={1}>
                <HistoryResultsRooms 
                    rooms={rooms} 
                    totalRows={totalRows}
                    setTotalRows={setTotalRows}
                    setRooms={setRooms}
                    setPageConfig={setPageConfig}
                    setIsSearching={setIsSearching}
                    pageConfig={pageConfig} 
                    isSearching={isSearching}
                    orderBy={orderBy}
                    order={order}
                    setOrderBy={setOrderBy}
                    setOrder={setOrder}
                    serverPagintation={false}
                    enableClientOrder={false}
                    hidePagination={false}
                    serverPagination={false}

                />
            </Grid>

        </>
        
    );
}

export default RoomsToEnter;
