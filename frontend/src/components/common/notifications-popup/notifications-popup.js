import React, { useEffect } from 'react';
import * as NOTIFICATIONS_ACTIONS from '../../../actions/notifications-actions';
import { useDispatch, useSelector } from 'react-redux';
import { formatDateWithSlashes } from '../../../common';
import { useHistory } from "react-router-dom";

import axios from 'axios';
import { CONFIG } from '../../../config';

function NotificationsPopup(){

    const dispatch = useDispatch();
    const notifications = useSelector(state => state.notifications);
    const history = useHistory();

    useEffect(() => {
        dispatch(NOTIFICATIONS_ACTIONS.getNotifications());
    }, []);

    const handleNotificationClick = (notification) => {
        axios.get(CONFIG.API_SERVER_ADDRESS+'/notification/seen/' + notification.id + '/', {
                headers: {
                    'Authorization': 'Token ' + localStorage.getItem("access_token")
                }
            })
            .then(response => {
                //COMENTO ESTA PARTE PORQUE NO HACE FALTA ACTUALIZAR EL ESTADO GLOBAL, AL HACER REDIRECT SE VUELVE
                //A EJECUTAR EL REQUESTS QUE TRAE LAS NOTIFICACIONES Y AHI YA VIENE COMO LEIDA
                /*let notifs = notifications.map(n => {
                    return {
                        ...n,
                        seen: n.id == notification.id ? true : n.seen
                    }
                });
                dispatch(NOTIFICATIONS_ACTIONS.setNotifications(notifs));*/
                history.push(notification.redirect);
                history.go();
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleSeeAllNotifications = () => {
        history.push("/notifications");
        history.go();
    }

	return (
        <div className="">
            <i className=""></i>
            {
                notifications.filter(n => !n.seen).length > 0 ?
                    <div className="">{notifications.filter(n => !n.seen).length}</div>
                : ''
            }
            <div className="">
                {
                    notifications.slice(0,10).map((notification, index) => 
                        <div key={index} className={"" + (!notification.seen ? "" : "")} onClick={() => handleNotificationClick(notification)}>
                            <div className="">
                                <div className=""></div>
                            </div>
                            <div className="">
                                <div className="">
                                    {notification.text}
                                </div>
                                <div className="">
                                    {formatDateWithSlashes({fecha:notification.created, withoutTime:true, isTodayOrYesterday:false})}
                                </div>
                            </div>
                        </div>    
                    )
                }
                <div className="" onClick={() => handleSeeAllNotifications()}>
                    <div className="">
                        Ver todas las notificaciones
                    </div>
                </div>
            </div>
        </div>
	);
}

export default NotificationsPopup;