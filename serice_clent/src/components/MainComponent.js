import React from 'react';
import ChatBar from "./ChatBar";
import ChatWindow from "./ChatWindow";

const MainComponent = () => {
    return (
        <div className='wrapper'>
           <ChatBar/>
           <ChatWindow/>
        </div>
    );
};

export default MainComponent;