import React, { useEffect } from 'react';
import { CONFIG } from '../../../config';
import * as ALERT_ACTIONS from '../../../actions/alert-actions';
import { createUseEffectsForTablePagination } from '../../../common.js'
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import ResultSearchRooms from '../search/result-search-room';


function HistoryResultsRooms(props) {
    
    const PublicKey = useSelector((state) => state.user.public_key);
    
    const restoreFilters = () => {
        props.setOrderBy("created_at");
        props.setOrder("desc");

    }

    const dispatch = useDispatch();

    const searchAllPersonalRooms = (paginationStartIndex, paginationEndIndex, orderBy, order) => {
        props.setIsSearching(true);
        let filters = {
               public_key: PublicKey ? PublicKey : null
        }

        axios.post(CONFIG.API_SERVER_ADDRESS+'/room/search_personal_rooms', {
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

    const [useEffect1, useEffect2, useEffect3] = createUseEffectsForTablePagination(restoreFilters, searchAllPersonalRooms, props, true);
    useEffect(useEffect1.func, useEffect1.deps);
    useEffect(useEffect2.func, useEffect2.deps);
    useEffect(useEffect3.func, useEffect3.deps);


    return (
        <>
            {props.rooms ? 
                <React.Fragment>
                    <ResultSearchRooms 
                        rooms={props.rooms} 
                        pageConfig={props.pageConfig} 
                        setPageConfig={props.setPageConfig}
                        isSearching={props.isSearching}
                        orderBy={props.orderBy}
                        order={props.order}
                        setOrderBy={props.setOrderBy}
                        setOrder={props.setOrder}
                        enableClientOrder={true}
                        serverPagination={true}
                        totalRows={props.totalRows}
                    />
                </React.Fragment>
            : null}
        </>
        
    );
}

export default HistoryResultsRooms;
