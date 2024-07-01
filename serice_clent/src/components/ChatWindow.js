import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react";
import {toJS} from "mobx";
import {Context} from "../index";
import SocketApi from "../socket/SocketApi";
import {create_chat, delete_chat} from "../http/chatAPI";
import button from "bootstrap/js/src/button";
import {addContact, findOne, DeleteContact} from "../http/userAPI";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import userImg from '../img/user.png'
import skrepka from '../img/skrepka.svg'

const ChatWindow = observer(() => {
    const {message, user} = useContext(Context)
    const [text,setText] = useState('')
    const send=()=>{
        var d = new Date();
        var n = d.toLocaleTimeString();

            let chat = toJS(user.Chat)
            if(!toJS(user.ChatListNames).includes(chat['name'])) {
                delete chat['name']
                create_chat(chat).then(e => {
                    console.log('create chat:')
                    console.log(e)
                    let obj = toJS(user.Chat)
                    obj['_id'] = e['_id']
                    user.SetChat(obj)

                    let LIST = toJS(user.ChatListNames)
                    LIST.push(obj['name'])
                    user.SetChatListNames(LIST)
                    //console.log(obj)

                    let LIST_1=toJS(user.ChatList)
                    LIST_1.push(obj)
                    //console.log(LIST_1)
                    user.SetChatList(LIST_1)
                }).then(() => {
                    if (text.trim() != '' && text != '') {
                        SocketApi.socket.emit('createMessage', {
                            "owner": toJS(user.User)['_id'],
                            "date": d,
                            "text": text,
                            "chatId": toJS(user.Chat)['_id'],
                            "owner_1_id": toJS(user.Chat)['owner_1_id'],
                            "owner_2_id": toJS(user.Chat)['owner_2_id'],
                            "socketID": SocketApi.socket.id
                        })

                    } else {
                        alert('Message is Empty')
                    }
                })
            }
            else{
                if (text.trim() != '' && text != '') {
                    SocketApi.socket.emit('createMessage', {
                        "owner": toJS(user.User)['_id'],
                        "date": d,
                        "text": text,
                        "chatId": toJS(user.Chat)['_id'],
                        "owner_1_id": toJS(user.Chat)['owner_1_id'],
                        "owner_2_id": toJS(user.Chat)['owner_2_id'],
                        "socketID": SocketApi.socket.id
                    })

                } else {
                    alert('Message is Empty')
                }
            }
    }

    const uploadFile = (file)=> {
        var d = new Date();

        if (!file) {
            return
        }
        if (file.size > 10000000) {
            alert('File should be smaller than 1MB')
            return
        }

        let chat = toJS(user.Chat)
        if(!toJS(user.ChatListNames).includes(chat['name'])) {
            delete chat['name']
            create_chat(chat).then(e => {
                let obj = toJS(user.Chat)
                obj['_id'] = e['_id']
                user.SetChat(obj)

                let LIST = toJS(user.ChatListNames)
                LIST.push(obj['name'])
                user.SetChatListNames(LIST)
                //console.log(obj)

                let LIST_1=toJS(user.ChatList)
                LIST_1.push(obj)
                //console.log(LIST_1)
                user.SetChatList(LIST_1)
            }).then(() => {
                // if (textFile.trim() != '' && textFile != '') {
                //     var reader = new FileReader();
                //     var rawData = new ArrayBuffer();
                //
                //     reader.onload = function (e) {
                //         rawData = e.target.result;
                //         SocketApi.socket.emit("createMessageFile", {
                //             type: 'attachment',
                //             data: rawData,
                //             owner: toJS(user.User)['_id'],
                //             date: d,
                //             text: textFile,
                //             chatId: toJS(user.Chat)['_id'],
                //             owner_1_id: toJS(user.Chat)['owner_1_id'],
                //             owner_2_id: toJS(user.Chat)['owner_2_id'],
                //             socketID: SocketApi.socket.id
                //         } , (result) => {
                //
                //         });
                //
                //     }
                //
                //     reader.readAsArrayBuffer(file);
                //
                // } else {
                //     alert('Message is Empty')
                // }
                var reader = new FileReader();
                var rawData = new ArrayBuffer();

                reader.onload = function (e) {
                    rawData = e.target.result;
                    SocketApi.socket.emit("createMessageFile", {
                        type: 'attachment',
                        data: rawData,
                        owner: toJS(user.User)['_id'],
                        date: d,
                        text: textFile,
                        chatId: toJS(user.Chat)['_id'],
                        owner_1_id: toJS(user.Chat)['owner_1_id'],
                        owner_2_id: toJS(user.Chat)['owner_2_id'],
                        socketID: SocketApi.socket.id
                    } , (result) => {

                    });

                }
                reader.readAsArrayBuffer(file);
            })
        }
        else{
            // if (textFile.trim() != '' && textFile != '') {
            //     var reader = new FileReader();
            //     var rawData = new ArrayBuffer();
            //
            //     reader.onload = function (e) {
            //         rawData = e.target.result;
            //         SocketApi.socket.emit("createMessageFile", {
            //             type: 'attachment',
            //             data: rawData,
            //             owner: toJS(user.User)['_id'],
            //             date: d,
            //             text: textFile,
            //             chatId: toJS(user.Chat)['_id'],
            //             owner_1_id: toJS(user.Chat)['owner_1_id'],
            //             owner_2_id: toJS(user.Chat)['owner_2_id'],
            //             socketID: SocketApi.socket.id
            //         } , (result) => {
            //
            //         });
            //
            //     }
            //
            //     reader.readAsArrayBuffer(file);
            //
            // } else {
            //     alert('Message is Empty')
            // }
            var reader = new FileReader();
            var rawData = new ArrayBuffer();

            reader.onload = function (e) {
                rawData = e.target.result;
                SocketApi.socket.emit("createMessageFile", {
                    type: 'attachment',
                    data: rawData,
                    owner: toJS(user.User)['_id'],
                    date: d,
                    text: textFile,
                    chatId: toJS(user.Chat)['_id'],
                    owner_1_id: toJS(user.Chat)['owner_1_id'],
                    owner_2_id: toJS(user.Chat)['owner_2_id'],
                    socketID: SocketApi.socket.id
                } , (result) => {

                });

            }

            reader.readAsArrayBuffer(file);
        }

    }

   // const [userAdd,SetUserAdd]=useState(true)
    const AddContact=(userId,name)=>{
        findOne({'userId':userId}).then(e=>{
            addContact({nickname:e['nickname'], name:name, owner:localStorage.getItem('token')}).then(a=> {
                if(toJS(user.Contacts)!=false){
                    let contacts = toJS(user.Contacts)
                    contacts.push(a)
                    user.setContacts(contacts)
                }
               else{
                   let arr = []
                    arr.push(a)
                    user.setContacts(arr)
                }
                let chat_obj=toJS(user.Chat)
                // console.log(a)
                // console.log(toJS(user.ChatList))
                if(chat_obj.hasOwnProperty('isContact')){
                    if(!a.hasOwnProperty('message')){
                        delete chat_obj['isContact']
                        chat_obj['name']=a['name']
                        user.SetChat(chat_obj)
                    }
                }
                //SetUserAdd(true)
            })
        })

    }

    const deleteContact=()=>{
        let sobes
        if(toJS(user.Chat)['owner_1_id']==toJS(user.User)['_id']){
            sobes=toJS(user.Chat)['owner_2_id']
        }
        else if(toJS(user.Chat)['owner_2_id']==toJS(user.User)['_id']){
            sobes=toJS(user.Chat)['owner_1_id']
        }
        DeleteContact({owner_id:toJS(user.User)['_id'], contactId:sobes}).then(e=>{
            let conts= toJS(user.Contacts)
            let INDEX
            conts.forEach(CON=>{
                if(CON['userId']==e){
                    INDEX=conts.indexOf(CON)
                }
            })
            conts.splice(INDEX,1)
            if(conts.length==0){
                conts=false
            }
            user.setContacts(conts)

            if(toJS(user.Chat)['owner_1_id']==e || toJS(user.Chat)['owner_2_id']==e){
                findOne({userId:e}).then(E=>{
                    let chat_obj=toJS(user.Chat)
                    chat_obj['name']=E['name']
                    chat_obj['isContact']=false
                    user.SetChat(chat_obj)
                })
            }
        })
    }

    const [contactModal,SetContactModal] = useState(false)

    const handleShowContact=()=>SetContactModal(true)
    const handleCloseContact=()=>SetContactModal(false)

    const [contName,SetContName]=useState('')


    const [chatModal,SetChatModal]=useState(false)

    const handleShowChat=()=>SetChatModal(true)
    const handleCloseChat=()=>SetChatModal(false)

    const [file,SetFile]=useState('')

    useEffect(()=>{
        //console.log(toJS(user.Chat))

        let contact_check = false
        if(Object.keys(toJS(user.Chat)).length!=0){

            for (let i = 0; i < toJS(user.Contacts).length; i++) {
                if(toJS(user.Contacts)[i]['name']==toJS(user.Chat)['name']){
                    contact_check=true
                    if(!toJS(user.Chat).hasOwnProperty('status')) {
                        let chat_obj = toJS(user.Chat)
                        if(toJS(user.Contacts)[i]['status']) {
                            chat_obj['status'] = toJS(user.Contacts)[i]['status'].split(' ')[1] + ' ' + toJS(user.Contacts)[i]['status'].split(' ')[2] + ' ' + toJS(user.Contacts)[i]['status'].split(' ')[3] + ' ' + toJS(user.Contacts)[i]['status'].split(' ')[4]
                            user.SetChat(chat_obj)
                        }
                        else{
                            let arr=[]
                            arr.push(toJS(user.Contacts)[i])
                            //console.log('emit')
                            SocketApi.socket.emit('stream_user_status',
                                {
                                    'id':SocketApi.socket.id,
                                    'stream_user_id': arr
                                })
                        }
                    }
                }
            }
            if(!contact_check) {
               //SetUserAdd(false)
                if (!toJS(user.Chat).hasOwnProperty('status')) {
                    const own_id = toJS(user.User)['_id']
                    let check_var
                    let arr = []
                    if (toJS(user.Chat)['owner_1_id'] == own_id) {
                        check_var = toJS(user.Chat)['owner_2_id']
                    } else if (toJS(user.Chat)['owner_2_id'] == own_id) {
                        check_var = toJS(user.Chat)['owner_1_id']
                    }
                    arr.push({'name': toJS(user.Chat)['name'], 'userId': check_var})

                    SocketApi.socket.emit('stream_user_status',
                        {
                            'id': SocketApi.socket.id,
                            'stream_user_id': arr
                        })
                    contact_check = true
                }
            }
            else{
               // SetUserAdd(true)
            }
        }
    },[toJS(user.Chat)])



    const [textFile,SetTextFile]=useState('')

    const ShowChatParametrs=()=>{
        let dom = document.getElementById('ChatParametrs')
        if(dom.style.height=='0' || dom.style.height=='0px'){
            document.getElementById('ChatParametrs').style.height='150px'
        }
        else{
            document.getElementById('ChatParametrs').style.height='0'
        }
    }

    const clearHistory=()=>{
        let sobes
        if(toJS(user.User)['_id']==toJS(user.Chat)['owner_1_id']){
            sobes=toJS(user.Chat)['owner_2_id']
        }
        else if(toJS(user.User)['_id']==toJS(user.Chat)['owner_2_id']){
            sobes=toJS(user.Chat)['owner_1_id']
        }
        const info = {userId: toJS(user.User)['_id'], chatId: toJS(user.Chat)['_id'], sobesId:sobes}
        let chatId=info['chatId']
        let INDEX
        delete_chat(info).then(a=>{
            user.SetChat({})
            let chat_list = toJS(user.ChatList)
            chat_list.forEach(A=>{
                if(A['_id']==chatId){
                    INDEX = chat_list.indexOf(A)
                    chat_list.splice(INDEX,1)

                }
            })
            user.SetChatList(chat_list)
        })
    }


    return (
        <div className='ChatWindow'>

            {Object.keys(toJS(user.Chat)).length!=0 &&
                <>
                    <div style={{minHeight:'500px', width:'100%',  height:'100%'}}>

                        <div style={{height:'20%'}}>
                            <div style={{height:'90px', width:'100%', backgroundColor:'white', borderBottom:'1px solid gray',borderTop:'0.001px solid white', display:'flex',alignItems:'center', justifyContent:'space-between'}} className="user_info">
                               <div className='left_top_chat'>
                                    <div style={{height:'80px',width:'80px', borderRadius:'50%',overflow:'hidden',marginLeft:'10px'}} className="ChatAvatar">
                                        {toJS(user.Chat).hasOwnProperty('AvatarName') ?
                                            <>
                                                {toJS(user.Chat)['AvatarName']!='none' ?
                                                    <>
                                                        <img style={{width:'100%',height:'100%'}} src={process.env.REACT_APP_SERVER_URL + '/' + toJS(user.Chat)['AvatarName']} alt=""/>
                                                    </>
                                                    :
                                                    <>
                                                        <img style={{width:'100%',height:'100%'}} src={userImg} alt=""/>
                                                    </>
                                                }
                                            </>
                                            :
                                            <p>no avatarname</p>
                                        }
                                    </div>
                                    <div style={{marginLeft:'15px', marginTop:'10px'}}>
                                        <h1 style={{fontSize:'25px'}}>{user.Chat.name}</h1>
                                        {toJS(user.Chat)['status'] &&
                                        <p className='UserChatStatus'>{user.Chat.status}</p>
                                        }
                                    </div>
                               </div>
                                <div onClick={()=>ShowChatParametrs()} style={{width:'100px',height:'60px',backgroundImage:'radial-gradient(circle, black 3px, transparent 4px)',backgroundSize:'100% 33.33%'}}>
                                    <div id='ChatParametrs' style={{height:'0',width:'250px',borderRadius:'15px', transition:'0.2s', marginLeft:'-280px',background:'white', boxShadow:'0px 0px 66px 25px rgba(34, 60, 80, 0.2)', overflow:'hidden'}}>
                                        {!toJS(user.Chat).hasOwnProperty('isContact') &&
                                            <p onClick={()=>deleteContact()} style={{color:'red'}}>Delete Contact</p>
                                        }
                                        {toJS(user.Chat).hasOwnProperty('_id') &&
                                            <p onClick={()=>clearHistory()}>Clear History</p>
                                        }


                                    </div>
                                </div>
                            </div>

                            {(user.Chat.hasOwnProperty('isContact')) &&
                                <div style={{width:'100%',display:'flex',justifyContent:'center',paddingTop:'50px', height:'10%'}}>
                                    <button key='key' onClick={()=>handleShowContact()} className='contact_chat_button'>+Add contact</button>
                                </div>
                            }
                        </div>

                        <div style={{height:'80%'}}>
                            <div style={{display:'flex', flexDirection:'column', height:'90%', overflowY:'scroll'}}>
                                {toJS(user.Chat)['messages'] &&
                                    toJS(user.Chat)['messages'].map(message=>{
                                        if(message.owner==toJS(user.User)['_id']){
                                            return(
                                                    <div key={message['_id']} className="my_message">
                                                        <h1 className="sender_chat_name">Me:</h1>
                                                        <div className="my_text_chat_block">
                                                            <div>{message.date}</div>
                                                            <p className='message_p_tag'>{message.text}</p>
                                                            {message.hasOwnProperty('filename') &&
                                                                <img style={{width:'90%'}} src={process.env.REACT_APP_SERVER_URL+'/'+message['filename']} alt=""/>
                                                            }
                                                        </div>
                                                    </div>
                                            )
                                        }
                                        else{
                                            return(
                                                    <div className="message">
                                                        <h1 className="sender_chat_name">{toJS(user.Chat)['name']+':'}</h1>
                                                        <div className="text_chat_block">
                                                            <div>{message.date}</div>
                                                            {message.text}
                                                            {message.hasOwnProperty('filename') &&
                                                                <img style={{width:'90%'}} src={process.env.REACT_APP_SERVER_URL+'/'+message['filename']} alt=""/>
                                                            }
                                                        </div>
                                                    </div>
                                            )
                                        }
                                        // {message.owner==toJS(user.User)['_id'] ?
                                        //     <div className="my_message">
                                        //         <h1 className="sender_chat_name">{message.owner}</h1>
                                        //         <div className="text_chat_block">
                                        //             <div>{message.date}</div>
                                        //             {message.text}
                                        //         </div>
                                        //     </div>
                                        //     :
                                        //     <div className="message">
                                        //         <h1 className="sender_chat_name">{message.owner}</h1>
                                        //         <div className="text_chat_block">
                                        //             <div>{message.date}</div>
                                        //             {message.text}
                                        //         </div>
                                        //     </div>
                                        // }

                                    })
                                }
                            </div>

                            <div style={{height:'10%'}} className="foot_bar_chat">
                                <input onChange={(e)=> {
                                    SetFile(e.target.files[0])
                                    handleShowChat()
                                }} type="file" style={{display:'none'}} id='message_file'/>
                                <label htmlFor="message_file">
                                    <img src={skrepka} style={{width:"40px", marginRight:'30px',cursor:'pointer'}} alt=""/>
                                </label>

                                <input onChange={(e)=>setText(e.target.value)} type="text"/>
                                <button style={{marginLeft:'20px'}} onClick={()=>send()}>Send message</button>
                            </div>
                        </div>

                    </div>



                    <Modal show={contactModal} onHide={handleCloseContact}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add contact</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{display:'flex', flexDirection:'column'}}>
                            <input onChange={(e)=>SetContName(e.target.value)} placeholder='name' type="text"/>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseContact}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={()=>{
                                if(toJS(user.Chat)['owner_1_id']==toJS(user.User)['_id']) {
                                    AddContact(toJS(user.Chat)['owner_2_id'], contName)
                                }
                                else {
                                    AddContact(toJS(user.Chat)['owner_1_id'], contName)
                                }
                                handleCloseContact()
                            }}>
                                Add
                            </Button>
                        </Modal.Footer>
                    </Modal>


                    <Modal show={chatModal} onHide={handleCloseChat}>
                        <Modal.Header closeButton>
                            <Modal.Title></Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{display:'flex', flexDirection:'column'}}>
                            {(file && file!='') &&
                                <>
                                    <img style={{width:'90%'}} src={URL.createObjectURL(file)} alt=""/>
                                    <input type="text" onChange={(e)=>SetTextFile(e.target.value)}/>
                                </>
                            }
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseChat}>
                                Reset
                            </Button>
                            <Button variant="primary" onClick={()=>{
                                uploadFile(file)
                                handleCloseChat()
                            }}>
                                Send
                            </Button>
                        </Modal.Footer>
                    </Modal>

                </>
            }
        </div>

    );
});

export default ChatWindow;