import React, {useContext} from 'react';
import {UseConnectSocket} from "../socket/useConnectSocket";
import {Context} from "../index";
import {observer} from "mobx-react";

const WebSocketComponent = observer(() => {
    const {user} = useContext(Context)
    const {messages} = UseConnectSocket()
    return (
        <div>

        </div>
    );
});

export default WebSocketComponent;