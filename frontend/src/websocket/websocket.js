import * as NOTIFICATIONS_ACTIONS from '../actions/notifications-actions';
import { CONFIG } from '../config';

let ws = null;
let subscriptions = {}

export const initWebSocket = (store) => {

    console.log("open websocket");

    let token = localStorage.getItem('access_token');
    ws = new WebSocket(CONFIG.WS_SERVER_ADDRESS+"?token="+token);
    
    // Connection opened
    ws.onopen = (event) => {
        console.log("websocket opened");

        Object.keys(subscriptions).forEach(subscription_id => {
            let msg = {
                type: 'subscribe',
                data: subscription_id
            }
            sendMessage(msg)
        });
       
    };

    // Listen for messages
    ws.onmessage = (event) => {
        let message = JSON.parse(event.data);
        if (message.type === "ACK"){
            // console.log(message.data);
        }
        if (message.type === "notification"){
            newNotification(message.data);
        }
        if (message.type === "subscription" && message.subscription_id && message.data){
            notifySubscriber(message.subscription_id, message.data);
        }
    };

    ws.onclose = () => {
        console.log("websocket closed");
        token = localStorage.getItem('access_token');
        if (token){ //if is authenticated try reopen websocket, or something
            console.log("websocket reconnecting in 5 sec");
            setTimeout(() => initWebSocket(store), 5000);
        }
    };
    
    const newNotification = (notification) => {
        if (store){
            store.dispatch(NOTIFICATIONS_ACTIONS.appendNotificationFromWebSocket(notification));
        }
    };
}

export const closeWebSocket = () => {
    if (ws != null){
        console.log("close websocket");
        ws.close();
    }
}

export const notifySubscriber = (id, data) => {
    if (subscriptions[id]){
        subscriptions[id].callback(data);
    }
}

export const subscribe = (id, callback) => {
    if (!subscriptions[id]){
        subscriptions[id] = {callback: callback};
        let msg = {
            type: 'subscribe',
            data: id
        }
        sendMessage(msg)
    }
}

export const unsubscribe = (id) => {
    if (subscriptions[id]){
        delete subscriptions[id]
    }
    let msg = {
        type: 'unsubscribe',
        data: id
    }
    sendMessage(msg)
}

export const sendMessage = (msg) => {
    if (ws != null){ // && ws.readyState !== WebSocket.CLOSED){
        ws.send(JSON.stringify(msg));
    }
}