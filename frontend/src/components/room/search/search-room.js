import React, { useEffect, useState } from 'react';
import FilterRooms from './filter-search-room';
import ResultRooms from './result-search-room';

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

        <React.Fragment>
            <FilterRooms 
                setRooms={setRooms} 
                setIsSearching={setIsSearching}
                isSearching={isSearching}
                orderBy={orderBy}
                order={order}
                setOrderBy={setOrderBy}
                setOrder={setOrder}
                pageConfig={pageConfig}
                setPageConfig={setPageConfig}
                setTotalRows={setTotalRows}
            />
            <ResultRooms 
                rooms={rooms} 
                pageConfig={pageConfig}
                setPageConfig={setPageConfig}
                isSearching={isSearching}
                orderBy={orderBy}
                order={order}
                setOrderBy={setOrderBy}
                setOrder={setOrder}
                totalRows={totalRows}
                serverPagintation={true}
                enableClientOrder={true}
                hidePagination={true}
                serverPagination={true}
            />
        </React.Fragment>

        
    );
}

export default HistoryRooms;