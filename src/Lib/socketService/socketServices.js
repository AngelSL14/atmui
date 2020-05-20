import { urlSocketService } from '../utils/utils';
import * as SockJS from 'sockjs-client';

export var pingpad;
export const initPingpad = (localIp, endPoint, status) => {
    let url = urlSocketService(localIp, endPoint);
    if (pingpad === null || pingpad === undefined || status === "reconexion") {
        if (status === "reconexion") {
            pingpad = null;
            setTimeout(() => {
                pingpad = new SockJS(url);
            }, 200);
        } else {
            pingpad = new SockJS(url);
        }
    }
    return pingpad;
}