import io, {Socket} from 'socket.io-client'
import {useContext} from "react";
import {Context} from "../index";

class SocketApi{

    constructor() {
        this.socket=null
        Socket=null
    }
    static createConnection(){
        this.socket=io('http://127.0.0.1:5000', {
                 transports: ['websocket']
        })
        this.socket.on('connect',(e)=>{
            this.socket.emit('online',{
                'id':this.socket.id,
                'token':localStorage.getItem('token')
            })
        })

        // window.onunload=()=>{
        //     this.socket.emit('offline',{
        //         'token':localStorage.getItem('token')
        //     })
        // }
        return this.socket
    }

}
export default SocketApi