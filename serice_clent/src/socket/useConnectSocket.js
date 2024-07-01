import React, {useContext, useEffect, useState} from 'react';
import SocketApi from './SocketApi'
import {Context} from "../index";
import {toJS} from "mobx";

export const UseConnectSocket = () => {
    const {message, user} = useContext(Context)
    const [messages, setMessage] = useState('')
    let USER

    const connectSocket = () => {
        const socket = SocketApi.createConnection()
        SocketApi.socket.on('message', (e) => {
            if(typeof(e)=='object'){
                if(e.hasOwnProperty('stream_contacts')){
                    const streams = e['stream_contacts']

                    let update_contacts = toJS(user.Contacts)
                    //console.log('streams:'+streams)
                    if(toJS(user.Contacts).length!=0) {
                        for (let i = 0; i < update_contacts.length; i++) {
                            const contact_user_id = update_contacts[i]['userId']
                            //console.log(update_contacts[i])
                            for (let a = 0; a < streams.length; a++) {
                                if (streams[a]['userId'] == contact_user_id) {
                                    update_contacts[i]['status'] = streams[a]['status']
                                }
                            }
                        }
                        user.setContacts(update_contacts)
                        const own_id = toJS(user.User)['_id']

                        if(!toJS(user.Chat).hasOwnProperty('status')){
                            for (let i = 0; i < toJS(user.Contacts).length; i++) {
                                let check_var = null
                                if (own_id == toJS(user.Chat)['owner_1_id']) {
                                    check_var = toJS(user.Chat)['owner_2_id']
                                } else if (own_id == toJS(user.Chat)['owner_2_id']) {
                                    check_var = toJS(user.Chat)['owner_1_id']
                                }

                                if (toJS(user.Contacts)[i]['userId'] == check_var) {

                                    if (toJS(user.Contacts)[i].hasOwnProperty('status')) {
                                        let chat_obj = toJS(user.Chat)
                                        if (toJS(user.Contacts)[i]['status'] != 'online') {
                                            let stat = toJS(user.Contacts)[i]['status']
                                            chat_obj['status'] = stat.split(' ')[1] + ' ' + stat.split(' ')[2] + ' ' + stat.split(' ')[3] + ' ' + stat.split(' ')[4]
                                        } else {
                                            chat_obj['status'] = 'online'
                                        }
                                        user.SetChat(chat_obj)
                                        break
                                    }
                                }
                            }
                        }

                    }

                    if(!toJS(user.Chat).hasOwnProperty('status')){
                        const own_id=toJS(user.User)['_id']
                        let check_var = null
                        let chat_obj=toJS(user.Chat)
                        if(own_id==toJS(user.Chat)['owner_2_id']){
                            check_var = toJS(user.Chat)['owner_1_id']
                        }
                        else if(own_id==toJS(user.Chat)['owner_1_id']){
                            check_var = toJS(user.Chat)['owner_2_id']
                        }
                        for (let i = 0; i <streams.length ; i++) {
                            if(streams[i]['userId']==check_var){
                                if(streams[i]['status']=='online'){
                                    chat_obj['status']='online'
                                }
                                else{
                                    let stat = streams[i]['status']
                                    chat_obj['status'] = stat.split(' ')[1] + ' ' + stat.split(' ')[2] + ' ' + stat.split(' ')[3] + ' ' + stat.split(' ')[4]
                                }
                            }
                        }
                        user.SetChat(chat_obj)
                    }

                }
                else if(e.hasOwnProperty('stream_online')){

                    const online_user_id = e['stream_online']
                    let update_contacts = toJS(user.Contacts)
                    for (let i = 0; i < update_contacts.length; i++) {
                        if(update_contacts[i]['userId']==online_user_id){
                            update_contacts[i]['status']='online'

                            if(toJS(user.Chat).hasOwnProperty('status')){
                                if(toJS(user.Chat)['name']==update_contacts[i]['name']){
                                    let obj = toJS(user.Chat)
                                    obj['status']='online'
                                    user.SetChat(obj)
                                }
                            }

                        }
                    }
                    user.setContacts(update_contacts)


                    let check_var = null

                    if(toJS(user.User)['_id']==toJS(user.Chat)['owner_1_id']){
                        check_var = toJS(user.Chat)['owner_2_id']
                    }
                    else if(toJS(user.User)['_id']==toJS(user.Chat)['owner_2_id']){
                        check_var = toJS(user.Chat)['owner_1_id']
                    }

                    if(online_user_id==check_var){
                        let chat_obj = toJS(user.Chat)
                        chat_obj['status']='online'
                        user.SetChat(chat_obj)
                    }

                }
                else if(e.hasOwnProperty('stream_offline')){
                    const online_user_id = e['stream_offline']['id']
                    let update_contacts = toJS(user.Contacts)
                    //console.log('streams:'+streams)
                    for (let i = 0; i < update_contacts.length; i++) {
                        if(update_contacts[i]['userId']==online_user_id){
                            update_contacts[i]['status']=e['stream_offline']['LastVisit']

                            if(toJS(user.Chat).hasOwnProperty('status')){
                                if(toJS(user.Chat)['name']==update_contacts[i]['name']){
                                    let obj = toJS(user.Chat)
                                    let per = e['stream_offline']['LastVisit']
                                    obj['status']=per.split(' ')[1]+' '+per.split(' ')[2]+' '+per.split(' ')[3]+' '+per.split(' ')[4]
                                    user.SetChat(obj)
                                }
                            }

                        }
                    }
                    user.setContacts(update_contacts)

                    let check_var = null

                    if(toJS(user.User)['_id']==toJS(user.Chat)['owner_1_id']){
                        check_var = toJS(user.Chat)['owner_2_id']
                    }
                    else if(toJS(user.User)['_id']==toJS(user.Chat)['owner_2_id']){
                        check_var = toJS(user.Chat)['owner_1_id']
                    }

                    if(online_user_id==check_var){
                        let chat_obj = toJS(user.Chat)
                        let LastVisit = e['stream_offline']['LastVisit']
                        chat_obj['status']=LastVisit.split(' ')[1]+' '+LastVisit.split(' ')[2]+' '+LastVisit.split(' ')[3]+' '+LastVisit.split(' ')[4]
                        user.SetChat(chat_obj)
                    }
                }
                else if (e.hasOwnProperty('message')){
                    const ala = JSON.parse(e['message'])
                    let chat = toJS(user.Chat)
                    if(chat.hasOwnProperty('messages')) {
                        chat['messages'].push(ala)
                        user.SetChat(chat)

                        //МЕНЯЕМ ChatList
                        const chatId=ala['chatId']

                        let chat_list=[]
                        toJS(user.ChatList).forEach(A=>{
                            let Item = A
                            if(A['_id']==chatId){
                                if(!Item.hasOwnProperty('messages')){
                                    let new_arr=[]
                                    new_arr.push(ala)
                                    Item['messages']=new_arr
                                }
                                else{
                                    let MESS=A['messages']
                                    MESS.push(ala)
                                    Item['messages']=MESS
                                }
                            }
                            chat_list.push(Item)
                        })
                        user.SetChatList(chat_list)
                        //////////////
                    }
                    else{
                        let arr=[]
                        arr.push(ala)
                        chat['messages']=arr
                        user.SetChat(chat)

                        const chatId=ala['chatId']
                        let chat_list=[]

                        toJS(user.ChatList).forEach(A=>{
                            let Item = A
                            if(A['_id']==chatId){
                                if(!Item.hasOwnProperty('messages')){
                                    let new_arr=[]
                                    new_arr.push(ala)
                                    Item['messages']=new_arr
                                }
                                else{
                                    let MESS=A['messages']
                                    MESS.push(ala)
                                    Item['messages']=MESS
                                }
                            }
                            chat_list.push(Item)
                        })
                        user.SetChatList(chat_list)
                    }

                    //console.log(toJS(user.ChatList))
                }
                else if (e.hasOwnProperty('stream_message')){
                    const message=e['stream_message']
                    const chatId= message['chatId']
                    let ChatListItem=toJS(user.ChatList)
                    let check = false
                    for (let i = 0; i < toJS(user.ChatList).length; i++) {
                        if(toJS(user.ChatList)[i]['_id']==chatId){
                            check=true
                            ChatListItem[i]['messages'].push(message)
                        }
                    }
                    if(!check){
                        console.log('!check')
                        let chat_list = toJS(user.ChatList)
                        let companion_name
                        let check_contacts=''
                        for (let i = 0; i < toJS(user.Contacts).length; i++) {
                            if(toJS(user.Contacts)[i]['userId']==message['owner']){
                                companion_name=toJS(user.Contacts)[i]['name']
                                check_contacts=true
                            }
                        }
                        if(!check_contacts){
                            companion_name=message['nickname']
                        }
                        let new_MESS = []
                        new_MESS.push(message)
                        let body = {'owner_1_id':toJS(user.User)['_id'],'owner_2_id':message['owner'],'name':companion_name,'messages':new_MESS,'_id':message['chatId']}
                        ChatListItem.unshift(body)

                        let name_arr = toJS(user.ChatListNames)

                        if(!name_arr.includes(companion_name)){
                            name_arr.unshift(companion_name)
                            user.SetChatListNames(name_arr)
                        }
                    }
                    if(message['chatId']==toJS(user.Chat)['_id']){
                        let ChatObj=toJS(user.Chat)
                        ChatObj['messages'].push(message)
                        user.SetChat(ChatObj)
                    }

                    user.SetChatList(ChatListItem)
                }
            }

        })

        SocketApi.socket.on('user_online',()=>{

        })
        SocketApi.socket.on('user_offline',()=>{

        })
        // if(!toJS(user.isAuth)){
        //     SocketApi.socket.on('offline', {'token':localStorage.getItem('token')})
        // }

    }

    {toJS(user.isAuth) &&
        connectSocket()
    }

    return {messages}
    //return true;
};

