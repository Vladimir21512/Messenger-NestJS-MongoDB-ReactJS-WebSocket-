import {makeAutoObservable, toJS} from 'mobx'

export default class MessageStore {

    constructor() {
        this._messages = []
        makeAutoObservable(this)
    }

    NewMessage(message){
        message = JSON.parse(message)
        this._messages.push(message)
    }
    get messages(){
        return this._messages;
    }
}

