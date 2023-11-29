import React, { useEffect, useState } from 'react';
import HistoryResultsRooms from './result-history-room';
import TableHeader from '../../common/table-header/table-header';
import { Grid } from '@mui/material';


function HistoryRooms(props) {
    
    const [isSearching, setIsSearching] = useState(false);
    const [pageConfig, setPageConfig] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [orderBy, setOrderBy] = useState("created_at");
    const [order, setOrder] = useState("desc");
    const [totalRows, setTotalRows] = useState(0);


    useEffect(()=> {
        document.title = props.title + " | LINEP";
    }, [])


    return (
        <>

            <Grid container display='flex' justifyContent='space-between' alignItems="center">

                <Grid item xs={12} lg={2} pl={2} pt={1}>

                    <TableHeader 
                        title="HISTORY"
                    ></TableHeader>

                </Grid>

            </Grid>

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

                />
            </Grid>

        </>
        
    );
}

export default HistoryRooms;
