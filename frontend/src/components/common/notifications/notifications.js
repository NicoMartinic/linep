import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as NOTIFICATIONS_ACTIONS from '../../../actions/notifications-actions';
import { formatDateWithSlashes } from '../../../common';
import axios from 'axios';
import { CONFIG } from '../../../config';
import { useHistory } from "react-router-dom";

function Notifications() {

    const dispatch = useDispatch();
    const notifications = useSelector(state => state.notifications);
    const [selected_notifications, setSelectedNotifications] = useState([]);
    const [filter_only_unseen, setFilterOnlyUnseen] = useState(false);
    const history = useHistory();
    const [sliceTo, setSliceTo] = useState(10);
    const [is_fetching, setIsFetching] = useState(false);

    const handleOnClickNotification = (notification) => {
        axios.get(CONFIG.API_SERVER_ADDRESS + '/notification/seen/' + notification.id + '/', {
            headers: {
                'Authorization': 'Token ' + localStorage.getItem("access_token")
            }
        })
            .then(response => {
                history.push(notification.redirect);
                history.go();
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleOnSelectedNotificationsChanged = (e) => {
        e.stopPropagation();
        let selected_options = [...selected_notifications];
        if (e.target.checked) {
            selected_options.push(e.target.value);
            setSelectedNotifications(selected_options);
        } else {
            setSelectedNotifications(selected_options.filter(id => id !== e.target.value));
        }
    }

    const handleSaveSeenMarks = (seen) => {
        axios.put(CONFIG.API_SERVER_ADDRESS + '/notification/seen/', {
            notifications: selected_notifications,
            seen: seen
        },
            {
                headers: {
                    'Authorization': 'Token ' + localStorage.getItem("access_token")
                }
            })
            .then(response => {
                setSelectedNotifications([]);
                dispatch(NOTIFICATIONS_ACTIONS.getNotifications());
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleScroll = () => {
        if (document.body.scrollHeight !== document.body.scrollTop + window.innerHeight) {
            setIsFetching(true);
        }
    }

    const fetchMoreListItems = () => {
        setTimeout(() => {
            let newSliceTo = sliceTo + 10;
            setSliceTo(newSliceTo);
            setIsFetching(false);
        }, 1000);
    }

    useEffect(() => {
        dispatch(NOTIFICATIONS_ACTIONS.getNotifications());
        document.title = "Notificaciones | LINEP";
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!is_fetching) return;
        fetchMoreListItems();
    }, [is_fetching]);

    return (
        <div className="">
            <div className="">
                <div className="">
                    <label htmlFor="only-unseen-false">
                        <input type="radio" id="only-unseen-false" name="only-unseen" value="false" onClick={() => setFilterOnlyUnseen(false)} defaultChecked />
                        Todas
                    </label>
                    <label htmlFor="only-unseen-true">
                        <input type="radio" id="only-unseen-true" name="only-unseen" value="true" onClick={() => setFilterOnlyUnseen(true)} />
                        No leídas
                    </label>
                </div>
                <div className="">
                    <button type="button" className={"" + (selected_notifications.length > 0 ? "" : "")} onClick={() => handleSaveSeenMarks(true)}>Marcar como leídas <i className=""></i></button>
                </div>
            </div>
            <div className="">
                {notifications.filter(notification => filter_only_unseen ? !notification.seen : true).slice(0, sliceTo).map((notification) =>
                    <div className={"" + (!notification.seen ? "" : "")}>
                            <div className="">
                            {!notification.seen ?
                                <div className="">
                                    <input type="checkbox" name="selected" value={(notification.id)} checked={selected_notifications.includes(notification.id + "")} onChange={handleOnSelectedNotificationsChanged}></input>
                                </div>
                                : ''
                            }
                            </div>
                        <div className="" onClick={() => handleOnClickNotification(notification)}>
                            <div className="">
                                {notification.text}
                            </div>
                            <div className="">
                                {formatDateWithSlashes({fecha:notification.created, withoutTime:true, isTodayOrYesterday:false})}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default Notifications;