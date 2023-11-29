import React, { useEffect } from 'react';
import { CONFIG } from '../../config';
import * as ALERT_ACTIONS from '../../actions/alert-actions';
import { createUseEffectsForTablePagination } from '../../common.js'
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import ResultSearchRooms from '../room/search/result-search-room'


function RoomsToEnterResult(props) {
    
    const PublicKeyOfUser = useSelector((state) => state.user.public_key);
    
    const restoreFilters = () => {
        props.setOrderBy("created_at");
        props.setOrder("desc");

    }

    const dispatch = useDispatch();

    const searchCurrentRoomsToEnter = (paginationStartIndex, paginationEndIndex, orderBy, order) => {
        props.setIsSearching(true);
        let filters = {
               date_since:  null,
               date_until:  null,
               owner:  null,
               player:  null,
               winner:  null,
               amount:  null,
               public:  null,
               status: 'Open',
               user_public_key: PublicKeyOfUser ? PublicKeyOfUser : null,
               game: null,
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

    const [useEffect1, useEffect2, useEffect3] = createUseEffectsForTablePagination(restoreFilters, searchCurrentRoomsToEnter, props, true);
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
                        enableClientOrder={false}
                        serverPagination={false}
                        totalRows={props.totalRows}
                        serverPagintation={false}
                        hidePagination={true}
                    />
                </React.Fragment>
            : null}
        </>
        
    );
}

export default RoomsToEnterResult;
