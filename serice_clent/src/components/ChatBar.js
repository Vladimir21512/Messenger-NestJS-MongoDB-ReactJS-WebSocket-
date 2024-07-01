import React, {useContext, useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {addContact, ChangePhoto, DeletePhoto, findOne} from "../http/userAPI";
import PencilImg from '../img/pencil.svg'
import PencilImg1 from '../img/pencil1.svg'
import {Context} from "../index";
import {toJS} from "mobx";
import SocketApi from '../socket/SocketApi'
import {observer} from "mobx-react";
import {create_chat, delete_chat} from "../http/chatAPI";
import UserImg from '../img/user.png'
import loop from '../img/loop-svgrepo-com.svg'
import Spinner from 'react-bootstrap/Spinner';



const ChatBar = observer(() => {
    const {user}=useContext(Context)

    const [AvatarExist, SetAvatarExist]=useState(false)

    const add_friend=()=>{
        addContact({nickname:search_param, name:name, owner:localStorage.getItem('token')}).then(e=> {
            let contacts = toJS(user.Contacts)
            contacts.push(e)
            user.SetContacts(contacts)
        })
    }
    const [show, setShow] = useState(false);
    const [showContacts, setShowContacts] = useState(false);
    const [search_param, setSearch] = useState('')
    const [name,setName]=useState('')
    const [ChangeProfilePhotoHook, SetChangeProfilePhotoHook]=useState(false)

    const [searchUser, SetSearchUser] = useState(false)

    const handleCloseSearch=()=> {
        SetSearchUser(false)
        if(searchResult!='No results' && searchResult!=''){
            SocketApi.socket.emit('delete_stream_user_status',
                {
                    'id':SocketApi.socket.id,
                    'delete_stream_user_id': searchResult
                }
            )
        }

        SetSearchResult('')
    }
    const handleShowSearch=()=>SetSearchUser(true)
    const handleClosePhoto=()=> SetChangeProfilePhotoHook(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleShowContacts=()=> {
        setShowContacts(true)
        if(toJS(user.Contacts)){
            SocketApi.socket.emit('stream_user_status',
                {
                    'id':SocketApi.socket.id,
                    'stream_user_id': toJS(user.Contacts)
                }
            )
        }

    }

    const handleCloseContacts=(ID)=> {
        let arr =toJS(user.Contacts)
        let index = null
        for (let i = 0; i <arr.length ; i++) {
            if(arr[i]['userId']==ID){
                arr.splice(i,1)
            }
        }
        if(arr){
            SocketApi.socket.emit('delete_stream_user_status',
                {
                    'id':SocketApi.socket.id,
                    'delete_stream_user_id': arr
                }
            )
        }

        setShowContacts(false)
    }
    const newChat=(chat)=>{

        if(toJS(user.Chat).hasOwnProperty('owner_1_id')){
            if(toJS(user.Chat)['owner_1_id']==chat['owner_1_id'] && toJS(user.Chat)['owner_2_id']==chat['owner_2_id']){
                handleCloseSearch()
                return 0;
            }
            else if(toJS(user.Chat)['owner_2_id']==chat['owner_1_id'] && toJS(user.Chat)['owner_1_id']==chat['owner_2_id']){
                handleCloseSearch()
                return 0;
            }
            else{
                let chat_obj=chat
                let contact_check = false
                for (let i = 0; i < toJS(user.Contacts).length; i++) {

                    if(toJS(user.Contacts)[i]['name']==chat_obj['name']){
                        contact_check=true
                        if(!chat_obj.hasOwnProperty('status')) {
                            //let chat_obj = toJS(user.Chat)
                            if(toJS(user.Contacts)[i]['status']) {
                                if(toJS(user.Contacts)[i]['status']!='online') {
                                    chat_obj['status'] = toJS(user.Contacts)[i]['status'].split(' ')[1] + ' ' + toJS(user.Contacts)[i]['status'].split(' ')[2] + ' ' + toJS(user.Contacts)[i]['status'].split(' ')[3] + ' ' + toJS(user.Contacts)[i]['status'].split(' ')[4]
                                    //user.SetChat(chat_obj)
                                }
                                else{
                                    chat_obj['status'] = 'online'
                                    //user.SetChat(chat_obj)
                                }
                            }
                            else{
                                let arr=[]
                                arr.push(toJS(user.Contacts)[i])

                                SocketApi.socket.emit('stream_user_status',
                                    {
                                        'id':SocketApi.socket.id,
                                        'stream_user_id': arr
                                    })
                            }
                        }
                        if(toJS(user.Contacts)[i].hasOwnProperty('AvatarName')){
                            //let chat_obj=toJS(user.Chat)
                            chat_obj['AvatarName']=toJS(user.Contacts)[i]['AvatarName']
                            //user.SetChat(chat_obj)
                        }
                    }

                }

                let sobes

                if(toJS(user.User)['_id']==chat_obj['owner_1_id']){
                    sobes=chat_obj['owner_2_id']
                }
                else if(toJS(user.User)['_id']==chat_obj['owner_2_id']){
                    sobes=chat_obj['owner_1_id']
                }
                if(!chat_obj.hasOwnProperty('AvatarName')){
                    findOne({'userId':sobes}).then(e=>{
                        chat_obj['AvatarName']=e['AvatarName']
                    }).then(()=> {
                        if(!contact_check){
                            chat_obj['isContact']=false
                        }
                    }).then(()=> {
                        //console.log(chat_obj)
                        user.SetChat(chat_obj)
                    })
                }
                else if(chat_obj['AvatarName']==undefined ){
                    findOne({'userId':sobes}).then(e=>{
                        chat_obj['AvatarName']=e['AvatarName']
                    }).then(()=> {
                        if(!contact_check){
                            chat_obj['isContact']=false
                        }
                    }).then(()=> {
                        // console.log(chat_obj)
                        user.SetChat(chat_obj)
                    })
                }
                else{
                    user.SetChat(chat_obj)
                }
            }
        }
        else{
            let chat_obj=chat
            let contact_check = false
            for (let i = 0; i < toJS(user.Contacts).length; i++) {

                if(toJS(user.Contacts)[i]['name']==chat_obj['name']){
                    contact_check=true
                    if(!chat_obj.hasOwnProperty('status')) {
                        //let chat_obj = toJS(user.Chat)
                        if(toJS(user.Contacts)[i]['status']) {
                            if(toJS(user.Contacts)[i]['status']!='online') {
                                chat_obj['status'] = toJS(user.Contacts)[i]['status'].split(' ')[1] + ' ' + toJS(user.Contacts)[i]['status'].split(' ')[2] + ' ' + toJS(user.Contacts)[i]['status'].split(' ')[3] + ' ' + toJS(user.Contacts)[i]['status'].split(' ')[4]
                                //user.SetChat(chat_obj)
                            }
                            else{
                                chat_obj['status'] = 'online'
                                //user.SetChat(chat_obj)
                            }
                        }
                        else{
                            let arr=[]
                            arr.push(toJS(user.Contacts)[i])

                            SocketApi.socket.emit('stream_user_status',
                                {
                                    'id':SocketApi.socket.id,
                                    'stream_user_id': arr
                                })
                        }
                    }
                    if(toJS(user.Contacts)[i].hasOwnProperty('AvatarName')){
                        //let chat_obj=toJS(user.Chat)
                        chat_obj['AvatarName']=toJS(user.Contacts)[i]['AvatarName']
                        //user.SetChat(chat_obj)
                    }
                }

            }

            let sobes

            if(toJS(user.User)['_id']==chat_obj['owner_1_id']){
                sobes=chat_obj['owner_2_id']
            }
            else if(toJS(user.User)['_id']==chat_obj['owner_2_id']){
                sobes=chat_obj['owner_1_id']
            }
            if(!chat_obj.hasOwnProperty('AvatarName')){
                findOne({'userId':sobes}).then(e=>{
                    chat_obj['AvatarName']=e['AvatarName']
                }).then(()=> {
                    if(!contact_check){
                        chat_obj['isContact']=false
                    }
                }).then(()=> {
                    //console.log(chat_obj)
                    user.SetChat(chat_obj)
                })
            }
            else if(chat_obj['AvatarName']==undefined ){
                findOne({'userId':sobes}).then(e=>{
                    chat_obj['AvatarName']=e['AvatarName']
                }).then(()=> {
                    if(!contact_check){
                        chat_obj['isContact']=false
                    }
                }).then(()=> {
                    // console.log(chat_obj)
                    user.SetChat(chat_obj)
                })
            }
            else{
                user.SetChat(chat_obj)
            }
        }

        handleCloseSearch()
    }

    const deleteChat=(info)=>{
        let chatId=info['chatId']
        let INDEX
        delete_chat(info).then(a=>{

            if(chatId==toJS(user.Chat)['_id']){
                user.SetChat({})
            }

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
    const SideBar=()=>{
        let elem =document.getElementById('sidebar').style.left
        if(elem=='-450px') {
            document.getElementById('sidebar').style.left = '0'
        }
        else{
            document.getElementById('sidebar').style.left = '-450px'
        }
    }
    const [ChangeProfilePhoto,SetChangeProfilePhoto]=useState('')
    const [UserFile,SetUserFile]=useState()

    const [searchResult,SetSearchResult]=useState('')
    const changePhoto=()=>{
        let formdata = new FormData()
        formdata.append('userId', toJS(user.User)['_id'])
        formdata.append('file',UserFile)
        ChangePhoto(formdata).then(e=>{
            let obj = toJS(user.User)
            obj['AvatarName']=e
            user.SetUser(obj)
        })
    }

    useEffect(()=>{
        if(toJS(user.User)['AvatarName']!='none') {
            fetch(process.env.REACT_APP_SERVER_URL + '/' + toJS(user.User)['AvatarName']).then(A => {
                if (A.ok) {
                    SetAvatarExist(true)
                } else {
                    SetAvatarExist(false)
                    DeletePhoto({userId:toJS(user.User)['_id']})
                }
            }).catch(e => {
                SetAvatarExist(false)
            })
        }
        else{
            SetAvatarExist(false)
        }

        SocketApi.socket.on('message',(e)=>{
            if(typeof(e)=='object') {
                if (e.hasOwnProperty('search_result')) {
                    let result = e['search_result']
                    if (!result) {
                        SetSearchResult('No results')
                        SetSpin(false)
                    } else {
                        if (typeof (result == 'object')) {
                            if(result.length!=0) {
                                let best_result = []
                                let contacts_id = {}
                                if(toJS(user.Contacts)!=false) {
                                    toJS(user.Contacts).forEach(contact => {
                                        //contacts_id.push(contact['_id'])
                                        contacts_id[contact['userId']] = contact['name']
                                    })
                                }
                                result.forEach(res => {
                                    if (Object.keys(contacts_id).includes(res['_id'])) {
                                        const key = Object.keys(contacts_id)[Object.keys(contacts_id).indexOf(res['_id'])]
                                        let item = contacts_id[key]
                                        let new_item = res
                                        new_item['nickname'] = item
                                        new_item['contact'] = true
                                        best_result.push(new_item)
                                    } else {
                                        best_result.push(res)
                                    }
                                })
                                SetSearchResult(best_result)
                                SocketApi.socket.emit('stream_user_status',
                                    {
                                        'id': SocketApi.socket.id,
                                        'stream_user_id': result
                                    }
                                )
                            }
                            else{
                                SetSearchResult('No results')
                            }
                        }
                        else {
                            SetSearchResult(result)
                            SocketApi.socket.emit('stream_user_status',
                                {
                                    'id': SocketApi.socket.id,
                                    'stream_user_id': result
                                }
                            )

                        }
                        SetSpin(false)
                    }
                }
                if (e.hasOwnProperty('stream_online')) {
                    const ID = e['stream_online']
                    let new_result=[]
                    if (typeof (searchResult) != 'string') {
                        for (let i = 0; i < searchResult.length; i++) {
                            let new_item = searchResult[i]
                            if (searchResult[i]['_id'] == ID) {
                                new_item['LastVisit'] = 'online'
                                new_result.push(new_item)
                                //break
                            } else {
                                new_result.push(new_item)
                            }
                        }
                        SetSearchResult(new_result)
                    }
                }
                else if (e.hasOwnProperty('stream_offline')) {
                    const ID = e['stream_offline']['id']
                    let new_result=[]
                    if (typeof (searchResult) != 'string') {
                        for (let i = 0; i < searchResult.length; i++) {
                            let new_item = searchResult[i]
                            if (searchResult[i]['_id'] == ID) {
                                new_item['LastVisit'] = e['stream_offline']['LastVisit']
                                new_result.push(new_item)
                                //break
                            } else {
                                new_result.push(new_item)
                            }
                        }
                        SetSearchResult(new_result)
                    }
                }
            }
        })
    },[searchResult])

    //console.log(toJS(user.Chat))
    let time

    const [spin,SetSpin]=useState(false)

    const[srcText,SetSrcText]=useState('')

    const SEARCHUSER=(name)=>{
        SetSrcText(name)
        clearTimeout(time)

        // if(name.length>3) {
        //     SetSpin(true)
        // }
        //
        // if(name.length!=0){
        //     SetSpin('No results')
        // }
        // else{
        //     SetSpin(false)
        // }
        SetSpin(true)

        if (searchUser) {
            if(name.length>3){

                SocketApi.socket.emit('search_user', {
                    'id': SocketApi.socket.id,
                    'name': name
                })
                SetSpin(true)
            }
            else{

            }
        }

    }

    return (
        <>
            <div className='ChatBar'>

                <div style={{left:'-450px'}} id="sidebar">
                    <div style={{height:'80px'}} className="sidebar_top">
                        <span onClick={()=>SideBar()} className="close--two">✖</span>
                    </div>
                    <div style={{height:'290px', paddingLeft:'30px',borderTop:'1px solid white',borderBottom:'1px solid white'}} className="user_info_sidebar">
                        <div style={{display:'flex', marginTop:'20px'}}>
                            <div style={{height:'70px', width:'70px', borderRadius:'50%',overflow:'hidden'}}>
                                {AvatarExist ?
                                    <img style={{height:'70px'}} src={process.env.REACT_APP_SERVER_URL+'/'+toJS(user.User)['AvatarName']} alt=""/>
                                    :
                                    <img style={{height:'70px'}} src={UserImg} alt=""/>
                                }
                                {/*<img style={{height:'70px'}} src={process.env.REACT_APP_SERVER_URL+'/'+toJS(user.User)['AvatarName']} alt=""/>*/}
                            </div>

                            {/*<input onChange={(e)=> {*/}
                            {/*    if(e.target.files[0]) {*/}
                            {/*        SetChangeProfilePhotoHook(true)*/}
                            {/*        SetChangeProfilePhoto(URL.createObjectURL(e.target.files[0]))*/}
                            {/*        SetUserFile(e.target.files[0])*/}
                            {/*    }*/}
                            {/*}} style={{display:'none'}} id='change_img' type="file"/>*/}

                            <label onClick={()=>SetChangeProfilePhotoHook(true)} id='label_change_img' htmlFor="change_img">
                                <img style={{width:'30px', height:'30px'}} src={PencilImg1} alt=""/>
                            </label>

                        </div>

                        <p style={{color:'white', marginTop:'15px', fontSize:'25px'}}>{toJS(user.User)['nickname']}</p>
                        <p style={{color:'white', fontSize:'25px'}}>{toJS(user.User)['email']}</p>
                    </div>
                </div>

                <div className="top_chats">
                    <div onClick={()=>SideBar()} className="menu">
                        <span className="menu_cpan"></span>
                        <span className="menu_cpan"></span>
                        <span className="menu_cpan"></span>
                    </div>
                    <div className="search_users">
                        <img onClick={()=>handleShowSearch()} src={loop} style={{height:'50px', float:"right"}} alt=""/>
                    </div>
                </div>
                <div className="chats">
                    <div style={{height:'90%'}}>
                    {(toJS(user.ChatList).length!=0) &&
                        <>
                            {user.ChatList.map(e=>{
                                return(
                                    <div key={e['name']} onClick={(a)=>{
                                        a.preventDefault()
                                        newChat(e)
                                    }} className='chat_line'>
                                        <div className="chat_start_line">
                                            <h1 style={{fontSize:'20px', marginLeft:'10px', marginTop:'9px'}}>{e.name}</h1>

                                            {e.hasOwnProperty('messages') &&
                                                <>
                                                    {e.messages.length!=0 ?
                                                        <>
                                                            {e.messages[e.messages.length-1]['text'].length<27 ?
                                                                <>
                                                                {!e.messages[e.messages.length-1].hasOwnProperty('filename') ?
                                                                    <p style={{marginLeft:'22px', marginTop:'9px'}}>{e.messages[e.messages.length-1]['text']}</p>
                                                                    :
                                                                    <p style={{marginLeft:'22px', marginTop:'9px', fontStyle:'italic'}}>Image</p>
                                                                }
                                                                </>
                                                                :
                                                                <p style={{marginLeft:'22px', marginTop:'9px'}}>{e.messages[e.messages.length-1]['text'].substring(0,27)+' ...'}</p>
                                                            }
                                                        </>
                                                        :
                                                        <p style={{marginLeft:'22px', marginTop:'9px'}}>No messages</p>
                                                    }
                                                </>
                                            }


                                        </div>
                                        <p onClick={()=> {
                                            let sobes
                                            if(toJS(user.User)['_id']==e['owner_1_id']) {
                                                sobes=e['owner_2_id']
                                            }
                                            else if(toJS(user.User)['_id']==e['owner_2_id']) {
                                                sobes=e['owner_1_id']
                                            }
                                            deleteChat({userId: toJS(user.User)['_id'], chatId: e['_id'], sobesId:sobes})
                                        }} style={{color:'red', marginRight:'10px'}}>Delete</p>
                                    </div>
                                )
                            })
                            }
                        </>
                    }
                    </div>
                    <div style={{height:'10%'}} className="foot_chat">
                        {/*<h1 onClick={()=>handleShow()} className='add_friend'>+</h1>*/}
                        <img onClick={()=>handleShowContacts()} style={{width:'50px'}} src={PencilImg} alt=""/>
                    </div>
                </div>


                <Modal show={showContacts} onHide={handleCloseContacts}>
                    <Modal.Header closeButton>
                        <Modal.Title>Contacts</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{display:'flex', flexDirection:'column'}}>
                        {toJS(user.Contacts) &&
                            <>
                            {user.Contacts.map(contact=>{

                                return(
                                    <div onClick={()=> {
                                        newChat({name: contact.name, owner_1_id:toJS(user.User)['_id'], owner_2_id:contact.userId, typeId:1, own_id:toJS(user.User)['_id']})
                                        handleCloseContacts(contact.userId)
                                    }} key={contact.name} className='contact_bar'>
                                        <div className="contact_avatar">
                                            {contact.AvatarName!='none' ?
                                                <>
                                                    <img style={{height:'100%',width:'100%'}} src={process.env.REACT_APP_SERVER_URL+'/'+contact.AvatarName} alt=""/>
                                                </>
                                                :
                                                <>
                                                    <img style={{height:'100%',width:'100%'}} src={UserImg} alt=""/>
                                                </>
                                            }
                                        </div>
                                        <div className="contact_demo_info">
                                            <h1 style={{margin:'0',fontSize:'27px'}}>{contact.name}</h1>
                                            {contact.status &&
                                                <>
                                                {contact.status=='online' ?
                                                    <p style={{margin:'0'}}>{contact.status}</p>
                                                    :
                                                    <p style={{margin:'0'}}>{contact.status.split(' ')[1]+' '+contact.status.split(' ')[2]+' '+contact.status.split(' ')[3]+' '+contact.status.split(' ')[4]}</p>
                                                }

                                                </>
                                            }

                                        </div>
                                    </div>
                                )
                            })}
                            </>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseContacts}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={()=>{
                            handleCloseContacts()
                        }}>
                            Add
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add contact</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{display:'flex', flexDirection:'column'}}>
                        <input onChange={(e)=>setName(e.target.value)} className='authForm' placeholder='name' type="text"/>
                        <input onChange={(e)=>setSearch(e.target.value)} className='authForm' placeholder='email or nickname' type="text"/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={()=>{
                            handleClose()
                            add_friend()
                        }}>
                            Add
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={ChangeProfilePhotoHook} onHide={handleClosePhoto}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Photo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{display:'flex', flexDirection:'column'}}>
                        <div onClick={()=>console.log(ChangeProfilePhoto)} className='ChangePhoto'>
                            {ChangeProfilePhoto ?
                                <img style={{height:'200px', marginLeft:'auto',marginRight:'auto'}} src={URL.createObjectURL(ChangeProfilePhoto)} alt=""/>
                                :
                                <>
                                    <input onChange={(e)=> {
                                            if(e.target.files[0]) {
                                              // SetChangeProfilePhotoHook(true)
                                                console.log(e.target.files[0])
                                                    // SetChangeProfilePhoto(window.URL.createObjectURL(e.target.files[0]))
                                                SetChangeProfilePhoto(e.target.files[0])
                                                SetUserFile(e.target.files[0])
                                            }}
                                    } id='chnge_img' type="file" style={{display:'none'}}/>

                                    <label style={{cursor:'pointer'}} htmlFor="chnge_img">
                                        <p style={{fontSize:'75px'}}>+</p>
                                    </label>

                                </>
                            }

                        </div>
                    </Modal.Body>
                    <Modal.Footer style={{justifyContent:'center'}}>
                        <Button style={{backgroundColor:'red', width:'40%', float:'left'}} variant="secondary" onClick={()=> {
                            handleClosePhoto()
                            SetChangeProfilePhoto('')
                            SetUserFile(null)
                        }}>
                            Reset 
                        </Button>
                        <Button style={{width:'40%', float:'right'}} variant="primary" onClick={()=>{
                            handleClosePhoto()
                            changePhoto()
                        }}>
                            Accept
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={searchUser} onHide={handleCloseSearch}>
                    <Modal.Header closeButton>
                        <Modal.Title onClick={()=>console.log(searchResult)}>Search user</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{display:'flex', flexDirection:'column'}}>
                        <input onChange={(e)=>SEARCHUSER(e.target.value)} type="text"/>

                        <div style={{marginLeft:'auto',marginRight:'auto',marginTop:'30px', width:'100%'}}>

                            {spin ?
                                <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
                                    <Spinner style={{ width: "4rem", height: "4rem"}} animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </div>
                                :
                                <>
                                    {(searchResult!='No results' && searchResult!='') ?
                                        <>
                                            {searchResult.map(a=>{
                                                return(
                                                    <div onClick={()=> {
                                                        newChat({
                                                            name: a['nickname'],
                                                            owner_1_id: toJS(user.User)['_id'],
                                                            owner_2_id: a['_id'],
                                                            typeId: 1,
                                                            own_id: toJS(user.User)['_id']
                                                        })
                                                        //handleCloseSearch()
                                                    }} style={{width:'90%',marginLeft:'auto',marginRight:'auto',borderTop:'1px solid', borderBottom:'1px solid', height:'90px',display:'flex',alignItems:'center'}} id={a['_id']}>
                                                        <div style={{display:'flex', width:'90%'}}>
                                                            <div style={{height:'75px',width:'75px', borderRadius:'50%', overflow:'hidden'}}>

                                                                {a['AvatarName']!='none' ?
                                                                    <img style={{height:'100%',width:'100%'}} src={process.env.REACT_APP_SERVER_URL+'/'+a['AvatarName']} alt=""/>
                                                                    :
                                                                    <img style={{height:'100%',width:'100%'}} src={UserImg} alt=""/>
                                                                }

                                                            </div>
                                                            <div className='special_class'>
                                                                <b style={{margin:'0'}}>{a['nickname']}</b>
                                                                <p style={{margin:'0'}}>{a['LastVisit']}</p>
                                                            </div>
                                                        </div>
                                                        {a.hasOwnProperty('contact') &&
                                                            <div style={{height:'100%',paddingTop:'10px'}}>
                                                                <b style={{color:"blue", marginTop:'25px', marginRight:'10px'}}>contact</b>
                                                            </div>
                                                        }
                                                    </div>
                                                )
                                            })
                                            }
                                        </>
                                        :
                                        <div style={{display:'flex',justifyContent:'center'}}>
                                            {searchResult}
                                        </div>
                                    }
                                </>
                            }

                        </div>


                    </Modal.Body>
                    <Modal.Footer style={{marginTop:'90px'}}>
                        <Button variant="secondary" onClick={handleCloseSearch}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={()=>{
                            handleCloseSearch()
                        }}>
                            Add
                        </Button>
                    </Modal.Footer>

                </Modal>
            </div>
        </>
    );
});

export default ChatBar;