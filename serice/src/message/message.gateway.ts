import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer} from "@nestjs/websockets";
//import {Server} from "@nestjs/platform-socket.io"
import { MessageService } from './message.service';
import { CreateMessageDto } from './create-message.dto';
import {ChatService} from "../chat/chat.service";
import {Socket} from 'socket.io'
import {TokenService} from "./token.service";
const fs = require('fs')
import { randomUUID } from 'crypto';

// import { UpdateMessageDto } from './dto/update-message.dto';

@WebSocketGateway()
export class MessageGateway {
  @WebSocketServer() server;


  constructor(private readonly messageService: MessageService,private readonly tokenService: TokenService,private readonly chatService: ChatService) {}
  socket_id: string = ''

  //ОБЬЕКТ КЛЮЧ-ЗНАЧЕНИЕ  SocketId - SocketConnection
  users: Object={};

  handleConnection(client: Socket) {
    this.socket_id=client.id
    const test= this.socket_id
    this.users[test]= { userId:'',socket:client, StreamUserStatus:[], StreamMessages:[] }
  }
  handleDisconnect(client:Socket){
    this.messageService.offline_test(this.users[client.id]['userId']).then(a=>{
      //this.server.emit('user_offline',{user:'hard code offline'})


      //проходимся по всем пользователям
      for (var key of Object.keys(this.users)) {
        const status_streams = this.users[key]['StreamUserStatus']
        if(status_streams) {
          if (status_streams.includes(String(a['_id']))) {

            this.users[key]['socket'].send({
              'stream_offline': {
                'id': String(a['_id']),
                'LastVisit': a['LastVisit']
              }
            })
          }
        }
      }

      delete this.users[client.id]
    })

  }
  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: CreateMessageDto) {
    const socketID = createMessageDto['socketID']
    if(!createMessageDto.hasOwnProperty('chatId')){
      const CHAT = await this.chatService.findOneSecond(createMessageDto['owner_1_id'],createMessageDto['owner_2_id'])
      /////////////
      ///////////////
      //////////
      createMessageDto['chatId']=String(CHAT['_id'])
    }
    const new_mess = this.messageService.create(createMessageDto).then(async(e)=>{
      //return this.users[socketID].send(JSON.stringify(e))
      let companion
      if(e.hasOwnProperty('chatId')){
        companion = await this.chatService.findOne(e['chatId'])
      }
      else{
        companion=await this.chatService.findOneSecond(createMessageDto['owner_1_id'],createMessageDto['owner_2_id'])
      }

      const message_owner=e['owner']
      let second_user_id
      if(typeof(companion)=='object'){
        let test=[]
        test.push(companion)
        companion=test
      }
      if(message_owner==companion[0]['owner_1_id']){
        second_user_id=companion[0]['owner_2_id']
      }
      else if(message_owner==companion[0]['owner_2_id']){
        second_user_id=companion[0]['owner_1_id']
      }

      const user_obj_keys=Object.keys(this.users)

      const OWNER = await this.messageService.get_user_status(createMessageDto['owner'])

      e['_doc']['nickname']=OWNER['nickname']
      for (let i = 0; i < user_obj_keys.length; i++) {
        const key =user_obj_keys[i]
        if(this.users[key]['userId']==second_user_id){
          this.users[key]['socket'].send({'stream_message':e['_doc']})
        }
      }

      return this.users[socketID]['socket'].send({ 'message':JSON.stringify(e) })

    });
  }

  @SubscribeMessage('createMessageFile')
  async createMessageFile(@MessageBody() body){
    const filename=randomUUID()
    fs.writeFileSync('../serice/src/images/'+filename+'.png',body['data'])
    let BODY = body
    delete BODY['data']
    BODY['filename']=filename+'.png'
    const db_mess = await this.create(BODY)
  }
  @SubscribeMessage('online')
  async online(@MessageBody() token){

    const socket_id = token['id']
    const token_user_id = await this.tokenService.VerifyAccessToken(token['token'])
    if(token_user_id) {
      const user=token_user_id['user']
      this.users[socket_id]['userId']=user['_id']
      const user_id =String(user['_id'])
      for (var key of Object.keys(this.users)) {

        const status_streams = this.users[key]['StreamUserStatus']
        if(status_streams.includes(user_id)){
          this.users[key]['socket'].send({'stream_online':user_id})
        }
      }
      return this.messageService.online(token)

    }
    else{
      return 'invalid token'
    }
  }
  @SubscribeMessage('stream_user_status')
  async stream_status(@MessageBody() socketId){
   // console.log('stream')
    const SOCKET_ID=socketId['id']
    let status_obj = []
    //ПРОХОДИМСЯ ПО ВСЕМ ОТПРАВЛЕННЫМ КОНТАКТАМ
    //console.log(Object.keys(this.users[SOCKET_ID]))
    for (let i = 0; i < socketId['stream_user_id'].length; i++) {
      let stream_id
      if(socketId['stream_user_id'][i].hasOwnProperty('userId')){
        stream_id = socketId['stream_user_id'][i]['userId']
      }
      else if (socketId['stream_user_id'][i].hasOwnProperty('_id')){
        stream_id = socketId['stream_user_id'][i]['_id']
      }
      //ДЕЛАЕМ ПРОВЕРКУ НА НАЛИЧИЕ СТРИМОВ У ПОЛЬЗОВАТЕЛЯ, В СЛУЧАЕ ОТСУТСВИЯ ЗАСОВЫВАЕМ АЙДИ В МАССИВ
        if (this.users[SOCKET_ID]['StreamUserStatus'].length != 0) {
          //ПРОХОДИМСЯ ПО ВСЕМ СТРИМАМ

          return new Promise(async (resolve, reject) => {
            const arr = this.users[SOCKET_ID]['StreamUserStatus']
            for (let i = 0; i < arr.length; i++) {
              const elem = arr[i]
              if (elem != stream_id) {
                this.users[SOCKET_ID]['StreamUserStatus'].push(stream_id)
                const get_status_user = await this.messageService.get_user_status(stream_id)
                status_obj.push({ 'userId': stream_id, 'status': get_status_user['LastVisit'] })
              }
            }
            resolve(status_obj)
          }).then((a) => {

            if (i == socketId['stream_user_id'].length - 1) {

              this.users[SOCKET_ID]['socket'].send({ 'stream_contacts': status_obj })
            }
          })


        } else {

          const get_status_user = await this.messageService.get_user_status(stream_id)
          status_obj.push({ 'userId': stream_id, 'status': get_status_user['LastVisit'] })
          this.users[SOCKET_ID]['StreamUserStatus'].push(stream_id)
          //
          //this.users[SOCKET_ID]['socket'].send({'stream_contacts': status_obj } )
          //
        }
    }
    if(status_obj.length!=0){
      this.users[SOCKET_ID]['socket'].send({'stream_contacts': status_obj } )
    }

    //console.log(status_obj)
  }

  // @SubscribeMessage('stream_messages')
  // async stream_messages(@MessageBody() body){
  //   const SOCKET_ID=body['id']
  //   //if(!this.users[SOCKET_ID].includes())
  //   const chats = body['chats']
  //   for (let i = 0; i < chats.length; i++) {
  //     if(!this.users[SOCKET_ID].includes(chats[i])){
  //       this.users[SOCKET_ID]['StreamMessages'].push()
  //     }
  //   }
  // }
  @SubscribeMessage('delete_stream_user_status')
  delete_status(@MessageBody() socket){
    const contacts = socket['delete_stream_user_id']
    contacts.forEach(e=>{
      let a
      if(e.hasOwnProperty('userId')){
        a= String(e['_id'])
      }
      else if(e.hasOwnProperty('_id')){
        a= String(e['_id'])
      }

      this.users[socket['id']]['StreamUserStatus'].forEach(ID=>{
        if(ID==a){
          this.users[socket['id']]['StreamUserStatus'].splice(this.users[socket['id']]['StreamUserStatus'].indexOf(ID),1)
        }
      })
    })
  }
  @SubscribeMessage('offline')
  offline(@MessageBody() token){
   // console.log('offline: ', token)
    return this.messageService.offline(token)
  }

  @SubscribeMessage('search_user')
  async search(@MessageBody() mess){
    const SRC = await this.messageService.search(mess)

    let OBJ_ARR=[]
    if(SRC){
      SRC.forEach(A=>{
        delete A.password
        delete A.refreshtoken
        //delete A.__v
        delete A.chats
        delete A.contacts
        OBJ_ARR.push(A)
      })

    }

    if(OBJ_ARR){
      if(this.users.hasOwnProperty(mess["id"])){
        this.users[mess["id"]]["socket"].send({ "search_result": OBJ_ARR });
      }
    }
    else{
      if(this.users.hasOwnProperty(mess["id"])) {
        this.users[mess["id"]]["socket"].send({ "search_result": false });
      }
    }

    // SRC.then(a=> {
    //   delete a['password']
    //   delete a['refreshtoken']
    //   delete a['__v']
    //   delete a['chats']
    //   delete a['contacts']
    //   delete a['AvatarName']
    //   console.log(a)
    //   this.users[mess["id"]]["socket"].send({ "search_result": a });
    // })
  }
  // @SubscribeMessage('findAllMessage')
  // findAll() {
  //   return this.messageService.findAll();
  // }
  //
  // @SubscribeMessage('findOneMessage')
  // findOne(@MessageBody() id: number) {
  //   return this.messageService.findOne(id);
  // }
  //
  // @SubscribeMessage('updateMessage')
  // update(@MessageBody() updateMessageDto: UpdateMessageDto) {
  //   return this.messageService.update(updateMessageDto.id, updateMessageDto);
  // }
  //
  // @SubscribeMessage('removeMessage')
  // remove(@MessageBody() id: number) {
  //   return this.messageService.remove(id);
  // }
}
