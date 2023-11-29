import React, { useEffect, useState } from "react";
import * as ALERT_ACTIONS from "../../../actions/alert-actions";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { CONFIG } from "../../../config";
import { Button, ButtonGroup } from "@mui/material";
import ConfirmModal from "../confirm-modal/confirm-modal";
import { getTodayDate } from "../../../common";
// import * as WEBSOCKET from '../../../websocket/websocket'

let timeoutFunc = null;

let intervalToCheck = 1500; //1.5 segundos

function Reports(props) {
    const dispatch = useDispatch();
    const [modalOpened, setModalOpened] = useState(false);
    const [fileType, setFileType] = useState("");
    const [isLoadingReport, setIsLoadingReport] = useState(false);
    const [modalHideActions, setModalHideActions] = useState(false);

    const [subscriptionId, setSubscriptionId] = useState(null);

    const getGeneratedReport = (task_id) => {
        axios
            .post(
                CONFIG.API_SERVER_ADDRESS + "/get_generated_report",
                {
                    task_id: task_id,
                },
                {
                    headers: {
                        Authorization:
                            "Token " + localStorage.getItem("access_token"),
                    },
                    responseType: "blob",
                }
            )
            .then((response) => {
                //SI DEVUELVE JSON NO ES EL PDF/XLS
                response.data
                    .text()
                    .then((maybeJson) => {
                        let parsed = JSON.parse(maybeJson);
                        if (parsed && parsed.not_ready) {
                            //todavia no esta listo hay que seguir esperando AHRE
                        }
                    })
                    .catch((e) => {
                        //FALLA EL JSON, SERIA EL BLOB
                        let blob = new Blob([response.data], {
                            type: response.data.type,
                        });
                        let data = window.URL.createObjectURL(blob);
                        let link = document.createElement("a");
                        link.href = data;
                        let file_name;
                        if (props.fecha) {
                            let fecha = props.fecha;
                            file_name = `${props.outputFilename} ${fecha}`;
                        } else {
                            let today = getTodayDate();
                            file_name = `${props.outputFilename} ${today}`;
                        }

                        switch (blob.type) {
                            case "application/pdf":
                                file_name = `${file_name}.pdf`;
                                break;
                            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                                file_name = `${file_name}.xls`;
                                break;
                            default:
                                dispatch(
                                    ALERT_ACTIONS.setAlert({
                                        type: "error",
                                        message:
                                            "El formato de archivo no es válido.",
                                    })
                                );
                                return;
                        }

                        // link.onclick = () => {window.open(data);return false;} // opens new tab window with the file
                        link.setAttribute("download", file_name);
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        setIsLoadingReport(false);
                        setModalHideActions(true);
                        setModalOpened(false);
                        dispatch(
                            ALERT_ACTIONS.setAlert({
                                type: "success",
                                message: "Se generó exitosamente el reporte.",
                            })
                        );
                    });
            })
            .catch((error) => {
                let responseObj = error.response.data.text().then((message) => {
                    let errorMessage = JSON.parse(message).error;
                    dispatch(
                        ALERT_ACTIONS.setAlert({
                            type: "error",
                            message: errorMessage,
                        })
                    );
                });
                setIsLoadingReport(false);
                setModalHideActions(false);
                setModalOpened(false);
            });
    };

    const generateReport = (type) => {
        setIsLoadingReport(true);
        let filtros = props.filtros;
        switch (type) {
            case "PDF": {
                filtros["type"] = "pdf";
                break;
            }
            case "XLS": {
                filtros["type"] = "xls";
                break;
            }
            case "XLS Completo":
                filtros["type"] = "xls-completo";
                break;
        }
        filtros["order_by"] = props.orderBy;
        filtros["order"] = props.order;
        filtros["subscription_id"] = subscriptionId;

        axios
            .post(
                CONFIG.API_SERVER_ADDRESS + props.url,
                { ...filtros },
                {
                    headers: {
                        Authorization:
                            "Token " + localStorage.getItem("access_token"),
                    },
                }
            )
            .then((response) => {
                timeoutFunc = setInterval(
                    () => getGeneratedReport(response.data.task_id),
                    intervalToCheck
                );
            })
            .catch((error) => {
                console.log(error);
                dispatch(
                    ALERT_ACTIONS.setAlert({
                        type: "error",
                        message: error.response.data.error,
                    })
                );
                setIsLoadingReport(false);
                setModalHideActions(false);
                setModalOpened(false);
            });
    };

    const handleOnClickReport = (type) => {
        if (!props.notAllowed) {
            setFileType(type);
            setModalOpened(true);
            setModalHideActions(false);
        } else {
            dispatch(
                ALERT_ACTIONS.setAlert({
                    type: "error",
                    message: props.notAllowedMessage,
                })
            );
        }
    };

    const removeInterval = () => {
        if (timeoutFunc !== null) {
            clearInterval(timeoutFunc);
            timeoutFunc = null;
        }
    };

    useEffect(() => {
        //HACEMOS UN HASH PQ NINGUNA OTRA PESTAÑA NI VENTANA NI SESION DEL USUARIO PUEDE RECIBIR EL TASK ID PARA CANCELAR
        let hash = new Date().getTime();
        let subscription_id = "cancel_report_" + hash;
        setSubscriptionId(subscription_id);

        //SI SE VA DE LA PANTALLA SACAMOS SUSCRIPCION Y EL BACK VERIFICA SI HAY TAREA EN EJECUCION Y LA TERMINA
        return () => {
            setIsLoadingReport(false);
            setModalHideActions(false);
            removeInterval();
            // WEBSOCKET.unsubscribe(subscription_id);
            setSubscriptionId(null);
        };
    }, []);

    useEffect(() => {
        if (modalOpened) {
            //SUSCRIBIMOS PARA GUARDAR EL ID GENERADO EN ESTA CONEXION WEBSOCKET
            // WEBSOCKET.subscribe(subscriptionId, () => {});
        } else {
            setIsLoadingReport(false);
            setModalHideActions(false);
            removeInterval();
            //SI EL USUARIO PONE CERRAR O CANCELAR, SACAMOS SUSCRIPCION Y EL BACK VERIFICA SI HAY TAREA EN EJECUCION Y LA TERMINA
            // WEBSOCKET.unsubscribe(subscriptionId);
        }
    }, [modalOpened]);

    return (
        <>
            <ButtonGroup
                variant="contained"
                aria-label="outlined primary button group"
            >
                {props.pdf ? (
                    <Button
                        title={
                            props.notAllowed &
                            (props.notAllowedMessage !== null)
                                ? props.notAllowedMessage
                                : ""
                        }
                        color={props.notAllowed ? "darkGrey" : "primary"}
                        onClick={() => handleOnClickReport("PDF")}
                    >
                        {props.pdfCustomLabel && props.pdfCustomLabel !== ""
                            ? props.pdfCustomLabel
                            : "PDF"}
                    </Button>
                ) : (
                    ""
                )}
                {props.xls ? (
                    <Button
                        title={
                            props.notAllowed &
                            (props.notAllowedMessage !== null)
                                ? props.notAllowedMessage
                                : ""
                        }
                        color={props.notAllowed ? "darkGrey" : "primary"}
                        onClick={() => handleOnClickReport("XLS")}
                    >
                        {props.xlsCustomLabel && props.xlsCustomLabel !== ""
                            ? props.xlsCustomLabel
                            : "XLS"}
                    </Button>
                ) : (
                    ""
                )}
                {props.xlsCompleto ? (
                    <Button
                        title={
                            props.notAllowed &
                            (props.notAllowedMessage !== null)
                                ? props.notAllowedMessage
                                : ""
                        }
                        color={props.notAllowed ? "darkGrey" : "primary"}
                        onClick={() => handleOnClickReport("XLS Completo")}
                    >
                        {props.xlsCompletoCustomLabel &&
                        props.xlsCompletoCustomLabel !== ""
                            ? props.xlsCompletoCustomLabel
                            : "XLS Completo"}
                    </Button>
                ) : (
                    ""
                )}
            </ButtonGroup>
            <ConfirmModal
                isLoading={isLoadingReport}
                modalOpened={modalOpened}
                setModalOpened={setModalOpened}
                title={
                    "¿Generar reporte " +
                    fileType +
                    "?" +
                    " Este proceso puede demorar unos minutos."
                }
                callback={() => generateReport(fileType)}
                loadingLabel={"Generando"}
                modalHideActions={modalHideActions}
                fullWidth={false}
                enableForcedCancel={true}
            ></ConfirmModal>
        </>
    );
}

export default Reports;
