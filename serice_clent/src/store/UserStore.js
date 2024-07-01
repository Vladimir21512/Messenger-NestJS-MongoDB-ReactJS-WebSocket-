import {makeAutoObservable} from "mobx";

export default class UserStore{
    constructor() {
        this._isAuth = false
        this._contacts = false
        this._chat = {}
        this._chatList=[]
        this._chatListNames=[]
        this._user={}
        this._user = {}
        makeAutoObservable(this)
    }
    SetChatListNames(arr){
        this._chatListNames=arr
    }
    SetChatList(list){
        this._chatList=list
    }
    SetChat(chat){
        this._chat=chat
    }
    SetUser(user){
        this._user=user
    }
    setIsAuth(bool){
        this._isAuth = bool
    }
    setContacts(contacts){
        this._contacts=contacts
    }
    get Chat(){
        return this._chat
    }
    get ChatList(){
        return this._chatList
    }
    get ChatListNames(){
        return this._chatListNames
    }
    get Contacts(){
        return this._contacts
    }
    get User(){
        return this._user
    }
    setUser(user){
        this._user = user
    }

    get isAuth(){
        return this._isAuth
    }
    get user(){
        return this._user
    }
}