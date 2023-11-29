export const CONFIG = {
    API_SERVER_ADDRESS: process.env.REACT_APP_API_SERVER_ADDRESS.replaceAll('"',''),
    WS_SERVER_ADDRESS: process.env.REACT_APP_WS_SERVER_ADDRESS.replaceAll('"','')
}