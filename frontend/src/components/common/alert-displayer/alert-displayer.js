import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as ALERT_ACTIONS from '../../../actions/alert-actions';
import { Button } from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';

let timeOutFunc = null;

function AlertDisplayer(props) {

    const dispatch = useDispatch();
    const alert = useSelector(state => state.alert);
    const alertContainer = useRef(null);
    const buttonCross = useRef(null);
    const [localAlert, setLocalAlert] = useState("");

    const triggerAlertAnimation = (type, animation) => {
        if (alertContainer && alertContainer.current) {
            if (buttonCross && buttonCross.current) {
                var button = buttonCross.current //la cruz de cerrar
                button.style.opacity = '1';

            }
            var div = alertContainer.current;
            div.style.display = 'flex';
            div.style.zIndex = '111111';
            var text = alertContainer.current.children[0]; //"alert-top"
            text.classList.remove("alert-fade");
            div.classList.remove("bg-nav-error");
            div.classList.remove("bg-nav-success");
            div.classList.remove("error-anim");
            div.classList.remove("success-anim");
            void div.offsetWidth; //lo que hace toda la magia para que se resetee la animacion
            void text.offsetWidth;
            div.classList.add(type);

            if (props.doAnimation) {
                div.classList.add(animation);
                text.classList.add("alert-fade");
                if (timeOutFunc !== null) {
                    clearTimeout(timeOutFunc);
                }

                timeOutFunc = setTimeout(() => {
                    div.style.display = 'none';
                }, 15000);
            }
        }
    }

    useEffect(() => {
        if (alert && alert.type && alert.message) {
            setLocalAlert(alert);
            switch (alert.type) {
                case 'success': {
                    triggerAlertAnimation("bg-nav-success", "success-anim");
                    break;
                }
                case 'error': {
                    triggerAlertAnimation("bg-nav-error", "error-anim");
                    break;
                }
                default:
                    break;
            }
            dispatch(ALERT_ACTIONS.setAlert({ type: '', message: '' }));
        }
    }, [alert]);

    const closeAlert = (e) => {
        if (alertContainer && alertContainer.current && props.doAnimation) {
            var alert = alertContainer.current
            alert.style.display = 'none';
            var cross = e.currentTarget
            cross.style.opacity = '0';

        }
    }

    return (
        <div ref={alertContainer} className="alert-container" style={{ ...props.styles, position: 'fixed', display: 'flex', justifyContent: 'center' }}>
            <div className="alert-top" style={{ minHeight: props.styles.minHeight ? props.styles.minHeight : '40px' }}>
                {localAlert && localAlert.type === "success" ?
                    <CheckCircleIcon color="white" sx={{ top: '', right: '3px', position: 'relative' }} />
                    : localAlert && localAlert.type === "error" ?
                        <ErrorIcon color="white" sx={{ top: '', right: '3px', position: 'relative' }} />
                        : ''}
                {localAlert ? localAlert.message : ''}
            </div>
            {alertContainer && alertContainer.current && props.doAnimation ?
                <Button  className="button-cross" ref={buttonCross}onClick={(e) => { closeAlert(e) }} sx={{ color: 'white', top: '5px', right: '3px', position: 'absolute' }}><CloseIcon /></Button>
                : ''}
        </div>

    )
}

export default AlertDisplayer;